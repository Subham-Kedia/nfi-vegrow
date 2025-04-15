import Paper from '@mui/material/Paper';
import styled from 'styled-components';

export const FilterWrapper = styled(Paper)`
  display: flex;
  min-height: 145px;
  padding: ${(props) => props.theme.spacing(1, 0)};
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: auto;

  ${(props) => props.theme.breakpoints.down('sm')} {
    align-self: center;
  }
`;

export const columnStyles = {
  header: {
    minHeight: '2.5rem',
    width: '80%',
  },
  data: {
    minHeight: '2.5rem',
  },
};
