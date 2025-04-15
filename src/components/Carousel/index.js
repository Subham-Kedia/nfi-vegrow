import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import AppButton from 'Components/AppButton';
import ImageThumb from 'Components/ImageThumb';
import ImageViewer from 'Components/ImageViewer';

import classes, { ImageListWrapper } from './style';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Carousel = ({ imageData }) => {
  const { root, header, rightButton, leftButton, buttonWrapper } = classes();

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = imageData?.length;
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (item) => {
    setActiveStep(item);
  };

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    imageData?.length > 0 && (
      <div className={root}>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {imageData?.map((item, index) => (
            <div key={item.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <ImageListWrapper>
                  <ImageThumb
                    file={item?.file}
                    url={item?.file}
                    style={{
                      height: '100px',
                      width: '100px',
                    }}
                    onClick={toggleModal}
                  />
                </ImageListWrapper>
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <Paper square elevation={0} className={header}>
          <Typography>{imageData[activeStep]?.label}</Typography>
        </Paper>
        <AppButton
          variant="text"
          className={rightButton}
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
          wrapperClassName={buttonWrapper}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </AppButton>
        <AppButton
          variant="text"
          className={leftButton}
          onClick={handleBack}
          disabled={activeStep === 0}
          wrapperClassName={buttonWrapper}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </AppButton>
        {open && (
          <ImageViewer
            open={open}
            images={imageData}
            toggleModal={toggleModal}
          />
        )}
      </div>
    )
  );
};

export default Carousel;
