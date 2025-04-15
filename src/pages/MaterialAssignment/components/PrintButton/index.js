import PrintIcon from '@mui/icons-material/Print';
import { AppButton } from 'Components';
import { useFormikContext } from 'formik';

const PrintButton = ({ clickHandler, label = 'Print' }) => {
  const { values } = useFormikContext() || {};
  return (
    <AppButton
      variant="outlined"
      startIcon={<PrintIcon />}
      onClick={() => clickHandler(values)}
      size="medium"
    >
      {label}
    </AppButton>
  );
};

export default PrintButton;
