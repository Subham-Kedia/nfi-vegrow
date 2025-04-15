import { makeStyles } from '@mui/styles';
import { AppButton } from 'Components';
import styled from 'styled-components';

export const classes = makeStyles(() => ({
  summaryGap: {
    display: 'flex',
    gap: '1rem',
  },
  iconGap: {
    display: 'flex',
    gap: '0.1rem',
  },
  paper: {
    width: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5px',
    listStyle: 'none',
  },
  popper: {
    zIndex: '2',
  },
  popperText: {
    cursor: 'pointer',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  printButton: {
    padding: 'auto, 12px',
  },
  actionFont: {
    fontWeight: 'bold',
  },
}));

export const StyledButton = styled(AppButton)`
  padding: 0;
  margin-top: 0.5rem;
`;
