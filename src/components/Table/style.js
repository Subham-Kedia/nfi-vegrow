import TableRow from '@mui/material/TableRow';
import { makeStyles, withStyles } from '@mui/styles';

export const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  container: {
    flex: 1,
  },
  headerCellWrapper: {
    fontWeight: 'bold',
  },
});

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
