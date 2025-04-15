import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

const classes = makeStyles((theme) => ({
  trackerWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: '1px',
    width: '5rem',
    backgroundColor: theme.palette.primary.main,
    position: 'relative',
    top: '-0.625rem',
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
  },
}));

export default classes;

export const CircularBox = styled.div(({ is_coloured, theme }) => ({
  width: '1.5rem',
  height: '1.5rem',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '50%',
  backgroundColor: is_coloured
    ? theme.palette.primary.main
    : theme.palette.colors.white,
  color: is_coloured ? theme.palette.colors.white : theme.palette.colors.black,
}));
