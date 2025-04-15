import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Tab, Tabs } from '@mui/material';
import Popper from '@mui/material/Popper';
import PageLayout from 'App/PageLayout';
import {
  AppButton,
  AppLoader,
  CustomPagination,
  GridListView,
} from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import { MATERIAL_ASSIGNMENT_VENDORS_TABS } from 'Utilities/constants/MaterialAssignment';
import imageUpload from 'Utilities/directUpload';
import { LibraryText } from 'vg-library/core';

import { MA_TYPES, PRINT_BASE_URL } from '../../const';
import VendorAcknowledgement from '../../Popups/VendorAcknowledgement';
import {
  VENDORS_LEDGER_ACKNOWLEDGE_COLUMNS,
  VENDORS_LEDGER_OPEN_COLUMNS,
} from '../column';
import { classes } from '../style';

const PAGE_SIZE = 10;

const VendorLedger = ({
  backHandlerLink = RouteTransformer.getMaterialAssignmentVendorsListing(),
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(MATERIAL_ASSIGNMENT_VENDORS_TABS.OPEN.value);
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const popperRef = useRef(null);
  const [page, setPage] = useState(1);
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [vendorData, setVendorData] = useState({});
  const open = Boolean(anchorEl);
  const maId = useRef();

  const { paper, popper, popperText, actionFont } = classes();
  const [loading, setLoading] = useState(false);

  // MA ids in the state will be in expanded view
  const [expandedItems, setExpandedItems] = useState(new Set());

  const vendorAcknowledgementField = 'vendorAcknowledgement';

  const {
    data = [],
    totalCount,
    vendorName,
    vendorId,
    vendorPhone,
  } = vendorData;
  const backHandler = () => {
    navigate(`/app/${backHandlerLink}`);
  };

  const handleChangeTab = (_, newTab) => {
    setTab(newTab);
    setPage(1);
    setExpandedItems(new Set());
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchVendorData({ newPage });
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handlePrintClick = (maId) => {
    const params = {
      material_assignment_id: +maId,
    };

    const url = `${PRINT_BASE_URL.VENDOR_LEDGER}?${serialize(params)}`;

    window.open(url, '_blank');
  };

  const handleClone = (id) => {
    navigate(`/app/${RouteTransformer.getCloneMA()}`, {
      state: {
        type: MA_TYPES.VENDOR,
        id,
      },
    });
  };

  const editHandler = (id) => {
    navigate(`/app/${RouteTransformer.getEditVendorMA(id)}`);
  };

  const handleVendorAcknowledgement = async (file) => {
    if (!file?.[vendorAcknowledgementField]?.[0]) {
      notifyUser('Uploading document is mandatory', 'warning');
      return;
    }

    const { data: { signed_id } = {} } =
      (await imageUpload(file[vendorAcknowledgementField][0])) || {};

    MaterialAssignmentAPI.uploadVendorAcknowledgement(maId.current, {
      material_assignment: {
        acknowledgement_signed_id: signed_id,
      },
    }).then(() => {
      setShowAcknowledgement(false);
      fetchVendorData();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popperRef.current && !popperRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setPage(1);
    fetchVendorData({ newPage: 1 });
  }, [tab]);

  //   Todo: Abhishek , fetch vendor Id from route and send it to payload

  const fetchVendorData = ({ newPage = page, selectedTab = tab } = {}) => {
    setLoading(true);
    MaterialAssignmentAPI.getMaVendorLedger({
      vendor_id: id,
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      is_open: selectedTab,
    })
      .then(
        ({
          items = [],
          total_count = 0,
          vendor_name,
          vendor_id,
          vendor_phone,
        }) => {
          setVendorData({
            data: items.map((item) => ({ ...item, comments: item.remark })),
            vendorName: vendor_name,
            vendorId: vendor_id,
            vendorPhone: vendor_phone,
            totalCount: total_count,
          });
        },
      )
      .catch(() => {
        setTab(MATERIAL_ASSIGNMENT_VENDORS_TABS.OPEN.value);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleExpandableItemsList = (vendorId) => {
    const newItems = new Set(expandedItems);
    if (expandedItems.has(vendorId)) {
      newItems.delete(vendorId);
    } else {
      newItems.add(vendorId);
    }
    setExpandedItems(newItems);
  };

  const getColumns = () => {
    let additionalColumns = [];
    switch (tab) {
      case MATERIAL_ASSIGNMENT_VENDORS_TABS.OPEN.value:
        additionalColumns = [...VENDORS_LEDGER_OPEN_COLUMNS];
        break;

      case MATERIAL_ASSIGNMENT_VENDORS_TABS.ACKNOWLEDGED.value:
        additionalColumns = [...VENDORS_LEDGER_ACKNOWLEDGE_COLUMNS];
        break;

      default:
        break;
    }

    return [...additionalColumns];
  };

  return (
    <PageLayout
      title={vendorName}
      showBackHandler={backHandler}
      titleComponent={
        <div>
          <AppButton variant="contained" color="primary" onClick={handleClick}>
            Action
            <MoreVertIcon
              className="text-[1.2rem] cursor-pointer"
              aria-describedby={open ? 'void-so-btn' : undefined}
            />
          </AppButton>
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            placement="bottom-end"
            className={popper}
            ref={popperRef}
          >
            <ul className={paper}>
              <li className={popperText}>
                <LibraryText
                  onClick={() => {
                    navigate(
                      `/app/${RouteTransformer.getCreateMaterialAssignmentVendorLink()}`,
                      {
                        state: {
                          name: vendorName,
                          id: vendorId,
                          phone: vendorPhone,
                        },
                      },
                    );
                  }}
                  variant="subtitle"
                  className={actionFont}
                >
                  Add Material Assignment
                </LibraryText>
              </li>
              <li className={popperText}>
                <LibraryText
                  variant="subtitle"
                  onClick={() => {
                    navigate(
                      `/app/${RouteTransformer.getReturnMAVendor(vendorId)}`,
                    );
                  }}
                  className={actionFont}
                >
                  Return
                </LibraryText>
              </li>
              <li className={popperText}>
                <LibraryText
                  variant="subtitle"
                  onClick={() => {
                    navigate(
                      `/app/${RouteTransformer.getAdjustMAVendor(vendorId)}`,
                    );
                  }}
                  className={actionFont}
                >
                  Adjustment
                </LibraryText>
              </li>
            </ul>
          </Popper>
        </div>
      }
    >
      <PageLayout.Body>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          textColor="primary"
          indicatorColor="primary"
        >
          {Object.values(MATERIAL_ASSIGNMENT_VENDORS_TABS).map(
            ({ value, label }) => (
              <Tab label={label} key={value} value={value} />
            ),
          )}
        </Tabs>
        {loading ? (
          <AppLoader />
        ) : (
          <GridListView
            cellProps={{
              handlePrintClick,
              field: 'vendor_ledger',
              setShowAcknowledgement,
              maId,
              editHandler,
              handleClone,
              expandedItems,
              toggleExpandableItemsList,
            }}
            data={data}
            columns={getColumns()}
            isHeaderSticky
          />
        )}
        {showAcknowledgement && (
          <VendorAcknowledgement
            open={showAcknowledgement}
            onClose={() => setShowAcknowledgement(false)}
            field={vendorAcknowledgementField}
            handleSubmit={handleVendorAcknowledgement}
          />
        )}
      </PageLayout.Body>
      <CustomPagination
        count={Math.ceil(totalCount / PAGE_SIZE) || 1}
        page={page}
        shape="rounded"
        onChange={handleChangePage}
      />
    </PageLayout>
  );
};

export default VendorLedger;
