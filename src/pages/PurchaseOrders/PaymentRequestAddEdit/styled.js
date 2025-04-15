import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { makeStyles } from '@mui/styles';

export const ShipmentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.palette.divider};
  border-radius: ${(props) => props.theme.shape.borderRadius};
  padding: ${(props) => props.theme.spacing(0.5)};
  box-shadow: ${(props) => props.theme.shadows[3]};
  margin-bottom: 1rem;

  input {
    padding: 6px;
  }
  .shipment-table {
    td {
      padding: ${(props) => props.theme.spacing(0.4)};
    }
    .other {
      background: #1ab3943b;
    }
  }
`;

export const SalesOrderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 410px;
  padding: ${(props) => props.theme.spacing(1, 1)};
  background-color: ${(props) => props.theme.palette.background.paper};
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const TableWrapper = styled.div`
  max-height: 400px;
`;

export const AllotmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  min-height: 250px;
  .allotment-table {
    flex: 1;
    overflow: auto;
    height: 53vh;
    .input-box input {
      padding: 5px 2px;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 0;
`;

export const SummaryWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 8px 16px;
`;

export const SalesOrderContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};

  & > div {
    width: 32%;
    margin: ${(props) => props.theme.spacing(0.5, 0)};
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    & > div {
      width: 47%;
      margin: ${(props) => props.theme.spacing(0.5, 0)};
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    & > div {
      width: 100%;
      margin: ${(props) => props.theme.spacing(0.5, 0)};
    }
  }
`;

export const RecordGridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};
  & > div {
    width: 100%;
    margin: ${(props) => props.theme.spacing(1)};
  }
`;

export const GridContainer = styled(Grid)`
  padding: ${(props) => props.theme.spacing(1)};

  & > div {
    width: 32%;
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
      width: 100px;
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

export const RecordWrapper = styled.div`
  padding: 8px;
  border: 1px solid #2d394147;
  border-radius: 4px;
`;


export const useStyles = makeStyles(() => ({
  marginTop: {
    marginTop: '1rem',
  },
}))