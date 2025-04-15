import ApartmentIcon from '@mui/icons-material/Apartment';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';

const IconMapping = {
  receipt: ReceiptIcon,
  shipping: LocalShippingIcon,
  harvest: EnergySavingsLeafIcon,
  inventory: ApartmentIcon,
  salesorder: ListAltIcon,
  dcarrivals: DepartureBoardIcon,
  eyeIcon: VisibilityIcon,
};

const AppIcons = ({ name, ...restProps }) => {
  const IconComponent = IconMapping[name];
  return <IconComponent {...restProps} />;
};

export default AppIcons;
