import React from 'react';
import { Typography } from '@mui/material';

const Text = ({ component = 'div', variant = 'body2', children, ...props }) => {
  return (
    <Typography component={component} variant={variant} {...props}>
      {children}
    </Typography>
  );
};

export default Text;
