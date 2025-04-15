import Grid from '@mui/material/Grid';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
  background-color: #ffffff;
  padding: 4px 8px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    min-width: 100%;
  }
`;

export const GridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};

  & > div {
    width: 24%;
    margin: ${(props) => props.theme.spacing(1, 0.5)};
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    & > div {
      width: 47%;
      margin: ${(props) => props.theme.spacing(1)};
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    & > div {
      width: 100%;
      margin: ${(props) => props.theme.spacing(1)};
    }
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ItemGridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};

  & > div {
    width: 20%;
    margin: ${(props) => props.theme.spacing(1, 0.5)};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    & > div {
      width: 45%;
      margin: ${(props) => props.theme.spacing(1)};
    }
  }

  ${(props) => props.theme.breakpoints.down('xs')} {
    & > div {
      width: 100%;
      margin: ${(props) => props.theme.spacing(1)};
    }
  }
`;

export const ActionIcons = styled.span`
  display: inline-block;
  flex: 1;
  align-self: center;
  text-align: right;

  & svg {
    margin: ${(props) => props.theme.spacing(0, 1)};
    cursor: pointer;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
`;
