import { lighten } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

const drawerWidth = 250;

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60px;
  height: 100%;
  margin-right: 1px;
  overflow: auto;
  background: ${(props) => props.theme.palette.colors.white};
`;

export const ListItemStyled = styled(ListItem)`
  border-left: 4px solid transparent;
  &.active {
    background: ${(props) => lighten(props.theme.palette.primary.main, 0.85)};
    border-left: 4px solid ${(props) => props.theme.palette.primary.main};
  }
`;

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    minHeight: 50,
  },

  toolbarImage: {
    width: '80%',
  },

  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  root: {
    zIndex: theme.zIndex.modal,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& .icon': {
      color: theme.palette.primary.main,
    },
  },
}));

export default useStyles;
