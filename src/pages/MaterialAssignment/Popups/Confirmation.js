import ConfirmationDialog from 'Components/ConfirmationDialog';
import Text from 'Components/Text';
import PropTypes from 'prop-types';

const Confirmation = ({
  open,
  handleClose,
  handleOnConfirm,
  title,
  bodyContent,
}) => {
  return (
    <ConfirmationDialog
      title={title}
      onCancel={handleClose}
      open={open}
      onConfirm={handleOnConfirm}
    >
      <Text>{bodyContent}</Text>
    </ConfirmationDialog>
  );
};

Confirmation.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  handleOnConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  bodyContent: PropTypes.string.isRequired,
};

Confirmation.defaultProps = {
  open: false,
};

export default Confirmation;
