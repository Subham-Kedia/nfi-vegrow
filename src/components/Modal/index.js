import CancelIcon from '@mui/icons-material/Cancel';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import AppLoader from 'Components/ProgressLoader';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: ({ styleItems }) => ({
    display: 'flex',
    padding: '10px',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    maxWidth: '95%',
    maxHeight: 'calc(100vh - 15%)',
    minWidth: '300px',
    zIndex: 1,
    borderRadius: styleItems?.borderRadius || '0.5rem',
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    margin: theme.spacing(1, 1),
    fontSize: '24px',
  },
  modalbody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: theme.spacing(1, 1),
    overflowX: 'hidden',
  },
  title: {
    padding: theme.spacing(1, 1),
  },
  footer: {
    padding: theme.spacing(2, 1, 1, 0),
    textAlign: 'right',
  },
  emptyTitle: {
    display: 'flex',
    justifyContent: 'right',
  },
  carouselModalbody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3, 1),
    overflow: 'hidden',
  },
}));

const CustomModal = ({
  isLoading,
  title,
  children,
  open,
  footerComponent,
  onClose,
  fullScreen = false,
  halfScreen = false,
  isCloseIcon = true,
  contentSize = false,
  width80 = false,
  carouselModalbody = false,
  disableBackdropClick = true,
  styleItems,
  ...props
}) => {
  const classes = useStyles({ styleItems });
  const extraProps = {};

  if (fullScreen) {
    extraProps.style = {
      height: '99%',
      width: '99%',
      maxWidth: 'unset',
      maxHeight: 'unset',
    };
  }

  if (halfScreen) {
    extraProps.style = {
      height: '90%',
      width: '50%',
      maxWidth: 'unset',
      maxHeight: 'unset',
    };
  }

  if (contentSize) {
    extraProps.style = {
      height: 'auto',
      width: '50%',
      maxWidth: 'unset',
      maxHeight: 'unset',
    };
  }

  if (width80) {
    extraProps.style = {
      height: '99%',
      width: '80%',
      maxWidth: 'unset',
      maxHeight: 'unset',
    };
  }

  const handleClose = (event, reason) => {
    if (disableBackdropClick) {
      if (reason !== 'backdropClick') {
        onClose(event, reason);
      }
    } else onClose(event, reason);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      onClose={handleClose}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}
    >
      <Fade in={open}>
        <div className={classes.paper} {...extraProps}>
          <div className={title ? classes.header : classes.emptyTitle}>
            {title && (
              <Typography variant="h6" component="h2" className={classes.title}>
                <b>{title}</b>
              </Typography>
            )}
            {isCloseIcon && (
              <CancelIcon
                className={classes.icon}
                onClick={onClose}
                cursor="pointer"
              />
            )}
          </div>
          {isLoading && <AppLoader />}
          <div
            className={
              carouselModalbody ? classes.carouselModalbody : classes.modalbody
            }
          >
            {children}
          </div>
          {footerComponent && (
            <div className={classes.footer}>
              {!!footerComponent && footerComponent}
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
