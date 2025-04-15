import { useState } from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Typography from '@mui/material/Typography';
import ConfirmationDialog from 'Components/ConfirmationDialog';
import { getImageLocalPath } from 'Utilities';

import { ImageWrapper } from './styled';

const ImageThumb = ({
  file,
  url,
  title,
  cancelStyle,
  removeAttachment,
  index,
  dialog = false,
  ...rest
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const isPdf = file?.type
    ? file.type === 'application/pdf'
    : url?.endsWith('.pdf');
  const fileSrc = file?.type ? getImageLocalPath(file) : url;

  const openUrl = () => {
    window.open(fileSrc, '_blank');
  };

  const deleteAttachment = () => {
    if (!dialog) {
      return removeAttachment(index);
    }
    setOpenDialog(true);
  };

  return (
    <>
      <ImageWrapper>
        {isPdf ? (
          <PictureAsPdfIcon
            onClick={openUrl}
            color="primary"
            className="pdf-icon"
            {...rest}
          />
        ) : (
          <img src={fileSrc} alt={fileSrc} onClick={openUrl} {...rest} />
        )}

        {removeAttachment && (
          <CancelOutlinedIcon
            className="cancel-icon"
            color="error"
            cursor="pointer"
            style={cancelStyle}
            onClick={deleteAttachment}
          />
        )}
        {title && (
          <Typography variant="body2" component="span" color="textPrimary">
            {title}
          </Typography>
        )}
      </ImageWrapper>
      <ConfirmationDialog
        open={openDialog}
        title="Warning"
        onCancel={() => setOpenDialog(false)}
        onConfirm={() => {
          removeAttachment();
          setOpenDialog(false);
        }}
      >
        Are you sure, you want to delete this attachment ?
      </ConfirmationDialog>
    </>
  );
};

export default ImageThumb;
