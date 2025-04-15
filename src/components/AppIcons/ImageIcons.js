const IconMapping = {
  box: 'nfi/box-close.png',
  weight: 'nfi/heap.png',
  trips: 'nfi/trips-logo.png',
  logo: 'nfi/logo.png',
  logoFull: 'nfi/logo_full.png',
};

const ImageIcons = ({ name, ...restProps }) => {
  const icon = IconMapping[name];
  return <img src={`${API.uiAssets + icon}`} alt={name} {...restProps} />;
};

export default ImageIcons;
