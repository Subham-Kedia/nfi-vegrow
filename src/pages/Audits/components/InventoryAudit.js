import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader } from 'Components';
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

import { AUDIT_STATUS, AUDIT_TYPE, FIELD_NAME } from '../constants';
import AddNewItems from '../modals/AddNewItems';
import AuditConfirmationModal from '../modals/AuditConfirmationModal';
import BackHandlerModal from '../modals/BackHandlerModal';
import AuditAPI from '../services';
import { useStyles } from '../styled';
import { disableDraftBtnWhenNoData, isFinishAuditDisabled } from '../utils';

import InventoryAuditMobile from './InventoryAuditMobile';
import InventoryGrid from './InventoryGrid';

const InventoryAudit = () => {
  const [initialValues, setInitialValues] = useState({
    audit_type: AUDIT_TYPE.MONTHLY.text,
    inventory_audit_items: [],
    remarks: '',
    approver_id: '',
  });
  const [openBackHandlerModal, setOpenBackHandlerModal] = useState(false);
  const [openFinishConfirmationModal, setFinishConfirmationModal] =
    useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowImages, setRowImages] = useState({});
  const [auditMetaInfo, setAuditMetaInfo] = useState({
    disable_message: '',
    current_month: '',
  });
  const [approvers, setApprovers] = useState([]);

  const navigate = useNavigate();
  const { dcId } = useSiteValue();
  const device = useDevice();
  const { draftButton, paperStyle, width12, banner } = useStyles();
  const saveMethod = useRef();

  const isMobile = device === DEVICE_TYPE.MOBILE;

  const handleCancelAudit = () => {
    setOpenBackHandlerModal(true);
  };

  const setSaveMethod = (method) => {
    saveMethod.current = method || '';
  };

  const closeModal = () => {
    setFinishConfirmationModal(false);
    setSaveMethod('');
  };

  useEffect(() => {
    const currentInventoryAudit = () => {
      setLoading(true);
      getNonZeroInventory({ dcId })
        .then(({ items = [] }) => {
          setInventoryData(items);

          const inventoryItems = items.map(
            ({
              id,
              available_quantity,
              grade_c_quantity,
              packed_lot_quantity,
              remarks,
            }) => ({
              nfi_packaging_item_id: id,
              available_qty: available_quantity,
              damaged_qty: grade_c_quantity,
              packed_lot_qty: packed_lot_quantity,
              remarks,
            }),
          );

          setInitialValues((prevValues) => ({
            ...prevValues,
            inventory_audit_items: inventoryItems,
          }));

          const initialRowImages = {};

          items.forEach((_, index) => {
            initialRowImages[index] = [];
          });
          setRowImages(initialRowImages);
        })
        .finally(() => {
          setLoading(false);
        });

        getUserByRoles({role: 'nfi_audit_approver'})
        .then((res) => {setApprovers(res.items || []);});
    };
    const auditInfo = () => {
      AuditAPI.getAuditMetaInfo().then((res) => {
        setAuditMetaInfo(res);
      });
    };
    currentInventoryAudit();
    auditInfo();
  }, []);

  const submitHandler = async (values) => {
    setLoading(true);
    const { audit_type, inventory_audit_items, remarks, approver_id } = values;

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
            remarks,
          },
          index,
        ) => {
          return {
            nfi_packaging_item_id,
            available_qty,
            actual_available_qty,
            damaged_qty,
            actual_damaged_qty,
            packed_lot_qty,
            remarks,
            inventory_audit_item_images: groupedResults[index] || [],
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

    AuditAPI.createInventoryAudit(requestPayload)
      .then(() => {
        navigate(`/app/${RouteTransformer.getAudits()}`);
        if (saveMethod === AUDIT_STATUS.DRAFT) {
          notifyUser('Audit drafted successfully');
        } else {
          notifyUser('Audit Completed successfully');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDiscardClick = () => {
    navigate(-1);
    setOpenBackHandlerModal(false);
  };

  const handleFinishAudit = () => {
    setSaveMethod(AUDIT_STATUS.PENDING_APPROVAL);
    setFinishConfirmationModal(true);
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

  return (
    <PageLayout showBackHandler={handleCancelAudit} title="Inventory Audit">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={submitHandler}
      >
        {({ values, handleChange, handleSubmit }) => (
          <>
            {values.audit_type === AUDIT_TYPE.MONTHLY.value && (
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
                            handleRemoveCard,
                            isEditable: true,
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
                          handleRemoveCard,
                          isEditable: true,
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
              />
              <AuditConfirmationModal
                title="Submit Audit"
                message="Are you sure you want to submit this audit?"
                confirmBtnText="Confirm"
                remarks_key="remarks"
                approver_key="approver_id"
                approvers={approvers}
                open={openFinishConfirmationModal}
                handleSubmit={handleSubmit}
                loading={loading}
                handleClose={closeModal}
              />
              <AddNewItems
                handleSubmit={handleZeroInventoryItems}
                selectedItems={values[FIELD_NAME.INVENTORY_AUDIT_ITEMS].filter(
                  ({ isZeroInventoryItem }) => !!isZeroInventoryItem,
                )}
              />
            </PageLayout.Body>
            <PageLayout.Footer>
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
              <AppButton
                size="medium"
                onClick={handleFinishAudit}
                disabled={isFinishAuditDisabled(loading, values, auditMetaInfo)}
              >
                Finish Audit
              </AppButton>
            </PageLayout.Footer>
          </>
        )}
      </Formik>
    </PageLayout>
  );
};

export default InventoryAudit;
