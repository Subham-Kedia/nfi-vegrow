import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import styled from 'styled-components';

export const FilterWrapper = styled(Paper)`
  display: flex;
  min-height: 145px;
  padding: ${(props) => props.theme.spacing(1, 0)};
  margin-bottom: ${(props) => props.theme.spacing(1)};
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

export const classes = makeStyles((theme) => ({
  filterWrapper: {
    background: 'white',
    padding: '1rem',
    marginTop: '0.5rem',
  },
  filterSelect: {
    width: '20.25%',
  },
  noData: {
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: '15%',
    padding: '1.5rem',
    border: `1px solid ${theme.palette.colors.chineseSilver}`,
  },
}));

export const columnStyles = {
  header: { minHeight: '2.5rem' },
  headerWidth: { minHeight: '2.5rem', width: '70%' },
};
