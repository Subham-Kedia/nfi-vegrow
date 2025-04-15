import { ContentCopy, Print as PrintIcon } from '@mui/icons-material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconButton, Link } from '@mui/material';
import { AppButton, ImageThumb } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import { getFormattedDate } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { TRANSACTION_TYPE } from '../const';
import { getTrimmedMA } from '../utils';

const commonHeaderStyle = { minHeight: '2.5rem' };

export const COLUMNS = [
  {
    header: {
      label: 'Vendor Name',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: (data, { classes }) => {
      const { iconGap } = classes();
      return (
        <div className={iconGap}>
          <FiberManualRecordIcon
            sx={(theme) => ({
              color: data.is_open
                ? theme.palette.colors.yellow
                : theme.palette.success.main,
            })}
            fontSize="small"
          />
          <Link
            href={`/app/${RouteTransformer.getCreateVendorDetails(
              data.vendor_id,
            )}`}
          >
            {data.vendor_name}
          </Link>
        </div>
      );
    },
  },
  {
    header: {
      label: 'Pending Item',
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
      label: 'Total Quantity',
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
          {maItems.map((item) => (
            <LibraryText variant="body1" key={vendor_id}>
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
          {maItems.map((item) => (
            <LibraryText variant="body1" key={vendor_id}>
              {item.total_value.toFixed(2)}
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

export const VENDORS_LEDGER_OPEN_COLUMNS = [
  {
    header: {
      label: 'Date',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
    render: ({ date }) => {
      return (
        <LibraryText variant="body1">{getFormattedDate(date)}</LibraryText>
      );
    },
  },
  {
    header: {
      label: 'Transaction Type',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
    render: ({ transaction_type, id }, { editHandler }) => {
      return (
        <LibraryGrid>
          <LibraryText variant="body1">{transaction_type}</LibraryText>
          <LibraryText
            variant="body1"
            color="primary"
            className="cursor-pointer"
            onClick={() => editHandler(id)}
          >{`ID: ${id}`}</LibraryText>
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
    props: { md: 2.5, xs: 12 },
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
        keyName: 'item_name',
        handleShowMore,
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
    header: {
      label: 'Total Quantity',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
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
    props: { md: 2, xs: 12 },
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
    header: {
      label: 'Document',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: (
      { id, transaction_type },
      { handlePrintClick, setShowAcknowledgement, maId },
    ) => {
      if (
        transaction_type.toLowerCase() === TRANSACTION_TYPE.USAGE.toLowerCase()
      )
        return null;
      return (
        <LibraryGrid>
          <AppButton
            style={{
              paddingRight: '12px',
              paddingLeft: '12px',
              marginBottom: '10px',
            }}
            variant="outlined"
            size="medium"
            onClick={() => {
              handlePrintClick(id);
            }}
          >
            <PrintIcon />
            Print
          </AppButton>
          <div>
            <AppButton
              variant="contained"
              size="medium"
              className="margin-bottom"
              onClick={() => {
                maId.current = id;
                setShowAcknowledgement(true);
              }}
            >
              upload
            </AppButton>
          </div>
        </LibraryGrid>
      );
    },
  },
  {
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

export const VENDORS_LEDGER_ACKNOWLEDGE_COLUMNS = [
  {
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
    header: {
      label: 'Transaction Type',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
    render: ({ transaction_type, id }) => {
      return (
        <LibraryGrid>
          <LibraryText variant="body1">{transaction_type}</LibraryText>
          <LibraryText
            variant="body1"
            className="disabled-text"
          >{`ID: ${id}`}</LibraryText>
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
    props: { md: 2.5, xs: 12 },
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
        keyName: 'item_name',
        handleShowMore,
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
      label: 'Total Quantity',
      style: commonHeaderStyle,
    },
    props: { md: 1.5, xs: 12 },
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
    key: 'total_value',
    header: {
      label: 'Total Value',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
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
    key: '',
    header: {
      label: 'Document',
      style: commonHeaderStyle,
    },
    props: { md: 2, xs: 12 },
    render: ({ acknowledgement_doc, transaction_type }) => {
      if (transaction_type.toLowerCase() === TRANSACTION_TYPE.USAGE)
        return null;
      return (
        <ImageThumb
          url={acknowledgement_doc}
          style={{ height: '1.5rem', width: '1.5rem' }}
        />
      );
    },
  },
  {
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
