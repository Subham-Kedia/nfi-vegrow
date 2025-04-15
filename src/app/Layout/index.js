import React, { useState } from 'react';
import ErrorBoundary from 'Components/ErrorBoundary';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AppWrapper, MainContentWrapper, SiteWrapper } from './styled';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SiteWrapper>
      <Header toggleSidebar={toggleSidebar} />
      <AppWrapper>
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <MainContentWrapper>
          <ErrorBoundary>{children}</ErrorBoundary>
        </MainContentWrapper>
      </AppWrapper>
    </SiteWrapper>
  );
};

export const SiteLayout = SiteWrapper;

export default AppLayout;
