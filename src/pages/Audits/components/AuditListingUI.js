import { Tab, Tabs } from '@mui/material';
import PageLayout from 'App/PageLayout';
import {
  AppLoader,
  GridListView,
  InfiniteScrollComponent,
  NoData,
} from 'Components';
import useDevice from 'Hooks/useDevice';
import { DEVICE_TYPE } from 'Utilities/constants';
import { LibraryGrid } from 'vg-library/core';

import AuditMainMobile from './AuditMainMobile';
import { getAuditColumns } from './Columns';

const PAGE_SIZE = 20;

const AuditListingUI = ({
  tab,
  handleChangeTab,
  loading,
  counts,
  data,
  totalCount,
  loadMoreData,
  filters = {},
  tabList,
  isApprover,
}) => {
  const device = useDevice();
  const isMobile = device === DEVICE_TYPE.MOBILE;

  const ListingUI = isMobile ? (
    <AuditMainMobile data={data} isApprover={isApprover} />
  ) : (
    <LibraryGrid container direction="column">
      <GridListView
        data={data}
        columns={getAuditColumns(tab, isApprover)}
        isHeaderSticky
      />
    </LibraryGrid>
  );

  return (
    <PageLayout.Body>
      <Tabs
        variant="scrollable"
        value={tab}
        onChange={handleChangeTab}
        scrollButtons={false}
      >
        {Object.values(tabList).map(({ value, label }) => (
          <Tab
            label={`${label} (${counts[value] || 0})`}
            key={label}
            value={value}
          />
        ))}
      </Tabs>
      {loading && <AppLoader />}
      {!loading && !data.length && <NoData />}
      {!loading && !!data.length && (
        <InfiniteScrollComponent
          filters={{ tab, ...filters }}
          totalCount={totalCount}
          callback={({ offset }, cb) =>
            loadMoreData({ offset, tab, ...filters }, cb)
          }
          limit={PAGE_SIZE}
        >
          {ListingUI}
        </InfiniteScrollComponent>
      )}
    </PageLayout.Body>
  );
};

export default AuditListingUI;
