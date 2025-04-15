import { ContentCopy } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ImageThumb } from 'Components';
import { SO_TYPE } from 'Utilities/constants';
import { getFormattedDate } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { TRANSACTION_TYPE } from '../const';
import { getSourceLabel, getTrimmedMA } from '../utils';

const commonHeaderStyle = { minHeight: '2.5rem' };

export const CUSTOMER_LEDGER_COLUMNS = [
  {
    key: 'date',
    header: {
      label: 'Date',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
    render: ({ date }) => {
      return <div>{getFormattedDate(date)}</div>;
    },
  },
  {
    key: 'transaction_type',
    header: {
      label: 'Transaction Type',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
    render: ({ transaction_type, dc, sale_order_id }) => {
      const label =
        dc === SO_TYPE.DIRECT_CUSTOMER
          ? 'SO ID'
          : getSourceLabel(transaction_type);
      const value = dc === SO_TYPE.DIRECT_CUSTOMER ? sale_order_id : dc;
      return (
        <LibraryGrid>
          <div>{transaction_type}</div>
          {!!dc && <div className="disabled-text">{`${label}: ${value}`}</div>}
        </LibraryGrid>
      );
    },
  },
  {
    key: 'item_name',
    header: {
      label: 'Item',
      style: { ...commonHeaderStyle, paddingRight: '1rem' },
    },
    props: { md: 2, xs: 12 },
    render: (
      { material_assignment_items = [], id },
      { expandedItems, toggleExpandableItemsList },
    ) => {
      const handleShowMore = (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleExpandableItemsList(id);
      };

      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        handleShowMore,
        keyName: 'item_name',
        addExpansionBtn: true,
      });
      return (
        <LibraryGrid>
          {maItems.map((item, index) => (
            <LibraryText
              variant="body1"
              key={index}
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
    key: '',
    header: {
      label: 'Quantity',
      style: commonHeaderStyle,
    },
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
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
      label: 'Total Value',
      style: commonHeaderStyle,
    },
    props: { md: 1, xs: 12 },
    render: ({ material_assignment_items = [], id }, { expandedItems }) => {
      const maItems = getTrimmedMA({
        items: [...material_assignment_items],
        id,
        expandedItems,
        keyName: 'total_value',
      });
      return (
        <LibraryGrid>
          {maItems.map((item, index) => (
            <LibraryText variant="body1" key={index}>
              {item.total_value.toFixed(2)}
            </LibraryText>
          ))}
        </LibraryGrid>
      );
    },
  },
  {
    key: 'user',
    header: {
      label: 'User',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
  },
  {
    key: '',
    header: {
      label: 'Document',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: ({ acknowledgement_doc }) => {
      return (
        <div className="margin-bottom">
          <ImageThumb
            url={acknowledgement_doc}
            style={{ height: '1.5rem', width: '1.5rem' }}
          />
        </div>
      );
    },
  },
  {
    key: '',
    header: {
      label: 'Action',
      style: commonHeaderStyle,
    },
    props: { md: 1, xs: 12 },
    render: ({ id, transaction_type }, { handleClone }) => {
      const { MATERIAL_ASSIGNMENT } = TRANSACTION_TYPE;
      if (transaction_type.toLowerCase() === MATERIAL_ASSIGNMENT) {
        return (
          <IconButton onClick={() => handleClone(id)}>
            <ContentCopy />
          </IconButton>
        );
      }
      return null;
    },
  },
];
