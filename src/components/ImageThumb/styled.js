import styled from 'styled-components';

export const ImageWrapper = styled.span`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-right: ${(props) => props.theme.spacing(1)};
  padding: ${(props) => props.theme.spacing(1)};
  background: ${(props) => props.theme.palette.grey[200]};
  border-radius: 4px;

  img {
    width: 100px;
    cursor: pointer;
  }

  .cancel-icon {
    position: absolute;
    top: -2px;
    right: -5px;
  }

  .pdf-icon {
    font-size: ${(props) => props.theme.typography.h1.fontSize};
    cursor: pointer;
  }
`;

export default ImageWrapper;
