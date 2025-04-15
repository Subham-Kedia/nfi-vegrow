import { useMediaQuery, useTheme } from '@mui/material';
import { DEVICE_TYPE } from 'Utilities/constants';

const useDevice = () => {
  const theme = useTheme();

  const { MOBILE, TABLET, DESKTOP } = DEVICE_TYPE;

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  if (isMobile) return MOBILE;

  if (isTablet) return TABLET;

  return DESKTOP;
};

export default useDevice;
