import { Fab } from '@mui/material';

import classes from './style';

const FloatingButton = ({
  color = 'primary',
  variant = 'extended',
  wrapperClass,
  children,
  ...rest
}) => {
  const { floatingButton } = classes();
  return (
    <Fab
      color={color}
      className={wrapperClass || floatingButton}
      variant={variant}
      {...rest}
    >
      {children}
    </Fab>
  );
};

export default FloatingButton;
