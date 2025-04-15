import { makeStyles } from '@mui/styles';

export const classes = makeStyles(() => ({
  paper: {
    width: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5px',
    listStyle: 'none',
  },
  popper: {
    zIndex: '2',
  },
  popperText: {
    cursor: 'pointer',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  actionFont: {
    fontWeight: 'bold',
  },
  summaryGap: {
    display: 'flex',
    gap: '1rem',
  },
}));
