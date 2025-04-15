import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import { serialize } from 'Utilities';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import PrintButton from '../../components/PrintButton';
import { MA_TYPES, PRINT_BASE_URL } from '../../const';
import { CUSTOMER_LEDGER_COLUMNS } from '../ledgerColumn';
import { classes } from '../style';

const PAGE_SIZE = 10;

const CustomerLedger = ({
  backHandlerLink = RouteTransformer.getMaterialAssignmentCustomersListing(),
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const popperRef = useRef(null);
  const [page, setPage] = useState(1);
  const [customerData, setCustomerData] = useState({});
  const open = Boolean(anchorEl);

  const { paper, popper, popperText, actionFont } = classes();
  const [loading, setLoading] = useState(false);

  // the ma ids in the state will be in expanded view
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpandableItemsList = (maId) => {
    const newItems = new Set(expandedItems);
    if (expandedItems.has(maId)) {
      newItems.delete(maId);
    } else {
      newItems.add(maId);
    }
    setExpandedItems(newItems);
  };

  const { data = [], totalCount, customerName, customerId } = customerData;
  const backHandler = () => {
    navigate(`/app/${backHandlerLink}`);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchVendorData({ newPage });
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const printHandler = () => {
    const params = {
      customer_id: +id,
    };
    const url = `${PRINT_BASE_URL.CUSTOMER_RETURN_FORM}?${serialize(params)}`;
    window.open(url, '_blank');
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
  }, []);

  const fetchVendorData = ({ newPage = page } = {}) => {
    setLoading(true);
    MaterialAssignmentAPI.getMaCustomerLedger({
      customer_id: id,
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    })
      .then(({ items = [], total_count = 0, customer_name, customer_id }) => {
        setCustomerData({
          data: items.map((item) => ({ ...item, comments: item.remark })),
          customerName: customer_name,
          customerId: customer_id,
          totalCount: total_count,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleClone = (id) => {
    navigate(`/app/${RouteTransformer.getCloneMA()}`, {
      state: {
        type: MA_TYPES.CUSTOMER,
        id,
      },
    });
  };

  return (
    <PageLayout
      title={customerName}
      showBackHandler={backHandler}
      titleComponent={
        <LibraryGrid container alignItems="center">
          <div className="margin-horizontal">
            <PrintButton label="Return Form" clickHandler={printHandler} />
          </div>
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
                      `/app/${RouteTransformer.getCreateMaterialAssignmentCustomerLink()}`,
                      {
                        state: {
                          name: customerName,
                          id: customerId,
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
                      `/app/${RouteTransformer.getReturnMACustomer(customerId)}`,
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
                      `/app/${RouteTransformer.getAdjustMACustomer(customerId)}`,
                    );
                  }}
                  className={actionFont}
                >
                  Adjustment
                </LibraryText>
              </li>
            </ul>
          </Popper>
        </LibraryGrid>
      }
    >
      <PageLayout.Body>
        {loading ? (
          <AppLoader />
        ) : (
          <GridListView
            cellProps={{
              handleClone,
              expandedItems,
              toggleExpandableItemsList,
            }}
            data={data}
            columns={CUSTOMER_LEDGER_COLUMNS}
            isHeaderSticky
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

export default CustomerLedger;
