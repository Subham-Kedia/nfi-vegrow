import React from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { RightSection } from './styled';

const Sm = ({
  children = null,
  backHandler = () => {},
  selectedId = null,
  rightSection = () => <></>,
  leftSection = () => <></>,
  ...props
}) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Grid container {...props}>
      {matches ? (
        selectedId ? (
          <MobileRightSection
            rightSection={rightSection}
            backHandler={backHandler}
          />
        ) : (
          leftSection()
        )
      ) : (
        children || (
          <>
            {leftSection()}
            {rightSection()}
          </>
        )
      )}
    </Grid>
  );
};

const MobileRightSection = ({ rightSection, backHandler }) => {
  return (
    <RightSection>
      <Grid container direction="row">
        <IconButton
          size="small"
          variant="contained"
          color="primary"
          onClick={backHandler}
        >
          <KeyboardArrowLeft fontSize="large" />
          Back
        </IconButton>
        {rightSection()}
      </Grid>
    </RightSection>
  );
};

export default Sm;
