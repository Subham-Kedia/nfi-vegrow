import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

export const ImageListWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    padding: 0;
    background: transparent;

    .pdf-icon {
      font-size: ${(props) => props.theme.typography.h2.fontSize};
    }
  }
`;

const classes = makeStyles(() => ({
  root: {
    maxWidth: 150,
    marginTop: '1rem',
    marginLeft: '1rem',
    flexGrow: 1,
    position: 'relative',
  },
  header: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    width: '100%',
    marginTop: '0.3rem',
  },
  rightButton: {
    top: '2rem',
    position: 'absolute',
    right: '-2.5rem',
  },
  leftButton: {
    top: '2rem',
    position: 'absolute',
    left: '-2.5rem',
  },
  buttonWrapper: {
    position: 'static !important',
  },
}));

export default classes;
