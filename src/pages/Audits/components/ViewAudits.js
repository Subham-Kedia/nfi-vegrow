import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader, ConfirmationDialog } from 'Components';
import { FieldSelect } from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import useDevice from 'Hooks/useDevice';
import RouteTransformer from 'Routes/routeTransformer';
import { getNonZeroInventory } from 'Services/lots';
import { getUserByRoles } from 'Services/users';
import { notifyUser } from 'Utilities';
import { DEVICE_TYPE } from 'Utilities/constants';
import fileUpload from 'Utilities/fileUpload';
import { LibraryText } from 'vg-library/core';

import { AUDIT_STATUS, AUDIT_TYPE, FIELD_NAME, MODE } from '../constants';
import AddNewItems from '../modals/AddNewItems';
import AuditConfirmationModal from '../modals/AuditConfirmationModal';
import BackHandlerModal from '../modals/BackHandlerModal';
import AuditAPI from '../services';
import { useStyles } from '../styled';
import {
  disableDraftBtnWhenNoData,
  getMode,
  hasInventoryChanged,
  isFinishAuditDisabled,
} from '../utils';

import InventoryAuditMobile from './InventoryAuditMobile';
import InventoryGrid from './InventoryGrid';

const InventoryAudit = () => {
  const [initialValues, setInitialValues] = useState({
    audit_type: AUDIT_TYPE.MONTHLY.value,
    inventory_audit_items: [],
    remarks: '',
    approver_id: '',
  });
  const [openBackHandlerModal, setOpenBackHandlerModal] = useState(false);
  const [showAuditConfirmationModal, setShowAuditConfirmationModal] =
    useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowImages, setRowImages] = useState({});
  const [viewMethod, setViewMethod] = useState('');
  const [auditMetaInfo, setAuditMetaInfo] = useState({
    disable_message: '',
    current_month: '',
  });
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [approvers, setApprovers] = useState([]);

  const { auditId } = useParams();
  const mode = getMode(location.pathname);

  const navigate = useNavigate();
  const { dcId } = useSiteValue();
  const device = useDevice();
  const isMobile = device === DEVICE_TYPE.MOBILE;

  const { paperStyle, width12, draftButton, banner } = useStyles();
  const saveMethod = useRef();

  const handleCancelAudit = () => {
    setOpenBackHandlerModal(true);
  };

  const setSaveMethod = (method = '') => {
    saveMethod.current = method;
  };

  useEffect(() => {
    const currentInventoryAudit = () => {
      setLoading(true);
      Promise.all([
        getNonZeroInventory({ dcId }),
        AuditAPI.viewInventoryAudit(auditId),
      ])
        .then(
          ([{ items = [] }, { inventory_audit_items, audit_type, status }]) => {
            setViewMethod(status);
            const inventoryItemsDict = items.reduce(
              (
                acc,
                {
                  id,
                  available_quantity,
                  grade_c_quantity,
                  packed_lot_quantity,
                },
              ) => {
                acc[id] = {
                  nfi_packaging_item_id: id,
                  available_qty: available_quantity,
                  damaged_qty: grade_c_quantity,
                  packed_lot_qty: packed_lot_quantity,
                };
                return acc;
              },
              {},
            );

            const combinedItems = inventory_audit_items.map(
              (
                {
                  packaging_item: { item_name, item_code, id },
                  available_qty,
                  actual_available_qty,
                  damaged_qty,
                  actual_damaged_qty,
                  packed_lot_qty,
                  inventory_audit_item_images = [],
                  remarks,
                },
                index,
              ) => {
                // ignore the inventoryData if status is completed and pick from the user submitted data
                const inventoryItem =
                  mode !== MODE.EDIT
                    ? { available_qty, damaged_qty, packed_lot_qty }
                    : inventoryItemsDict[id] || {};

                setRowImages((prev) => ({
                  ...prev,
                  [index]: inventory_audit_item_images || [],
                }));

                return {
                  item_name,
                  item_code,
                  available_qty: inventoryItem.available_qty || 0,
                  actual_available_qty,
                  damaged_qty: inventoryItem.damaged_qty || 0,
                  actual_damaged_qty,
                  packed_lot_qty: inventoryItem.packed_lot_qty || 0,
                  inventory_audit_item_images,
                  nfi_packaging_item_id: id,
                  remarks,
                };
              },
            );

            if (mode === MODE.EDIT) {
              const isInventoryChanged = hasInventoryChanged(
                inventory_audit_items,
                inventoryItemsDict,
              );

              setShowWarningPopup(isInventoryChanged);
            }

            setInventoryData(combinedItems);

            setInitialValues((prevValues) => ({
              ...prevValues,
              audit_type,
              inventory_audit_items: combinedItems,
            }));
          },
        )
        .finally(() => {
          setLoading(false);
        });
    };

    getUserByRoles({role: 'nfi_audit_approver'})
    .then((res) => {setApprovers(res.items || []);});

    const auditInfo = () => {
      AuditAPI.getAuditMetaInfo().then((res) => {
        setAuditMetaInfo(res);
      });
    };

    currentInventoryAudit();
    if (mode === MODE.EDIT) auditInfo();
  }, []);

  const submitHandler = async (values) => {
    const { audit_type, inventory_audit_items, remarks, approver_remarks, approver_id } =
      values;

    if (saveMethod.current === AUDIT_STATUS.REJECTED) {
      if (!approver_remarks) {
        notifyUser('Please Add Remarks', 'warning');
        return;
      }
      setLoading(true);
      AuditAPI.rejectInventoryAudit(auditId, { approver_remarks })
        .then(() => {
          navigate(`/app/${RouteTransformer.getAuditApproval()}`);
          notifyUser('Audit Rejected successfully');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (saveMethod.current === AUDIT_STATUS.COMPLETED) {
      setLoading(true);
      AuditAPI.approveInventoryAudit(auditId, { approver_remarks })
        .then(() => {
          navigate(`/app/${RouteTransformer.getAuditApproval()}`);
          notifyUser('Audit Approved successfully');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      const uploadPromises = inventory_audit_items.flatMap((item, index) =>
        rowImages[index].map((img) =>
          fileUpload([img]).then((result) => ({ index, result })),
        ),
      );

      const uploadResults = await Promise.all(uploadPromises);

      const groupedResults = uploadResults.reduce((acc, { index, result }) => {
        if (!acc[index]) {
          acc[index] = [];
        }
        acc[index].push(...result);
        return acc;
      }, {});

      const inventory_items = await Promise.all(
        inventory_audit_items.map(
          async (
            {
              nfi_packaging_item_id,
              available_qty,
              actual_available_qty,
              damaged_qty,
              actual_damaged_qty,
              packed_lot_qty,
              inventory_audit_item_images,
              remarks,
            },
            index,
          ) => {
            const signedIdOfExistingUploads = (
              inventory_audit_item_images || []
            ).map((url) => url.split('/').slice(-2, -1)[0]);

            const uploadResults = [
              ...signedIdOfExistingUploads,
              ...(groupedResults[index] || []),
            ];

            return {
              nfi_packaging_item_id,
              available_qty,
              actual_available_qty,
              damaged_qty,
              actual_damaged_qty,
              packed_lot_qty,
              remarks,
              inventory_audit_item_images: uploadResults,
            };
          },
        ),
      );

      const requestPayload = {
        inventory_audit: {
          status: saveMethod.current,
          audit_type,
          remarks,
          approver_id,
          inventory_audit_items: inventory_items,
        },
      };

      AuditAPI.updateAudit(auditId, requestPayload)
        .then(() => {
          navigate(`/app/${RouteTransformer.getAudits()}`);
          if (saveMethod === AUDIT_STATUS.DRAFT) {
            notifyUser('Audit drafted successfully');
          } else {
            notifyUser('Audit Submitted successfully');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleCloseModal = () => {
    setShowAuditConfirmationModal(null);
    setSaveMethod('');
  };

  const handleDiscardClick = () => {
    setLoading(true);
    AuditAPI.discardAudit(auditId)
      .then(() => {
        navigate(-1);
        setOpenBackHandlerModal(false);
        notifyUser('Audit Deleted successfully');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFinishAudit = () => {
    setSaveMethod(AUDIT_STATUS.PENDING_APPROVAL);
    setShowAuditConfirmationModal({
      open: true,
      title: 'Submit Audit',
      confirmBtnText: 'Confirm',
      message: 'Are you sure you want to complete the audit?',
      remarks_key: 'remarks',
      approver_key:"approver_id",
      approvers: approvers,
    });
  };

  const handleZeroInventoryItems = (items, newItems) => {
    setInitialValues(items);
    setInventoryData([...inventoryData, ...newItems]);

    const rowImageLength = Object.keys(rowImages).length;

    for (let i = 0; i < newItems.length; i += 1) {
      rowImages[rowImageLength + i] = [];
    }

    setRowImages({ ...rowImages });
  };

  const handleRemoveCard = (index, data) => {
    inventoryData.splice(index, 1);

    data[FIELD_NAME.INVENTORY_AUDIT_ITEMS].splice(index, 1);

    const rowImageLength = Object.keys(rowImages).length;
    for (let i = index; i < rowImageLength - 1; i += 1) {
      rowImages[i] = rowImages[i + 1];
    }

    delete rowImages[rowImageLength - 1];

    setInventoryData([...inventoryData]);
    setInitialValues(data);
    setRowImages({ ...rowImages });
  };

  const handleReject = () => {
    setSaveMethod(AUDIT_STATUS.REJECTED);
    setShowAuditConfirmationModal({
      open: true,
      title: 'Reject Audit',
      confirmBtnText: 'Reject',
      message: 'Are you sure you want to reject the audit?',
      remarks_key: 'approver_remarks',
    });
  };

  const handleApprove = () => {
    setSaveMethod(AUDIT_STATUS.COMPLETED);
    setShowAuditConfirmationModal({
      open: true,
      title: 'Submit Audit',
      confirmBtnText: 'Approve',
      message: 'Are you sure you want to approve the audit?',
      remarks_key: 'approver_remarks',
    });
  };

  return (
    <PageLayout
      showBackHandler={() =>
        viewMethod === AUDIT_STATUS.DRAFT ? handleCancelAudit() : navigate(-1)
      }
      title={`View Audit ${auditId}`}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={submitHandler}
      >
        {({ values, handleChange, handleSubmit }) => (
          <>
            {values.audit_type === AUDIT_TYPE.MONTHLY.value &&
              mode === MODE.EDIT && (
                <LibraryText className={banner}>
                  {auditMetaInfo.disable_message ||
                    `Audit Month: ${auditMetaInfo.current_month}`}
                </LibraryText>
              )}
            <PageLayout.Body>
              <Paper className={paperStyle}>
                <FieldSelect
                  name="audit_type"
                  label="Audit Type"
                  options={Object.values(AUDIT_TYPE)}
                  size="small"
                  className={width12}
                  disabled={mode !== MODE.EDIT}
                />
              </Paper>
              {loading ? (
                <AppLoader />
              ) : (
                <FieldArray
                  name="inventory_audit_items"
                  render={() => {
                    if (isMobile) {
                      return (
                        <InventoryAuditMobile
                          data={inventoryData}
                          rowImages={rowImages}
                          setRowImages={setRowImages}
                          cellProps={{
                            handleChange,
                            values,
                            saveMethod,
                            isEditable: mode === MODE.EDIT,
                            handleRemoveCard,
                          }}
                        />
                      );
                    }
                    return (
                      <InventoryGrid
                        data={inventoryData}
                        rowImages={rowImages}
                        setRowImages={setRowImages}
                        cellProps={{
                          handleChange,
                          values,
                          saveMethod,
                          viewMethod,
                          handleRemoveCard,
                          isEditable: mode === MODE.EDIT,
                        }}
                      />
                    );
                  }}
                />
              )}
              <BackHandlerModal
                openBackHandlerModal={openBackHandlerModal}
                setOpenBackHandlerModal={setOpenBackHandlerModal}
                handleDiscardClick={handleDiscardClick}
                handleSubmit={handleSubmit}
                setSaveMethod={setSaveMethod}
                loading={loading}
                values={values}
                rowImages={rowImages}
                isViewDraftAudit
              />
              {!!showAuditConfirmationModal && (
                <AuditConfirmationModal
                  handleSubmit={handleSubmit}
                  loading={loading}
                  handleClose={handleCloseModal}
                  {...showAuditConfirmationModal}
                />
              )}
              {mode === MODE.EDIT && (
                <AddNewItems
                  handleSubmit={handleZeroInventoryItems}
                  selectedItems={values[
                    FIELD_NAME.INVENTORY_AUDIT_ITEMS
                  ].filter(({ isZeroInventoryItem }) => !!isZeroInventoryItem)}
                  inventoryData={inventoryData}
                />
              )}
            </PageLayout.Body>

            {mode === MODE.EDIT && (
              <PageLayout.Footer>
                {viewMethod === AUDIT_STATUS.DRAFT && (
                  <AppButton
                    color="inherit"
                    variant="outlined"
                    size="medium"
                    className={draftButton}
                    onClick={() => {
                      setSaveMethod(AUDIT_STATUS.DRAFT);
                      handleSubmit();
                    }}
                    disabled={
                      disableDraftBtnWhenNoData(values, rowImages) || loading
                    }
                  >
                    Save as Drafts
                  </AppButton>
                )}
                <AppButton
                  size="medium"
                  onClick={handleFinishAudit}
                  disabled={isFinishAuditDisabled(
                    loading,
                    values,
                    auditMetaInfo,
                  )}
                >
                  Finish Audit
                </AppButton>
              </PageLayout.Footer>
            )}
            {mode === MODE.REVIEW && (
              <PageLayout.Footer>
                <AppButton
                  color="error"
                  variant="outlined"
                  size="medium"
                  className="margin-horizontal"
                  onClick={handleReject}
                >
                  Reject
                </AppButton>
                <AppButton size="medium" onClick={handleApprove}>
                  Approve
                </AppButton>
              </PageLayout.Footer>
            )}
            {showWarningPopup && (
              <ConfirmationDialog
                title="Warning!"
                onConfirm={() => setShowWarningPopup(false)}
                open={showWarningPopup}
              >
                Inventory has changed since the time this draft was created
              </ConfirmationDialog>
            )}
          </>
        )}
      </Formik>
    </PageLayout>
  );
};

export default InventoryAudit;
