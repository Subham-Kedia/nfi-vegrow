import { useEffect, useState } from 'react';
import PageLayout from 'App/PageLayout';
import {
  AppLoader,
  CreateAllowed,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import useCustomersList from 'Hooks/useCustomersList';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { RESOURCES } from 'Utilities/constants';

import { COLUMNS } from './column';
import { classes } from './style';

const PAGE_SIZE = 10;

const MaterialAssignmentCustomer = () => {
  const { summaryGap } = classes();
  const [materialsData, setMaterialsData] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const { data = [], totalCount } = materialsData;
  const [page, setPage] = useState(1);
  const [customers, getUpdatedCustomersList] = useCustomersList();

  // the customer ids in the state will be in expanded view
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpandableItemsList = (customerId) => {
    const newItems = new Set(expandedItems);
    if (expandedItems.has(customerId)) {
      newItems.delete(customerId);
    } else {
      newItems.add(customerId);
    }
    setExpandedItems(newItems);
  };

  const filterData = [
    {
      type: 'fieldCombo',
      name: 'customers',
      label: 'Select Customer',
      placeholder: 'Select customer',
      options: customers,
      multiple: true,
      onChangeInput: (value) => getUpdatedCustomersList(value),
      groupBy: (value) => value.type,
    },
  ];

  const fetchMaterialAssignmentData = ({
    currentFilter = filters,
    newPage = page,
  } = {}) => {
    setLoading(true);
    MaterialAssignmentAPI.getMaCustomerListing({
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...currentFilter,
    })
      .then(({ items = [], total_count = 0 }) => {
        setMaterialsData({
          data: items,
          totalCount: total_count,
        });
      })
      .finally(() => setLoading(false));
  };

  const submitFilters = (values) => {
    const { customers } = values;
    const customer_id = customers?.map(({ id }) => id);
    const currentFilter = {
      ...(customers?.length ? { customer_id } : {}),
    };

    setFilters(currentFilter);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchMaterialAssignmentData({ newPage });
  };

  useEffect(() => {
    setPage(1);
    fetchMaterialAssignmentData({ newPage: 1 });
  }, [filters]);

  return (
    <PageFilter
      filterLabel="Customer Material Assignment"
      initialValues={{ customers: [] }}
      data={filterData}
      setFilters={(value) => submitFilters(value)}
      titleComponent={
        <div className={summaryGap}>
          <CreateAllowed
            resource={RESOURCES.MATERIAL_ASSIGNMENT}
            buttonProps={{
              href: `/app/${RouteTransformer.getCreateMaterialAssignmentCustomerLink()}`,
            }}
            label="Material Assignment"
          />
        </div>
      }
    >
      <PageLayout.Body>
        {loading ? (
          <AppLoader />
        ) : (
          <GridListView
            cellProps={{ expandedItems, toggleExpandableItemsList }}
            data={data}
            columns={COLUMNS}
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
    </PageFilter>
  );
};
export default MaterialAssignmentCustomer;
