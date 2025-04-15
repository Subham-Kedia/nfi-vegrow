import React from 'react';
import Pagination from '@mui/material/Pagination';

import { PaginationWrapper } from './style';

/**
 * Helper component to add pagination to any component
 * @param {Object} props
 * count (Total count) |  page (Current page) |  shape (Shape of the pagination) |  onChange (On change callback)
 * @returns
 */
const CustomPagination = (props) => {
  return (
    <PaginationWrapper justify={props.justify}>
      <Pagination {...props} />
    </PaginationWrapper>
  );
};

export default CustomPagination;
