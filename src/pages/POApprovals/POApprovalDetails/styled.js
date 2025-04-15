import { makeStyles } from '@mui/styles';

export const classes = makeStyles((theme) => ({
  gridWrapper: {
    padding: '1rem',
    backgroundColor: theme.palette.colors.white,
  },
  marginLeft: {
    marginLeft: 75,
  },
  createdText: {
    paddingBottom: '5px',
    paddingTop: '10px',
  },
  vendorBackground: {
    backgroundColor: theme.palette.colors.gray94,
  },
  vendorMargin: {
    marginLeft: '30px',
  },
  conditionsPadding: {
    paddingLeft: '5px',
  },
  imgStyle: {
    height: '4rem',
    width: '4rem',
  },
  marginBottom: {
    marginBottom: '1rem',
  },
  marginTop: {
    marginTop: '1rem',
  },
  itemCodeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    cursor: 'pointer',
  },
}));

export const rejectButtonStyle = {
  backgroundColor: '#ffcfc9',
  color: '#e92a26',
};

export const approveButtonStyle = {
  backgroundColor: '#cff5a6',
  color: '#007200',
};
