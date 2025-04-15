import { makeStyles } from '@mui/styles';

const classes = makeStyles(() => ({
  rightButton: {
    top: '11rem',
    position: 'absolute',
    right: '-0.5rem',
  },
  leftButton: {
    top: '11rem',
    position: 'absolute',
    left: '-0.5rem',
  },
  carousel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    position: 'static !important',
  },
}));

export default classes;
