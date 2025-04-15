import { Stack, Tab, Tabs } from '@mui/material';
import { CustomPagination, GridListView } from 'Components';

import { STATUS_COLUMNS } from '../columns/StausColumns';
import { PAGE_SIZE, SDN_STATUS } from '../const';
import { SDNSummary } from '../style';

const SDNListing = ({
  data,
  handleStatusChange,
  totalCount,
  page,
  handlePageChange,
  status,
  setSelectedService,
  counts,
}) => {
  return (
    <Stack className="height100">
      <Tabs value={status} onChange={handleStatusChange}>
        {Object.values(SDN_STATUS).map(({ value, label }) => {
          return (
            <Tab
              key={label}
              value={value}
              label={`${label}(${counts[value] || 0})`}
            />
          );
        })}
      </Tabs>
      <SDNSummary>
        <GridListView
          data={data || []}
          columns={STATUS_COLUMNS}
          rowClickHandler={setSelectedService}
          rowContainerStyle={{ cursor: 'pointer' }}
        />
      </SDNSummary>
      {totalCount > 0 && (
        <footer>
          <CustomPagination
            page={page + 1}
            shape="rounded"
            count={Math.ceil(totalCount / PAGE_SIZE)}
            onChange={handlePageChange}
          />
        </footer>
      )}
    </Stack>
  );
};

export default SDNListing;
