import { makeStyles } from '@mui/styles';
import Text from 'Components/Text';
import styled from 'styled-components';

export const LeftSection = styled.div`
  display: flex;
  min-width: 300px;
  width: 40%;
  height: 100%;
  flex-direction: column;
  overflow: auto;
  margin-right: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-self: center;
    width: 98%;
  }
`;

export const RightSection = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`;

export const ImageListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  margin-top: 1rem;

  span {
    position: relative;
    display: flex;
    margin-right: ${(props) => props.theme.spacing(1)};
    padding: ${(props) => props.theme.spacing(1)};
    background: #fff;
    border-radius: 4px;

    img {
      width: 100px;
    }

    .cancel-icon {
      position: absolute;
      top: 1px;
      right: -2px;
    }

    .pdf-icon {
      font-size: ${(props) => props.theme.typography.h2.fontSize};
    }
  }
`;

export const ShipmentInfoWrapper = styled.div((props) => ({
  background: props.bgColor,
  cursor: 'pointer',
}));

export const CustomText = styled(Text)((props) => ({
  marginTop: props.idx !== 0 ? '0.5rem' : 0,
}));

export const classes = makeStyles((theme) => ({
  marginTop: {
    marginTop: '1rem',
  },
  marginBottom: {
    marginBottom: '1rem',
  },
  fullWidth: {
    maxWidth: '100%',
  },
  padding: {
    padding: '1rem',
  },
  largeWidth: {
    width: '15.625rem',
  },
  gapMarginTop: {
    marginTop: '1.25rem',
  },
  separator: {
    margin: '0.5rem 0',
    borderTop: '1px dashed #000',
    width: '100%',
  },
  deliveryHeaderWrapper: {
    display: 'flex',
    fontWeight: 800,
    fontSize: '0.8rem',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'sticky',
    zIndex: 1,
    top: 0,
    background: theme.palette.colors.gray2,
    borderRadius: '0.25rem',
  },
  headerLabel: {
    padding: '1.5rem',
    textAlign: 'center',
  },
  deliveryGridWrapper: {
    padding: '0 1rem',
    textAlign: 'center',
    wordBreak: 'break-all',
  },
  deliveryInfoWrapper: {
    overflowY: 'auto',
  },
  shipmentRow: {
    padding: '0.5rem 0',
  },
  receivedDateWrapper: {
    marginTop: '0.5rem',
  },
}));
