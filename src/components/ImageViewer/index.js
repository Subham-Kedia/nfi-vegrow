import { useEffect, useRef, useState } from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ImageThumb from 'Components/ImageThumb';
import CustomModal from 'Components/Modal';

import AppButton from '../AppButton';

import classes from './style';
import { ImageList, ImageListWrapper, ImageWrapper } from './styled';

const ImageViewer = ({ images, title, open, toggleModal }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState([]);
  const carouselItemsRef = useRef(images);
  const { rightButton, leftButton, carousel, buttonWrapper } = classes();

  useEffect(() => {
    if (images) {
      carouselItemsRef.current = carouselItemsRef.current?.slice(
        0,
        images?.length,
      );
      setSelectedImageIndex(0);
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleSelectedImageChange = (newIdx) => {
    if (images?.length > 0) {
      setSelectedImage(images[newIdx]);
      setSelectedImageIndex(newIdx);
      if (carouselItemsRef?.current[newIdx]) {
        carouselItemsRef?.current[newIdx]?.scrollIntoView({
          inline: 'center',
          behavior: 'smooth',
        });
      }
    }
  };

  const handleRightClick = () => {
    if (images?.length > 0) {
      let newIdx = selectedImageIndex + 1;
      if (newIdx >= images?.length) {
        newIdx = 0;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  const handleLeftClick = () => {
    if (images?.length > 0) {
      let newIdx = selectedImageIndex - 1;
      if (newIdx < 0) {
        newIdx = images?.length - 1;
      }
      handleSelectedImageChange(newIdx);
    }
  };

  const openUrl = () => {
    window.open(selectedImage?.file, '_blank');
  };

  const isPdf = (file) => file?.endsWith('.pdf');

  return (
    <CustomModal
      isLoading={false}
      title={title}
      open={open}
      onClose={toggleModal}
      carouselModalbody
      contentSize
    >
      <div>
        <ImageListWrapper>
          {isPdf(selectedImage?.file) ? (
            <PictureAsPdfIcon
              color="primary"
              className="pdf-icon"
              onClick={openUrl}
            />
          ) : (
            <ImageWrapper>
              <ImageThumb
                file={selectedImage?.file}
                url={selectedImage?.file}
              />
            </ImageWrapper>
          )}
          <AppButton
            size="medium"
            variant="text"
            className={rightButton}
            onClick={handleRightClick}
            wrapperClassName={buttonWrapper}
          >
            <KeyboardArrowRight />
          </AppButton>
          <AppButton
            size="medium"
            variant="text"
            className={leftButton}
            onClick={handleLeftClick}
            wrapperClassName={buttonWrapper}
          >
            <KeyboardArrowLeft />
          </AppButton>
        </ImageListWrapper>
        <Paper square elevation={0}>
          <Typography
            style={{
              margin: '1rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {selectedImage?.label}
          </Typography>
        </Paper>
        <div className={carousel}>
          <ImageList>
            {images &&
              images?.map((image, id) => {
                return isPdf(image?.file) ? (
                  <div className="carousel__bottom__list">
                    <PictureAsPdfIcon
                      color="primary"
                      style={{
                        height: '100px',
                        width: '100px',
                      }}
                      onClick={() => handleSelectedImageChange(id)}
                      key={image.id}
                      className={`pdf-icon carousel__image ${
                        selectedImageIndex === id && 'carousel__image-selected'
                      }`}
                      ref={(el) => (carouselItemsRef.current[id] = el)}
                    />
                    <Typography>{image?.label}</Typography>
                  </div>
                ) : (
                  <div className="carousel__bottom__list">
                    <img
                      src={image?.file}
                      style={{
                        height: '100px',
                        width: '100px',
                      }}
                      onClick={() => handleSelectedImageChange(id)}
                      key={image.id}
                      className={`carousel__image ${
                        selectedImageIndex === id && 'carousel__image-selected'
                      }`}
                      ref={(el) => (carouselItemsRef.current[id] = el)}
                      alt="carousel"
                    />
                    <Typography>{image?.label}</Typography>
                  </div>
                );
              })}
          </ImageList>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImageViewer;
