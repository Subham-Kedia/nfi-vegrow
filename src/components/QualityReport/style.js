import styled from 'styled-components';

export const ImageListWrapper = styled.div`
  display: flex;
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
