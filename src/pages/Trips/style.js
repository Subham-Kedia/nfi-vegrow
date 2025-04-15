import { makeStyles } from '@mui/styles';

export const WIDTH_150 = { width: '9.375rem', marginTop: 0 };
export const WIDTH_250 = { width: '15.625rem', marginTop: 0 };

export const classes = makeStyles((theme) => ({
  noDataPage: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  marginRight: {
    marginRight: '0.5rem',
  },
  marginTop: {
    marginTop: '1.5rem',
  },
  cardContainer: {
    padding: '0 0.5rem',
    background: 'white',
  },
  datePickerWrapper: {
    marginTop: '0.5rem',
    '& .MuiInputBase-input': {
      width: '11.5rem !important',
    },
  },
  tripsRegistationFooterBtn: {
    marginRight: '0.5rem',
  },
  selectShipment: {
    padding: '0.4rem 3rem',
  },
  mainSectionWrapper: {
    marginTop: '2rem',
  },
  radioLabel: {
    marginTop: '0.2rem',
  },
  vehicleDetailsWrapper: {
    margin: '2rem 0 0 0.5rem',
    border: `1px solid ${theme.palette.colors.gray}`,
    padding: '0 0.8rem 3rem 0.8rem',
    width: '25%',
  },
  inputBox: {
    width: '100% !important',
    marginTop: '1.2rem !important',
  },
  fieldCombo: {
    marginTop: '0.5rem',
  },
  headerWrapper: {
    marginBottom: '0.5rem',
    marginTop: '1.5rem',
    paddingLeft: '0.8rem',
  },
  addTransporter: {
    paddingLeft: '0.8rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    textDecoration: 'none',
  },
  vehicleDetailsHeader: {
    marginBottom: '1.7rem',
    marginTop: '1.5rem',
    paddingLeft: '0.8rem',
  },
  deliveryDetailsHeader: {
    margin: '1rem 0rem',
  },
  deliveryDetailsCard: {
    width: '25%',
    padding: '1.3rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
  },
  deliveryDetailsCardAddress: {
    margin: '1rem 0rem',
    fontSize: '0.8rem',
  },
  detailsSubContainer: {
    padding: '1rem 0rem 1rem 1rem',
    display: 'flex',
    flexWrap: 'wrap',
  },
  shipmentIdentifier: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  disable: {
    pointerEvents: 'none',
  },
  radioGroupWrapper: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-start',
    marginTop: '1.5rem',
  },
  addressWrapper: {
    paddingRight: '0.5rem',
  },
  marginTopSpace: {
    marginTop: '1rem',
  },
  fullWidth: {
    width: '100%',
  },
  marginCombination: {
    margin: '0 1rem',
  },
  heavyFontTopMargin: {
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  marginUpCombination: {
    margin: '2rem 0',
  },
  heavyUpperFont: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  heavyFont: {
    fontWeight: 'bold',
  },
  paddingCombination: {
    padding: '1rem 0.5rem',
  },
  disableLink: {
    color: `${theme.palette.colors.darkGray}`,
    pointerEvents: 'none',
    textDecoration: 'none',
  },
}));
