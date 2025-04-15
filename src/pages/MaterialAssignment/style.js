import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Text from 'Components/Text';
import styled from 'styled-components';

export const RecievingText = styled(Text)(({ marginTop }) => ({
  padding: 0,
  fontWeight: 'bold',
  marginTop,
}));

export const RecievingIdentifier = styled(Text)(() => ({
  padding: 0,
  display: 'block',
  fontWeight: 'bold',
}));

export const MAIdentifier = styled(Text)(() => ({
  fontWeight: 'bold',
  padding: 0,
  fontSize: '1.3rem',
}));

export const classes = makeStyles(() => ({
  summaryGap: {
    display: 'flex',
    gap: '1rem',
  },
}));

export const DownloadIcon = styled(IconButton)`
  padding-top: 0;
  padding-bottom: 0;
  display: block;
`;
