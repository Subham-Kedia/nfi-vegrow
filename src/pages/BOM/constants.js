import { Box, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';

export const PAGE_SIZE = 10;

export const statusMap = {
  ACTIVE: 0,
  INACTIVE: 1,
};

export const statusOptions = [
  { value: statusMap.ACTIVE, label: 'ACTIVE', id: 0 },
  { value: statusMap.INACTIVE, label: 'IN-ACTIVE', id: 1 },
];

export const COLUMNS = [
  {
    key: 'bom_id',
    header: 'Packaging BOM Id',
    render: ({ rowData }) => (
      <Box display="flex" gap="1rem" alignItems="center">
        {rowData.bom_id}{' '}
      </Box>
    ),
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'bom_name',
    header: 'BOM Name',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'product_category',
    header: 'Fruit Category',
    align: 'center',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ data = '-' }) => {
      return (
        <Typography style={{ fontSize: '0.8rem' }}>
          {Array.isArray(data) && data.length ? data[0] : <div>&mdash;</div>}

          {data.length > 1 && (
            <Tooltip
              title={data
                .slice(1)
                .reduce(
                  (prev, curr, index) =>
                    `${prev}${index < 1 ? '' : ', '}${curr}`,
                  '',
                )}
            >
              <span style={{ marginLeft: '4px' }}>+ {data.length - 1}</span>
            </Tooltip>
          )}
        </Typography>
      );
    },
  },
];
