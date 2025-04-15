import Grid from '@mui/material/Grid';
import SnackbarContent from '@mui/material/SnackbarContent';
import styled from 'styled-components';

export const RegradingWrapper = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;

  & .title {
    padding: ${(props) => props.theme.spacing(1)};
  }

  & .form-group > div {
    margin-bottom: ${(props) => props.theme.spacing(1)};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
`;

export const RowGrid = styled(Grid)`
  flex-direction: row;
  flex: 1;
`;

export const ColumnGrid = styled(Grid)`
  flex-direction: column;
  flex: 1;
`;

export const ItemGridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};

  & > div {
    flex: 1;
    justify-content: center;
    margin: ${(props) => props.theme.spacing(1, 0.5)};
  }

  & > div.itemSelector {
    flex: 3;
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

export const Banner = styled(SnackbarContent)`
  position: absolute;
  background: #000;
  color: #fff;
  opacity: 0.8;
  z-index: 9;
  width: 98%;
`;

export const GridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};
  & > div {
    width: 100%;
    margin: ${(props) => props.theme.spacing(1, 0)};
  }
`;

export const ImageListWrapper = styled.div`
  display: flex;
  padding-bottom: ${(props) => props.theme.spacing(0.5)};
  overflow-x: auto;

  span {
    position: relative;
    display: flex;
    margin-right: ${(props) => props.theme.spacing(1)};
    padding: ${(props) => props.theme.spacing(1)};
    background: #fff;
    border-radius: 4px;

    img {
      width: 50px;
    }

    .cancel-icon {
      position: absolute;
      top: 1px;
      right: -2px;
    }

    .pdf-icon {
      font-size: ${(props) => props.theme.typography.h2.fontSize};
    }
  }
`;
