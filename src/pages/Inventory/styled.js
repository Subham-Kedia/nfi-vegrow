import Grid from '@mui/material/Grid';
import SnackbarContent from '@mui/material/SnackbarContent';
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

export const RowGrid = styled(Grid)``;

export const ColumnGrid = styled(Grid)`
  flex-direction: column;
`;

export const Banner = styled(SnackbarContent)`
  position: absolute;
  background: #000;
  color: #fff;
  opacity: 0.8;
  z-index: 9;
  width: 98%;
`;
