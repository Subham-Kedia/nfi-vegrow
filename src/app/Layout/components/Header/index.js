import { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import { useSiteValue } from 'App/SiteContext';
import ImageIcons from 'Components/AppIcons/ImageIcons';

import useStyles from './styled';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const Header = ({ toggleSidebar }) => {
  const classes = useStyles();
  const { userInfo, logoutUser } = useSiteValue();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <ImageIcons name="logo" width="40" />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Supply Chain
        </Typography>
        <Box
          aria-label="account of current user"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <AccountCircle style={{ fontSize: 36, cursor: 'pointer' }} />
        </Box>

        <StyledMenu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          <MenuItem>{userInfo?.name}</MenuItem>
          <MenuItem onClick={logoutUser}>Logout</MenuItem>
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
