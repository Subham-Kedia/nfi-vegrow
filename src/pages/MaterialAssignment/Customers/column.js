import { Link } from '@mui/material';
import RouteTransformer from 'Routes/routeTransformer';
import { toFixedNumber } from 'Utilities';
import { getFormattedDate } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { getTrimmedMA } from '../utils';

const commonHeaderStyle = { minHeight: '2.5rem' };
export const COLUMNS = [
  {
    header: {
      label: 'Customer Name',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: (data) => {
      return (
        <div>
          <Link
            href={`/app/${RouteTransformer.getCreateCustomerLedger(
              data.vendor_id,
            )}`}
          >
            {data.vendor_name}
          </Link>
          <LibraryText>{data.user_name}</LibraryText>
        </div>
      );
    },
  },
  {
    header: {
      label: 'Item',
      style: { ...commonHeaderStyle, paddingRight: '1rem' },
    },
    props: { md: 2, xs: 12 },
    render: (
      { material_assignment_items = [], vendor_id },
      { expandedItems, toggleExpandableItemsList },
    ) => {
      const handleShowMore = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleExpandableItemsList(vendor_id);
      };

      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id: vendor_id,
        expandedItems,
        handleShowMore,
        keyName: 'item_name',
        addExpansionBtn: true,
      });

      return (
        <LibraryGrid>
          {maItems.map((item) => (
            <LibraryText
              variant="body1"
              key={vendor_id}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.item_name}
            </LibraryText>
          ))}
        </LibraryGrid>
      );
    },
  },
  {
    header: {
      label: 'Quantity',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: (
      { material_assignment_items = [], vendor_id },
      { expandedItems },
    ) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id: vendor_id,
        expandedItems,
        keyName: 'total_quantity',
      });

      return (
        <LibraryGrid>
          {maItems.map((item, index) => (
            <LibraryText variant="body1" key={index}>
              {item.total_quantity}
            </LibraryText>
          ))}
        </LibraryGrid>
      );
    },
  },
  {
    header: {
      label: 'Average Value',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: (
      { material_assignment_items = [], vendor_id },
      { expandedItems },
    ) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id: vendor_id,
        expandedItems,
        keyName: 'total_value',
      });

      return (
        <LibraryGrid>
          {maItems.map((item, index) => (
            <LibraryText variant="body1" key={index}>
              {toFixedNumber(item.total_value, 2)}
            </LibraryText>
          ))}
        </LibraryGrid>
      );
    },
  },
  {
    header: {
      label: 'Last MA Date',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: ({ last_ma_date }) => (
      <LibraryText>{getFormattedDate(last_ma_date)}</LibraryText>
    ),
  },
  {
    header: {
      label: 'Last Receiving Date',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: ({ last_receiving_item }) => (
      <LibraryText>{getFormattedDate(last_receiving_item)}</LibraryText>
    ),
  },
];
