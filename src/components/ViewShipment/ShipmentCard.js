import Typography from '@mui/material/Typography';
import ImageIcons from 'Components/AppIcons/ImageIcons';
import Table from 'Components/Table';
import PropTypes from 'prop-types';
import { LOT_TYPE } from 'Utilities/constants';

import { toFixedNumber } from '../../utilities';

import { ShipmentHeading, ShipmentWrapper } from './styled';

const COLUMNS = [
  {
    key: 'label',
    header: 'Lots',
    subHeader: 'Labels',
    footer: 'Total',
    show: true,
    render: ({ data, rowData }) => (
      <>
        <ImageIcons
          name={rowData.lot_type === LOT_TYPE.STANDARD ? 'box' : 'weight'}
          style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }}
        />
        {data}
      </>
    ),
  },
  {
    key: 'quantity_with_partial_weight',
    header: 'Quantity',
    subHeader: 'incl. Partial Units',
    align: 'center',
    footer: 'total_quantity_with_partial_weight',
    show: true,
    render: ({ data, rowData, props: { weightKey } }) => (
      <>
        {data}
        <Typography
          variant="caption"
          component="div"
          className="disabled-text"
          color="textPrimary"
        >
          (
          {!!(weightKey === 'weight_in_kgs') &&
            `${rowData.average_package_weight_in_kgs},`}
          {!!(weightKey === 'accounted_weight_in_kgs') &&
            `${rowData.average_accounted_package_weight_in_kgs},`}{' '}
          {rowData.partial_weight > 0 ? ` ${rowData.partial_weight}` : '0'} kgs)
        </Typography>
      </>
    ),
    style: {
      maxWidth: '90px',
    },
  },
  {
    key: 'unit_price',
    header: 'Unit Price',
    align: 'center',
    footer: 'total_unit_price',
    show: false,
    render: ({ data = 0 }) => {
      return <>{toFixedNumber(data, 2) || 0}</>;
    },
  },
  {
    key: 'weight_in_kgs',
    header: 'Total Weight',
    subHeader: 'Kgs',
    align: 'center',
    footer: 'total_weight_in_kgs',
    show: true,
    render: ({ rowData, props: { weightKey } }) => (
      <>
        {toFixedNumber(rowData[weightKey]) || 0} kg
        <Typography
          variant="caption"
          component="div"
          className="disabled-text"
          color="textPrimary"
        >
          {!!rowData.percentage_distribution && (
            <>({rowData.percentage_distribution || 0}%)</>
          )}
        </Typography>
      </>
    ),
    style: {
      maxWidth: '70px',
    },
  },
  {
    key: '',
    header: 'Total Price',
    align: 'center',
    footer: 'total_price',
    show: false,
    render: ({ rowData: { value = 0 } = {} }) => {
      return toFixedNumber(value);
    },
  },
];

const ShipmentCard = ({
  shipment,
  weightKey,
  quantityKey,
  showToggleWeight,
  showTotalPrice = false,
}) => {
  const getTotalWeight = () => {
    return (shipment.lots || []).reduce(
      (acc, l) => (l[weightKey] || 0) + acc,
      0,
    );
  };

  const getTotalQuantity = () => {
    return (shipment.lots || []).reduce(
      (acc, l) => (l[quantityKey] || 0) + acc,
      0,
    );
  };

  const footerData = () => {
    return {
      total_quantity_with_partial_weight: toFixedNumber(getTotalQuantity(), 2),
      total_weight_in_kgs: toFixedNumber(getTotalWeight(), 2),
      ...(showTotalPrice && {
        total_unit_price: toFixedNumber(
          shipment.lots.reduce(
            (acc, { unit_price = 0 }) => acc + Number(unit_price),
            0,
          ) / shipment.lots.length,
          2,
        ),
        total_price: toFixedNumber(
          shipment.lots.reduce((acc, { value = 0 }) => acc + Number(value), 0),
          2,
        ),
      }),
    };
  };

  return (
    <ShipmentWrapper>
      <ShipmentHeading>
        <Typography
          variant="subtitle2"
          component="label"
          className="title"
          color="textPrimary"
        >
          <strong>
            Shipment - {shipment.identifier || shipment.shipment_identifier}
          </strong>
        </Typography>
      </ShipmentHeading>
      <Table
        size="small"
        sticky
        hover
        isFooter
        footerSummarydata={footerData()}
        columns={
          showTotalPrice ? COLUMNS : COLUMNS.filter((column) => column.show)
        }
        data={shipment.lots.filter(
          (item) =>
            item.quantity_with_partial_weight &&
            item.quantity_with_partial_weight !== 0,
        )}
        dataKey="id"
        className="shipment-table"
        cellProps={() => ({
          weightKey,
          showToggleWeight,
        })}
      />
    </ShipmentWrapper>
  );
};

ShipmentCard.defaultProps = {
  weightKey: 'weight_in_kgs',
  // eslint-disable-next-line react/default-props-match-prop-types
  quantityKey: 'quantity_with_partial_weight',
  // This field is not being used. Remove this as a part of lot cleanup.
  showToggleWeight: false,
};

ShipmentCard.propTypes = {
  weightKey: PropTypes.string,
  showToggleWeight: PropTypes.bool,
};

export default ShipmentCard;
