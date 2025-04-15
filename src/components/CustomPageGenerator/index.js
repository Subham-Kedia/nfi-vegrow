import { Fragment, useEffect, useState } from 'react';
import { matchRoutes, useLocation, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { AppButton, TableContainer, VendorSelection } from 'Components';
import { Formik } from 'formik';
import Confirmation from 'Pages/MaterialAssignment/Popups/Confirmation';
import PATH from 'Routes/path';
import { getConfiguration } from 'Utilities/getConfiguration';

import { BoldText, ButtonContainer, StyledGrid, StyledPaper } from './style';

const routes = [
  { path: `/app/${PATH.ADD_MATERIAL_ASSIGNMENT.URL}` },
  { path: `/app/${PATH.EDIT_MATERIAL_ASSIGNMENT.URL}` },
  { path: `/app/${PATH.RECEIVE_MATERIAL_ASSIGNMENT.URL}` },
];

const CustomPageGenerator = () => {
  const params = useParams();
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location);
  const configuration = getConfiguration(route.path, params);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [initialValues, setInitialValues] = useState(
    configuration.initialValues || {},
  );

  useEffect(() => {
    if (configuration.getInitialValues) {
      configuration.getInitialValues().then((res) => {
        if (res) setInitialValues(res);
        setLoading(false);
      });
    }
  }, []);

  const handleButtonClick = (showConfirmation, confirmationProps) => {
    if (showConfirmation) {
      setConfirmationData({
        open: true,
        ...confirmationProps,
        handleOnConfirm: () => {
          setButtonLoading(true);
          confirmationProps.handleOnConfirm(
            closeConfirmationDialog,
            setButtonLoading,
          );
        },
      });
    }
  };

  const renderFields = (
    fieldType,
    fieldProps,
    showButton,
    buttonTxt,
    buttonProps,
    showConfirmation,
    confirmationProps,
  ) => {
    switch (fieldType) {
      case 'vendorSelection':
        return (
          <Grid xs={12} md={6} lg={4} xl={3}>
            <VendorSelection {...fieldProps} />
            {showButton && (
              <AppButton
                variant="text"
                size="medium"
                className="float-right"
                {...buttonProps}
              >
                {buttonTxt}
              </AppButton>
            )}
          </Grid>
        );
      case 'button':
        return (
          <ButtonContainer>
            <AppButton
              size="medium"
              className="margin-horizontal"
              loading={buttonLoading}
              onClick={() =>
                handleButtonClick(showConfirmation, confirmationProps)
              }
              {...fieldProps}
            >
              {buttonTxt}
            </AppButton>
          </ButtonContainer>
        );
      default:
        return false;
    }
  };

  const handleSubmit = (values, helpers) => {
    if (configuration.showConfirmationOnSubmit) {
      setConfirmationData({
        open: true,
        ...configuration.confirmationProps,
        handleClose: () => {
          closeConfirmationDialog();
          helpers.setSubmitting(false);
        },
        handleOnConfirm: () =>
          configuration.onSubmit(values, helpers, closeConfirmationDialog),
      });
    } else configuration.onSubmit(values, helpers);
  };

  const closeConfirmationDialog = () => {
    setConfirmationData({});
  };

  return (
    <PageLayout
      isLoading={loading}
      {...configuration.header}
      title={`${configuration.header.title}  ${
        initialValues.identifier ? initialValues.identifier : ''
      }`}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, values, handleReset }) => (
          <>
            <PageLayout.Body>
              <StyledPaper>
                <StyledGrid container>
                  {configuration.fields.map((field) => {
                    return (
                      <Fragment key={field.id}>
                        {renderFields(
                          field.type,
                          field.fieldProps,
                          field.showButton,
                          field.buttonTxt,
                          field.buttonProps,
                          field.showConfirmation,
                          field.confirmationProps,
                        )}
                      </Fragment>
                    );
                  })}
                </StyledGrid>
                <BoldText variant="subtitle2" value="Assigned Item Details" />
                <TableContainer
                  values={values}
                  columnConfig={configuration.columns}
                  {...configuration.columnsAdditionalConfig}
                  handleReset={handleReset}
                />
              </StyledPaper>
            </PageLayout.Body>
            <PageLayout.Footer>
              {configuration.buttons.map((button) => {
                return (
                  <AppButton
                    key={button.id}
                    size="medium"
                    className="margin-horizontal"
                    {...button.props}
                    {...(button.type === 'submit'
                      ? {
                          onClick: handleSubmit,
                          type: 'submit',
                          loading: isSubmitting,
                        }
                      : {})}
                  >
                    {button.text}
                  </AppButton>
                );
              })}
            </PageLayout.Footer>
          </>
        )}
      </Formik>
      <Confirmation
        open={confirmationData.open || false}
        handleClose={closeConfirmationDialog}
        {...confirmationData}
      />
    </PageLayout>
  );
};

export default CustomPageGenerator;
