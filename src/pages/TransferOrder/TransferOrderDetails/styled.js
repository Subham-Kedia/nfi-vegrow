import { Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

export const GridWrapper = styled(Grid)`
  border: 1px solid gray;
  padding: 1rem;
`;

export const ImageWrapper = styled(Grid)`
  margin: 1rem 0;
`;

export const GridButtonContainer = styled(Grid)`
  margin: 1rem;
  display: flex;
  justify-content: center;
`;

export const MarginSpacedTypography = styled(Typography)`
  margin: 10px 0;
  color: textPrimary;
`;

export const WidthGrid = styled(Grid)`
  min-width: 25rem;
`;

export const MarginGrid = styled(Grid)`
  margin: 1rem 0;
`;

export const StyledPaper = styled(Paper)`
  padding: 10px;
`;

export const BoldTypography = styled(Typography)`
  font-weight: bold;
  color: textPrimary;
`;

export const MarginGridContainer = styled(Grid)`
  margin: 2px;
`;

export const TopMarginGrid = styled(Grid)`
  margin-top: 4px;
`;

export const BottomMarginGrid = styled(Grid)`
  margin-bottom: 1rem;
`;

export const classes = makeStyles((theme) => ({
  colorBlack: {
    color: theme.palette.colors.black,
  },
}));
