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

const customerReturnMAUploadColumns = [
  {
    header: {
      label: 'Item Code',
      style: COMMON_STYLE,
    },
    props: {
      md: 3,
      xs: 12,
    },
    render: ({ item_code }) => {
      return <LibraryText>{item_code}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Item Name',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ item_name }) => {
      return <LibraryText>{item_name}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Description',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ description }) => {
      return <LibraryText>{description}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Pickup Quantity',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ pickup_quantity }) => {
      return <LibraryText>{pickup_quantity}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Delivered Quantity',
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
      label: 'Gap',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ pickup_quantity, quantity }) => {
      return <LibraryText>{pickup_quantity - quantity}</LibraryText>;
    },
  },
];

export default customerReturnMAUploadColumns;
