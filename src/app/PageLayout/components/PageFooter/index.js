import React from 'react';

import { LeftSection, RightSection, PageFooterWrapper } from './styled';

const PageFooter = ({ leftChildren, children }) => {
  return (
    <PageFooterWrapper elevation={0}>
      <LeftSection>{leftChildren}</LeftSection>
      <RightSection>{children}</RightSection>
    </PageFooterWrapper>
  );
};

export default PageFooter;
