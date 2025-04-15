import Paper from '@mui/material/Paper';
import styled from 'styled-components';

export const PageFooterWrapper = styled(Paper)`
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing(1.5)};
  border-top: 1px solid #c1c1c1;
`;

export const LeftSection = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const RightSection = styled.div``;
