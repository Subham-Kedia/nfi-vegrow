import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { logError } from 'Utilities/sendError';

import AppButton from '../AppButton';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorInfo: '', hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo });
    this.setState({ hasError: true, errorInfo });

    logError(error, errorInfo);
  }

  render() {
    const { hasError, errorInfo } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Paper style={{ padding: '16px' }}>
          <div className="card-header">
            <Typography variant="h5">Oops!!! Something went wrong</Typography>
            <Typography variant="body2">
              We have submitted error to support team.
            </Typography>

            <AppButton
              size="medium"
              variant="text"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload this page
            </AppButton>
          </div>

          <div className="card-body">
            <details className="error-details">
              <summary>Click for error details</summary>
              {errorInfo && errorInfo.componentStack.toString()}
            </details>
          </div>
        </Paper>
      );
    }
    return children;
  }
}

export default ErrorBoundary;
