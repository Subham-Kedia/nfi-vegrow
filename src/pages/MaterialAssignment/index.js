import { useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  AppButton,
  AppLoader,
  CreateAllowed,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import usePartnersList from 'Hooks/usePartnersList';
import RouteTransformer from 'Routes/routeTransformer';
import { getPackagingItem } from 'Services/lots';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser } from 'Utilities';
import { DC_TYPE, RESOURCES } from 'Utilities/constants';
import {
  LOCAL_STORAGE_KEYS,
  MATERIAL_ASSIGNMENT_TABS,
} from 'Utilities/constants/MaterialAssignment';
import imageUpload from 'Utilities/directUpload';

import {
  ACTION_COLUMN,
  COLUMNS,
  GAP,
  PENDING_QUANTITY,
  RATE_COLUMN,
  RECIEVING_COLUMN,
} from './MaterialAssignmentList/columns';
import CratesSummary from './Popups/CratesSummary';
import VendorAcknowledgement from './Popups/VendorAcknowledgement';
import { classes } from './style';

const PAGE_SIZE = 10;

const MaterialAssignmentList = () => {
  const { dcId } = useSiteValue();
  const [tab, setTab] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEYS.MA_CURRENT_TAB) ||
      MATERIAL_ASSIGNMENT_TABS.TO_BE_ALLOTED.value,
  );
  const [page, setPage] = useState(1);
  const [materialsData, setMaterialsData] = useState({});
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const maId = useRef();
  const closeMaData = useRef();
  const [summaryData, setSummaryData] = useState([]);
  const [vendors, getVendors] = usePartnersList();

  // the ma ids in the state will be in expanded view
  const [expandedItems, setExpandedItems] = useState(new Set());

  const { summaryGap } = classes();

  const { data = [], tabWiseCount = {}, totalCount } = materialsData;

  const vendorAcknowledgementField = 'vendorAcknowledgement';
  const closeMaAcknowledgementField = 'closeMaAcknowledgement';

  const toggleExpandableItemsList = (maId) => {
    const newItems = new Set(expandedItems);
    if (expandedItems.has(maId)) {
      newItems.delete(maId);
    } else {
      newItems.add(maId);
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
    {
      type: 'fieldCombo',
      name: 'packagingItems',
      label: 'Select Packaging Item',
      placeholder: 'Select Packaging items',
      options: packagingTypes || [],
      optionLabel: (obj) => obj.item_code,
      multiple: true,
    },
  ];

  const fetchMaterialAssignmentData = ({
    newPage = page,
    selectedTab = tab,
    currentFilter = filters,
  } = {}) => {
    setLoading(true);
    MaterialAssignmentAPI.getMaterialAssignmentItems({
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      status: selectedTab,
      include_dc_filter: true,
      ...currentFilter,
    })
      .then(({ items = [], total_count = 0, counts = {} }) => {
        setMaterialsData({
          data: items,
          tabWiseCount: counts,
          totalCount: total_count,
        });
      })
      .finally(() => setLoading(false));
  };

  const submitFilters = (values) => {
    const { vendors, packagingItems } = values;

    const partner_ids = vendors?.map(({ id }) => id);
    const nfi_packaging_item_ids = packagingItems?.map(({ id }) => id);

    const currentFilter = {
      ...(vendors?.length ? { partner_ids } : {}),
      ...(packagingItems?.length ? { nfi_packaging_item_ids } : {}),
    };

    setFilters(currentFilter);
  };

  const handleChangeTab = (_, newTab) => {
    setTab(newTab);
    setPage(1);
    setExpandedItems(new Set());
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchMaterialAssignmentData({ newPage });
  };

  const getAllDropDownValues = () => {
    getPackagingItem().then(({ items: packaging_types } = {}) =>
      setPackagingTypes(packaging_types),
    );
  };

  const handleVendorAcknowledgement = async (file) => {
    if (!file?.[vendorAcknowledgementField]?.[0]) return;

    const { data: { signed_id } = {} } =
      (await imageUpload(file[vendorAcknowledgementField][0])) || {};

    MaterialAssignmentAPI.uploadAcknowledgement(maId.current, {
      material_assignment: {
        acknowledgement: signed_id,
      },
    }).then(() => {
      setShowAcknowledgement(false);
      fetchMaterialAssignmentData();
    });
  };

  useEffect(() => {
    getAllDropDownValues();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.MA_CURRENT_TAB);
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMaterialAssignmentData({ newPage: 1 });
  }, [tab, dcId, filters]);

  const summaryStatusController = () => {
    const shouldHideSummary = localStorage.getItem(
      LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY,
    );

    if (shouldHideSummary) setShowSummary(false);
    else setShowSummary(true);
  };

  useEffect(() => {
    MaterialAssignmentAPI.getSummary().then(({ items = [] }) => {
      setSummaryData(items || []);

      summaryStatusController();
      localStorage.removeItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY);
    });
  }, [dcId]);

  useEffect(summaryStatusController, []);

  const getColumns = () => {
    let additionalColumns = [];
    switch (tab) {
      case MATERIAL_ASSIGNMENT_TABS.ALLOTED.value:
        additionalColumns = [...RATE_COLUMN, ...RECIEVING_COLUMN];
        break;

      case MATERIAL_ASSIGNMENT_TABS.PARTIAL_RETURN.value:
        additionalColumns = [...PENDING_QUANTITY, ...RECIEVING_COLUMN];
        break;

      case MATERIAL_ASSIGNMENT_TABS.CLOSED.value:
        additionalColumns = [...GAP, ...RECIEVING_COLUMN];
        break;

      default:
        break;
    }

    return [...COLUMNS, ...additionalColumns, ...ACTION_COLUMN];
  };

  const toggleConfirmDialog = (id) => {
    setCloseConfirm(id);
  };

  const confirmClosePO = async (file) => {
    if (!file?.[closeMaAcknowledgementField]?.[0]) return;

    const { data: { signed_id } = {} } =
      (await imageUpload(file[closeMaAcknowledgementField][0])) || {};

    MaterialAssignmentAPI.closeMaterialAssignmentById(
      closeConfirm,
      signed_id,
    ).then(() => {
      notifyUser('MA is Closed');
      fetchMaterialAssignmentData();
      toggleConfirmDialog(null);
    });
  };

  const downloadPDF = (id) => {
    window.open(
      `${API.CRMUrl}nfi/material_assignments/${id}/generate_acknowledgement_pdf.pdf`,
    );
  };

  const downloadReceivingPDF = (id) => {
    window.open(`${API.CRMUrl}nfi/receivings/${id}/generate_receiving_pdf.pdf`);
  };

  const { MANDI, SATELLITE_CC } = DC_TYPE;

  return (
    <>
      <PageFilter
        filterLabel="Material Assignment to Mandi Farmers"
        initialValues={{ vendors: [], packagingItems: [] }}
        data={filterData}
        setFilters={(value) => submitFilters(value)}
        showSelectDC
        dcFilterFn={({ dc_type }) => [MANDI, SATELLITE_CC].includes(dc_type)}
        titleComponent={
          <div className={summaryGap}>
            <AppButton
              variant="contained"
              color="primary"
              onClick={() => setShowSummary(true)}
            >
              View Summary
            </AppButton>
            <CreateAllowed
              resource={RESOURCES.MATERIAL_ASSIGNMENT}
              buttonProps={{
                href: `/app/${RouteTransformer.getCreateMaterialAssignmentLink()}`,
              }}
              label="Material Assignment"
            />
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
            {Object.values(MATERIAL_ASSIGNMENT_TABS).map(({ value, label }) => (
              <Tab
                label={`${label} (${tabWiseCount[value] || 0})`}
                key={value}
                value={value}
              />
            ))}
          </Tabs>
          {loading ? (
            <AppLoader />
          ) : (
            <GridListView
              cellProps={{
                setShowAcknowledgement,
                toggleConfirmDialog,
                downloadPDF,
                downloadReceivingPDF,
                maId,
                closeMaData,
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
          {!!closeConfirm && (
            <VendorAcknowledgement
              open={!!closeConfirm}
              onClose={() => toggleConfirmDialog(null)}
              field={closeMaAcknowledgementField}
              handleSubmit={confirmClosePO}
              data={closeMaData.current}
            />
          )}
        </PageLayout.Body>
        <CustomPagination
          count={Math.ceil(totalCount / PAGE_SIZE) || 0}
          page={page}
          shape="rounded"
          onChange={handleChangePage}
        />
      </PageFilter>
      <CratesSummary
        open={showSummary && summaryData.length}
        onClose={() => setShowSummary(false)}
        data={summaryData}
      />
      ;
    </>
  );
};
export default MaterialAssignmentList;
