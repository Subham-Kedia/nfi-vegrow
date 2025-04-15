import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Text from 'Components/Text';
import styled from 'styled-components';

export const DocumentContainer = styled(Box)`
  border: 1px solid ${(props) => props.theme.palette.divider};
  padding: 1rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export const StyledGrid = styled(Grid)`
  margin-top: 1rem;
  row-gap: ${(props) => props.theme.spacing(1)}px;
`;

export const BoldText = styled(Text)`
  font-weight: bold;
`;

export const styles = makeStyles(() => ({
  marginBottom: {
    marginBottom: '1rem',
  },
  marginTop: {
    marginTop: '0.4rem',
  },
  infoWrapper: {
    display: 'flex',
    marginTop: '0.6rem',
    marginBottom: '0.2rem',
  },
  width15: {
    width: '15%',
    textAlign: 'center',
  },
  width30: {
    width: '30%',
    textAlign: 'center',
  },
  width25: {
    width: '25%',
  },
  gapAcknowledgementWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginTop: '1rem',
    marginBottom: '0.2rem',
  },
}));
