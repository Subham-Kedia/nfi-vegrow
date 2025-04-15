import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

export const ImageListWrapper = styled.div`
  display: inline-block;
  padding-bottom: ${({ theme }) => theme.spacing(0.5)};
  overflow-x: auto;
  background: ${({ theme }) => theme.palette.colors.brightGray};

  span {
    position: relative;
    display: flex;
    margin-right: ${({ theme }) => theme.spacing(0.5)};
    padding: 0.313rem;
    background: ${({ theme }) => theme.palette.colors.brightGray};
    border-radius: 0.2rem;

    img {
      width: 6.25rem;
    }

    .cancel-icon {
      position: absolute;
      right: -0.13rem;
    }

    .pdf-icon {
      font-size: ${({ theme }) => theme.typography.h2.fontSize};
    }
  }
`;

export const useStyles = makeStyles((theme) => ({
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  card: {
    marginBottom: '1rem',
    overflow: 'visible',
  },
  cardContent: {
    paddingTop: '0.6rem !important',
    paddingBottom: '0.6rem !important',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  remarksContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: '0.1rem',
  },
  inventoryCard: {
    border: `1px solid ${theme.palette.colors.dustyGray}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  diffWrapper: {
    flexGrow: 1,
    textAlign: 'end',
    paddingRight: theme.spacing(2),
  },
  quantityInput: {
    width: 100,
    marginRight: theme.spacing(1),
  },
  itemCodeText: {
    fontSize: '0.625rem',
  },
  inventoryMobileWrapper: {
    padding: theme.spacing(2),
    position: 'relative',
  },
  draftButton: {
    marginRight: '0.5rem',
    color: 'green',
  },
  paperStyle: {
    marginBottom: '0.5rem',
    padding: '0.5rem 1rem',
    position: 'sticky',
    top: 0,
    zIndex: 9,
  },
  width12: {
    width: '12rem',
  },
  gridRowWiseContainer: {
    padding: '1rem',
    background: theme.palette.colors.white,
    justifyContent: 'space-evenly',
    position: 'relative',
  },
  width100: {
    width: '100%',
  },
  inventoryGridBodyContainer: { width: '100%', marginTop: '0.5rem' },
  gridPosition: {
    position: 'relative',
  },
  flex2: {
    flex: 2,
  },
  paddingTop1: {
    paddingTop: '1rem',
  },
  margin1: {
    margin: '1rem',
  },
  margin03: {
    margin: '0.3rem',
  },
  textCenter: {
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  closeButtonDesktop: {
    position: 'absolute',
    top: '-0.75rem',
    right: '-0.75rem',
  },
  banner: {
    background: theme.palette.primary.main,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.colors.white,
  },
  justifyEnd: {
    justifyContent: 'end',
  },
  webCamWrapper: {
    zIndex: 9999,
  },
}));
