import Paper from '@mui/material/Paper';
import styled from 'styled-components';

export const FilterWrapper = styled(Paper)`
  display: flex;
  padding: ${(props) => props.theme.spacing(1, 0)};
  margin-bottom: ${(props) => props.theme.spacing(1)};
  .datepicker-icon {
    padding: 0;
  }
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
