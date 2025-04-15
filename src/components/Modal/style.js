import Grid from '@mui/material/Grid';
import styled from 'styled-components';

export const AllotmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1150px;
  min-height: 250px;
  height: 1000px;
  .allotment-table {
    flex: 1;
    overflow: auto;
    height: 53vh;
    .input-box input {
      padding: 5px 2px;
    }
  }
`;

export const RecordGridContainer = styled(Grid)`
  flex: 1;
  align-content: baseline;
  padding: ${(props) => props.theme.spacing(1)};
  & > div {
    width: 100%;
    margin: ${(props) => props.theme.spacing(1)};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
`;

export const GridWrapper = styled.section`
  display: flex;
  width: 80%;
  margin-top: 50px;
  justify-content: space-between;
`;
