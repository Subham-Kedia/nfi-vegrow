import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import { useSiteValue } from 'App/SiteContext';
import AppButton from 'Components/AppButton';

import {
  ArrowWrapper,
  FilterButton,
  LeftSection,
  OtherInfoWrapper,
  PageTitleWrapper,
  RightSection,
  TitleWrapper,
} from './styled';

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

const PageTitle = ({
  showBackHandler,
  showSelectDC,
  showFilterHandler,
  isFilterChanged,
  title,
  titleHelper,
  otherInfo,
  children,
  dcFilterFn,
}) => {
  const { userInfo, setDCId, dcId } = useSiteValue();
  const [anchorDCEl, setAnchorDCEl] = useState(null);

  const handleClose = () => {
    setAnchorDCEl(null);
  };

  const selectDC = (id) => {
    setDCId(id);
    handleClose();
  };

  const filteredDcs = Function.prototype.isPrototypeOf(dcFilterFn)
    ? (userInfo.dcs || []).filter(dcFilterFn)
    : userInfo.dcs || [];

  return (
    <PageTitleWrapper elevation={0} square>
      <LeftSection>
        <TitleWrapper>
          {showBackHandler && (
            <ArrowWrapper onClick={showBackHandler}>
              <ArrowBackIcon />
            </ArrowWrapper>
          )}
          <Typography variant="subtitle1" component="h2">
            <b>{title}</b>
          </Typography>
          {!!titleHelper && titleHelper}
          {showSelectDC && (
            <Box
              aria-label="Select DC"
              aria-controls="select-dc"
              aria-haspopup="true"
              onClick={(event) =>
                filteredDcs.length > 1 && setAnchorDCEl(event.currentTarget)
              }
              data-cy="selectDC"
            >
              <AppButton variant="outlined">
                {(filteredDcs.find((d) => d.id === parseInt(dcId, 10)) || {})
                  .name || 'Select DC'}
              </AppButton>
            </Box>
          )}
          <OtherInfoWrapper>{otherInfo}</OtherInfoWrapper>
          <StyledMenu
            id="select-dc"
            anchorEl={anchorDCEl}
            keepMounted
            open={!!anchorDCEl}
            onClose={handleClose}
          >
            {[
              ...filteredDcs.map(({ id, name }) => (
                <MenuItem
                  key={id}
                  onClick={() => selectDC(id)}
                  data-cy="dcList"
                >
                  {name}
                </MenuItem>
              )),
            ]}
          </StyledMenu>
        </TitleWrapper>
        <Hidden mdUp>
          <FilterButton>
            {!!showFilterHandler && (
              <FilterListIcon
                width="2em"
                height="2em"
                onClick={showFilterHandler}
              />
            )}
          </FilterButton>
        </Hidden>
      </LeftSection>
      {children && <RightSection>{children}</RightSection>}
      <Hidden smDown>
        <FilterButton active={isFilterChanged}>
          {!!showFilterHandler && (
            <FilterListIcon width="2em" onClick={showFilterHandler} />
          )}
        </FilterButton>
      </Hidden>
    </PageTitleWrapper>
  );
};

export default PageTitle;
