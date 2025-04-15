import { Typography } from '@mui/material';
import { CustomModal, ImageThumb } from 'Components';
import { LibraryGrid } from 'vg-library/core';

import { ImageListWrapper, useStyles } from '../styled';

const ImageGalleryModal = ({
  openImageModal,
  setOpenImageModal,
  images = [],
  currentRow,
  setRowImages,
  isEditable,
}) => {
  const { margin1, margin03 } = useStyles();
  const removeAttachments = (index) => {
    images.splice(index, 1);
    setRowImages((prev) => ({
      ...prev,
      [currentRow]: images,
    }));
  };

  const isFile = (image) => {
    return image instanceof File;
  };

  return (
    <CustomModal
      title="Audit Images"
      open={openImageModal}
      isCloseIcon
      onClose={() => setOpenImageModal(false)}
      styleItems={{ borderRadius: '1rem' }}
    >
      <LibraryGrid container spacing={2}>
        {images.length === 0 ? (
          <LibraryGrid item xs={12}>
            <Typography>No images uploaded</Typography>
          </LibraryGrid>
        ) : (
          images.map((image, index) => {
            if (!image) return null;
            const url = isFile(image) ? URL.createObjectURL(image) : image;
            return (
              <ImageListWrapper key={url} className={margin1}>
                <ImageThumb
                  file={image}
                  url={url}
                  className={margin03}
                  removeAttachment={
                    isEditable ? () => removeAttachments(index) : undefined
                  }
                />
              </ImageListWrapper>
            );
          })
        )}
      </LibraryGrid>
    </CustomModal>
  );
};

export default ImageGalleryModal;
