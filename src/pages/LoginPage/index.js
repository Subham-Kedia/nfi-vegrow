import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { AppButton } from 'Components';
import FieldInput from 'Components/FormFields/TextInput';
import { Formik } from 'formik';
import useDevice from 'Hooks/useDevice';
import { googleLogin, userLogin } from 'Services/users';
import { getLoginRedirectPath } from 'Utilities';
import { DEVICE_TYPE } from 'Utilities/constants';
import { validateRequired } from 'Utilities/formvalidation';
import {
  getUserData,
  saveUserData,
  saveUserDCId,
} from 'Utilities/localStorage';

import { BackgroundImage, LoginContainer, LoginFormWrapper } from './styled';

const Login = () => {
  const navigate = useNavigate();
  const userInfo = getUserData();
  const device = useDevice();
  const isMobileDevice = device === DEVICE_TYPE.MOBILE;

  const backgroundImage = isMobileDevice
    ? `${API.uiAssets}shared/login_phone_bg.svg`
    : `${API.uiAssets}shared/login_web_bg.svg`;

  const postLoginNavigator = () => {
    const path = getLoginRedirectPath();
    navigate(path);
  };

  useEffect(() => {
    if (userInfo) {
      postLoginNavigator();
    }
  }, []);

  const submitLoginHandler = (values, { setSubmitting }) => {
    userLogin({ user: values })
      .then((res) => {
        const userObj = getUserData();
        if (res.dcs[0]?.id) {
          saveUserDCId(res.dcs[0]?.id || null);
        }
        saveUserData({ ...userObj, ...res });
        setSubmitting(false);
        postLoginNavigator();
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  if (userInfo) {
    return null;
  }

  const responseGoogle = (payload = {}) => {
    googleLogin({ id_token: payload.credential }).then((res) => {
      const userObj = getUserData();
      if (res.dcs[0]?.id) {
        saveUserDCId(res.dcs[0]?.id || null);
      }
      saveUserData({ ...userObj, ...res });
      postLoginNavigator();
    });
  };

  return (
    <LoginContainer>
      <BackgroundImage src={backgroundImage} alt="Background" />
      <Container maxWidth="sm">
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          gap={4}
          alignItems="center"
          zIndex={1}
        >
          <img
            src={`${API.uiAssets}nfi/logo_full.png`}
            alt="Vegrow Logo"
            style={{ width: '250px', height: 'auto' }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ textAlign: 'center' }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              component="span"
              color="primary"
              mr={1}
            >
              NFI
            </Typography>
            Login
          </Typography>
          {ENV !== 'production' && (
            <Formik
              initialValues={{ username: '', password: '' }}
              onSubmit={submitLoginHandler}
            >
              {({ handleSubmit, isSubmitting }) => (
                <LoginFormWrapper onSubmit={handleSubmit}>
                  <FieldInput
                    name="username"
                    label="Username"
                    placeholder="Username"
                    variant="outlined"
                    required
                    fullWidth
                    validate={validateRequired}
                    InputLabelProps={{
                      required: true,
                      shrink: true,
                    }}
                    inputProps={{
                      'data-cy': 'nfi.loginPage.userNameInputField',
                    }}
                    errorProps={{
                      'data-cy': `nfi.loginPage.userNameInputFieldError`,
                    }}
                  />
                  <FieldInput
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    variant="outlined"
                    fullWidth
                    required
                    validate={validateRequired}
                    autoComplete="off"
                    InputLabelProps={{
                      required: true,
                      shrink: true,
                    }}
                    inputProps={{
                      'data-cy': 'nfi.loginPage.passwordInputField',
                    }}
                    errorProps={{
                      'data-cy': `nfi.loginPage.passwordInputFieldError`,
                    }}
                  />
                  <AppButton
                    loading={isSubmitting}
                    type="submit"
                    onClick={handleSubmit}
                    data-cy="nfi.loginPage.loginButton"
                    fullWidth
                  >
                    Login
                  </AppButton>
                </LoginFormWrapper>
              )}
            </Formik>
          )}
          <GoogleLogin
            theme="filled_blue"
            size="large"
            shape="pill"
            onSuccess={responseGoogle}
            onError={responseGoogle}
            fullWidth
          />
        </Box>
      </Container>
    </LoginContainer>
  );
};

export default Login;
