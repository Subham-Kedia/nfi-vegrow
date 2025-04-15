import { Grid, Paper } from '@mui/material';
import Text from 'Components/Text';
import styled from 'styled-components';

export const StyledGrid = styled(Grid)`
  margin-bottom: 1rem;
`;

export const StyledPaper = styled(Paper)`
  padding: 1rem;
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 4rem;
  }
`;

export const BoldText = styled(Text)`
  font-weight: 700;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 1rem;
`;
