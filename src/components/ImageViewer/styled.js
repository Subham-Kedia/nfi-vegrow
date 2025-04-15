import styled from 'styled-components';

export const ImageListWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #eeeeee;

  img {
    width: auto;
    height: auto;
    max-height: 400px;
    max-width: 90%;
  }

  span {
    margin-right: 0;
  }

  .pdf-icon {
    width: 100%;
    height: 400px;
    cursor: pointer;
  }
`;

export const ImageWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`

export const ImageList = styled.div`
  display: flex;
  max-width: 100%;
  overflow-x: hidden;

  .carousel__image {
    margin-right: 1.5rem;
    border: 3px solid #ffa70000;
    opacity: 0.2;
  }

  .carousel__image-selected {
    border: 3px solid #ffa700 !important;
    opacity: 1;
  }

  .carousel__bottom__list {
    p {
      width: 100px;
      margin-right: 1rem;
      text-align: center;
    }
  }
`;
