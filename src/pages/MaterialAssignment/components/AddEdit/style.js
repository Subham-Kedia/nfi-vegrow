import { makeStyles } from '@mui/styles';

const classes = makeStyles((theme) => ({
  formWrapper: {
    padding: '1rem',
    marginTop: '0.5rem',
    background: theme.palette.colors.white,
    flexGrow: 1,
  },
  imageWrapper: {
    width: '8rem',
    height: '8rem',
    float: 'right',
  },
  footerWrapper: {
    marginTop: '4rem',
  },
  commentField: {
    width: '20rem',
  },
}));

export default classes;
