import Grid from '@mui/material/Grid';
import styled from 'styled-components';

export const MergingWrapper = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`;

export const RowGrid = styled(Grid)``;

export const ColumnGrid = styled(Grid)`
  flex-direction: column;
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
