import { toFixedNumber } from 'Utilities';
import { LibraryText } from 'vg-library/core';

const COMMON_PROPS = {
  md: 2,
  xs: 12,
};

const COMMON_STYLE = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
};

const customerUploadMAColumns = [
  {
    header: {
      label: 'Item Code',
      style: COMMON_STYLE,
    },
    props: {
      md: 3,
      xs: 12,
    },
    render: ({ packaging_item }) => {
      return <LibraryText>{packaging_item?.item_code}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Item Name',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ packaging_item }) => {
      return (
        <LibraryText>
          <b>{packaging_item?.item_name}</b>
        </LibraryText>
      );
    },
  },
  {
    header: {
      label: 'Description',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ packaging_item }) => {
      return <LibraryText>{packaging_item?.description}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Quantity',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ quantity }) => {
      return <LibraryText>{quantity}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Rate',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ rate }) => {
      return <LibraryText>{toFixedNumber(rate, 2)}</LibraryText>;
    },
  },
];

export default customerUploadMAColumns;
