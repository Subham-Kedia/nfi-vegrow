import { useEffect, useState } from 'react';
import PageLayout from 'App/PageLayout';
import {
  AppLoader,
  CreateAllowed,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import usePartnersList from 'Hooks/usePartnersList';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { RESOURCES } from 'Utilities/constants';

import { COLUMNS } from './column';
import { classes } from './style';

const PAGE_SIZE = 10;

const MaterialAssignmentVendor = () => {
  const { summaryGap } = classes();
  const [materialsData, setMaterialsData] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const { data = [], totalCount } = materialsData;
  const [page, setPage] = useState(1);
  const [vendors, getVendors] = usePartnersList();

  // the vendor ids in the state will be in expanded view
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpandableItemsList = (vendorId) => {
    const newItems = new Set(expandedItems);
    if (expandedItems.has(vendorId)) {
      newItems.delete(vendorId);
    } else {
      newItems.add(vendorId);
    }
    setExpandedItems(newItems);
  };

  const filterData = [
    {
      type: 'fieldCombo',
      name: 'vendors',
      label: 'Select Vendor',
      placeholder: 'Select vendor',
      options: vendors,
      optionLabel: (partner) =>
        `${partner.name}-${partner.area}${`-${partner.phone_number}`}`,
      multiple: true,
      onChangeInput: (value) => getVendors(value),
      groupBy: (value) => value.type,
    },
  ];

  const fetchMaterialAssignmentData = ({
    currentFilter = filters,
    newPage = page,
  } = {}) => {
    setLoading(true);
    MaterialAssignmentAPI.getMaVendorListing({
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
    const { vendors } = values;
    const partner_ids = vendors?.map(({ id }) => id);
    const currentFilter = {
      ...(vendors?.length ? { partner_ids } : {}),
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
      filterLabel="Material Assignment"
      initialValues={{ vendors: [] }}
      data={filterData}
      setFilters={(value) => submitFilters(value)}
      titleComponent={
        <div className={summaryGap}>
          <CreateAllowed
            resource={RESOURCES.MATERIAL_ASSIGNMENT}
            buttonProps={{
              href: `/app/${RouteTransformer.getCreateMaterialAssignmentVendorLink()}`,
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
            cellProps={{
              classes,
              expandedItems,
              toggleExpandableItemsList,
            }}
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
export default MaterialAssignmentVendor;
