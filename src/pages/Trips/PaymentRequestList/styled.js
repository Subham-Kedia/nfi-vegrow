import ArrowDown from '@mui/icons-material/ArrowDownward';
import ArrowUp from '@mui/icons-material/ArrowUpward';
import { Button, Grid, Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledArrowUp = styled(ArrowUp)`
  color: red;
  margin-right: 1rem;
`;

export const StyledArrowDown = styled(ArrowDown)`
  color: green;
  margin-right: 1rem;
`;

export const BottomSpacedGrid = styled(Grid)`
  margin-bottom: 0.5rem;
`;

export const MaxHeightGrid = styled(Grid)`
  height: 100%;
`;

export const UnderlinedTextPointer = styled(Typography)`
  text-decoration: underline;
  cursor: pointer;
`;

export const BoldText = styled(Typography)`
  font-weight: bold;
`;

export const FlexButton = styled(Button)`
  text-transform: capitalize;
  display: flex;
  align-items: flex-start;
`;
