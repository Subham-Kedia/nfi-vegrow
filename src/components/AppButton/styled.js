import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

export const Wrapper = styled.span`
  position: relative;
`;

export const ButtonProgress = styled(CircularProgress)`
  color: ${(props) => props.theme.palette[props.color].contrastText};
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;
