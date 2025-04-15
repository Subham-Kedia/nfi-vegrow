import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 50,
    padding: theme.spacing(0, 2),
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  title: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  selectdc: {
    color: '#fff',
    border: '1px solid #fff',
    padding: '2px 15px',
    margin: '0 6px',
  },
}));

export default useStyles;
