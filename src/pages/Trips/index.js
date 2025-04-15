import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import {
  AppLoader,
  CreateAllowed,
  CustomPagination,
  PageFilter,
} from 'Components';
import useTripsAccess from 'Hooks/useRoleBasedAccess';
import useTransportersList from 'Hooks/useTransportersList';
import PATH from 'Routes/path';
import { getTripsInfo } from 'Services/trips';
import { onFilterbyIdTabChange } from 'Utilities/actionUtils';
import { RESOURCES } from 'Utilities/constants';
import {
  FILTER_OPTIONS,
  INITIAL_FILTER_DATA,
  PAGE_TITLE,
  PAGINATION_LIMIT,
  TRIPS_STATUS,
} from 'Utilities/constants/trips';

import PageLayout from '../../app/PageLayout';

import { WIDTH_250 } from './style';
import TripsListing from './TripsListing';

const Trips = () => {
  const [tripsData, setTripsData] = useState({});
  const [tab, setTab] = useState(TRIPS_STATUS.NOT_DISPATCHED.value);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tripId = searchParams.get('tripId');
  const [filters, setFilters] = useState({ id: tripId });

  const [transporters, getUpdatedTransportersList] = useTransportersList();

  const hasLimitedAccessToTrips = useTripsAccess();

  const { data = [], tabWiseCount = {}, totalCount } = tripsData;

  const { ADD_TRIPS } = PATH;
  const enableEndTrip = tab === TRIPS_STATUS.ONGOING.value;
  const disableEditTrip = tab === TRIPS_STATUS.ENDED.value;

  const fetchTripsData = (currentPage = page) => {
    const params = {
      ...filters,
      offset: (currentPage - 1) * PAGINATION_LIMIT,
      limit: PAGINATION_LIMIT,
      trip_status: tab,
    };
    setLoading(true);
    getTripsInfo(params)
      .then((res) => {
        const { items, counts, end_trip, total_count } = res || {};
        if (filters.id && !items.length) {
          const newTab = onFilterbyIdTabChange(counts, TRIPS_STATUS);
          if (newTab) setTab(newTab);
        }
        setTripsData({
          data: items,
          tabWiseCount: counts,
          enableEndTrip: end_trip,
          totalCount: total_count,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1);
    fetchTripsData(1);
  }, [tab, filters]);

  const submitFilters = (values) => {
    const { tripId, vehicleNo, vendorsList, paymentType } = values;

    const partnerIds = vendorsList?.map(({ id }) => id);

    const currentFilter = {
      ...(tripId ? { id: tripId } : {}),
      ...(vehicleNo ? { search: vehicleNo } : {}),
      ...(vendorsList?.length ? { partner_ids: partnerIds } : {}),
      ...(paymentType ? { payment_request_type: paymentType.value } : {}),
    };

    setFilters(currentFilter);
  };

  const handleTabChange = (_, val) => {
    setTab(val);
  };

  const handlePageChange = (_, val) => {
    setPage(val);
    fetchTripsData(val);
  };

  const tabsUI = (
    <Tabs
      value={tab}
      onChange={handleTabChange}
      textColor="primary"
      indicatorColor="primary"
    >
      {Object.values(TRIPS_STATUS).map(({ label, value }) => {
        const count = tabWiseCount[value];
        const tabLabel = `${label} (${count || 0})`;
        return <Tab value={value} label={tabLabel} key={label} />;
      })}
    </Tabs>
  );

  const headerButton = !hasLimitedAccessToTrips && (
    <CreateAllowed
      resource={RESOURCES.TRIPS}
      buttonProps={{ href: ADD_TRIPS.URL }}
      label="Add Trip"
    />
  );

  const filterFields = [
    ...FILTER_OPTIONS,
    {
      type: 'fieldCombo',
      name: 'vendorsList',
      label: 'Select Vendors',
      multiple: true,
      placeholder: 'Select Vendors',
      style: WIDTH_250,
      options: transporters,
      optionLabel: (partner) =>
        `${partner.name}-${partner.area}${`-${partner.phone_number}`}`,
      onChangeInput: (value) => getUpdatedTransportersList(value),
      groupBy: (value) => value.type,
    },
  ];

  return (
    <PageFilter
      data={filterFields}
      initialValues={INITIAL_FILTER_DATA}
      setFilters={submitFilters}
      titleComponent={headerButton}
      filterLabel={PAGE_TITLE}
    >
      <PageLayout.Body>
        {tabsUI}
        {loading ? (
          <AppLoader />
        ) : (
          <TripsListing
            data={data}
            enableEndTrip={enableEndTrip}
            fetchTripsData={fetchTripsData}
            disableEditTrip={disableEditTrip}
          />
        )}
      </PageLayout.Body>
      <CustomPagination
        count={Math.ceil(totalCount / PAGINATION_LIMIT)}
        page={page}
        shape="rounded"
        onChange={handlePageChange}
      />
    </PageFilter>
  );
};

export default Trips;
