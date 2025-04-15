import { getFormattedDateTime } from 'Utilities/dateUtils';
import { LibraryText } from 'vg-library/core';

const COMMON_STYLE = {
  paddingRight: '0.6rem',
};

export const STATUS_COLUMNS = [
  {
    header: {
      label: 'Purchase Order',
      style: COMMON_STYLE,
    },
    props: { md: 4, xs: 12 },
    render: ({ purchase_order }) => {
      const { id, partner } = purchase_order;
      return (
        <LibraryText>
          PO-{id}/{partner.name}
        </LibraryText>
      );
    },
  },
  {
    header: {
      label: 'Created At',
      style: COMMON_STYLE,
    },
    props: { md: 3, xs: 12 },
    render: ({ purchase_order }) => {
      return (
        <LibraryText>
          {getFormattedDateTime(new Date(purchase_order.created_date))}
        </LibraryText>
      );
    },
  },
  {
    header: {
      label: 'Created By',
      style: COMMON_STYLE,
    },
    props: { md: 3, xs: 12 },
    render: ({ purchase_order }) => {
      return <LibraryText>{purchase_order.user}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Services',
      style: COMMON_STYLE,
    },
    props: { md: 2, xs: 12 },
    render: ({ purchase_order }) => {
      const services = purchase_order.purchase_items.map(({ service_type }) => {
        return (
          <LibraryText component="div" key={service_type.id}>
            {service_type.name}
          </LibraryText>
        );
      });
      return <LibraryText>{services}</LibraryText>;
    },
  },
];
