import { LibraryGrid, LibraryText } from 'vg-library/core';

import { useStyles } from './style';

const NoData = ({ content = 'No Data Available' }) => {
  const classes = useStyles();
  return (
    <LibraryGrid container className={classes.center}>
      <LibraryText variant="h5" gutterBottom>
        {content}
      </LibraryText>
    </LibraryGrid>
  );
};

export default NoData;
