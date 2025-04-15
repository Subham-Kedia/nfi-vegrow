import React from 'react';
import CustomModal from 'Components/Modal';
import CustomTable from 'Components/Table';
import PropTypes from 'prop-types';

const COLUMNS = [
  {
    key: 'item_code',
    header: 'Item ID',
  },
  {
    key: 'item_name',
    header: 'Item Name',
  },
  {
    key: 'pending_quantity',
    header: 'Pending Quantity',
  },
];

const CratesSummary = ({ open, data, onClose }) => {
  return (
    <CustomModal
      title="Pending Crates Summary"
      width80
      open={open}
      onClose={onClose}
    >
      <section>
        <CustomTable columns={COLUMNS} data={data} />
      </section>
    </CustomModal>
  );
};

CratesSummary.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

CratesSummary.defaultProps = {
  open: false,
};

export default CratesSummary;
