import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useSiteValue } from 'App/SiteContext';
import clsx from 'clsx';
import AppIcons from 'Components/AppIcons';
import ImageIcons from 'Components/AppIcons/ImageIcons';

import useStyles, { ListItemStyled } from './styled';

const ImageRenderer = ({ isImageIcon, name, ...restProps }) => {
  const Component = isImageIcon ? ImageIcons : AppIcons;
  return <Component name={name} decoding="async" {...restProps} />;
};

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const classes = useStyles();
  const { allowedTabs } = useSiteValue();
  const [open, setOpen] = useState({});

  const handleClick = (id) => {
    setOpen({ ...open, [id]: !open[id] });
  };

  return (
    <Drawer
      classes={{
        root: classes.root,
        paper: clsx(
          classes.drawerPaper,
          !sidebarOpen && classes.drawerPaperClose,
        ),
      }}
      open={sidebarOpen}
      onClose={toggleSidebar}
    >
      <div className={classes.toolbarIcon}>
        <ImageIcons name="logoFull" className={classes.toolbarImage} />
        <IconButton onClick={toggleSidebar}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <List component="nav" aria-labelledby="nested-list-subheader">
        {allowedTabs.map(
          (t) =>
            t.main &&
            (t.children ? (
              <React.Fragment key={t.id}>
                <ListItemStyled button onClick={() => handleClick(t.id)}>
                  <ListItemIcon>
                    <ImageRenderer name={t.icon} />
                  </ListItemIcon>
                  <ListItemText primary={t.label} />
                  {open[t.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemStyled>
                <Collapse
                  in={open[t.id]}
                  timeout="auto"
                  unmountOnExit
                  style={{ paddingLeft: '1rem' }}
                >
                  {t.children.map((child) => (
                    <List
                      button
                      key={child.id}
                      to={`${t.url}/${child.url}`}
                      component={NavLink}
                      onClick={toggleSidebar}
                      style={{ textDecoration: 'none', color: '#2d3941' }}
                    >
                      <ListItemStyled>
                        <ListItemIcon>
                          <ImageRenderer
                            name={child.icon}
                            style={{ color: '#4f5c64db' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemStyled>
                    </List>
                  ))}
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItemStyled
                button
                key={t.id}
                to={`${t.url}`}
                component={NavLink}
                onClick={toggleSidebar}
              >
                <ListItemIcon>
                  <ImageRenderer name={t.icon} isImageIcon={t.isImageIcon} />
                </ListItemIcon>
                <ListItemText primary={t.label} />
              </ListItemStyled>
            )),
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
