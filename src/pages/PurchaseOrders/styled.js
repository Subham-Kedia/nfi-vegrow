import { makeStyles } from '@mui/styles';

export const styles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
  },
  spaceBottom: {
    marginBottom: '0.2rem',
  },
  midWidth: {
    width: '9.3rem',
    marginTop: 0,
  },
  maxWidth: {
    width: '12.5rem',
    marginTop: 0,
  },
  identifierFont: {
    fontWeight: 'bold',
    padding: 0,
    fontSize: '1.3rem',
  },
  topMargin: {
    padding: 0,
    marginTop: 5,
  },
  bgPadding: {
    backgroundColor: theme.palette.colors.lightGray,
    padding: '0.3rem',
  },
  shipmentFont: {
    padding: 0,
    textDecoration: 'underline',
    display: 'block',
    marginBottom: '0',
  },
  shipmentBgFont: {
    padding: 0,
    textDecoration: 'underline',
    display: 'block',
    marginBottom: '1.25rem',
  },
  draftButton: {
    marginRight: '0.5rem',
    color: theme.palette.colors.darkGreen,
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  borderRadius: {
    borderRadius: '1rem',
  },
}));
