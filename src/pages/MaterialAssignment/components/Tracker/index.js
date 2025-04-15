import React from 'react';
import { useTheme } from '@mui/styles';
import { LibraryText } from 'vg-library/core';

import classes, { CircularBox } from './style';

const Tracker = ({ currentValue, TRACKER_STATES }) => {
  const theme = useTheme();
  const { trackerWrapper, line, infoWrapper } = classes();

  const tracker = Object.values(TRACKER_STATES).map(
    ({ label, value }, index) => {
      return (
        <React.Fragment key={label}>
          <div className={infoWrapper}>
            <CircularBox is_coloured={value <= currentValue} theme={theme}>
              {value}
            </CircularBox>
            <LibraryText>{label}</LibraryText>
          </div>
          {index !== Object.keys(TRACKER_STATES).length - 1 && (
            <div className={line} />
          )}
        </React.Fragment>
      );
    },
  );
  return <div className={trackerWrapper}>{tracker}</div>;
};

export default Tracker;
