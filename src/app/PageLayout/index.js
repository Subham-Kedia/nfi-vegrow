import AppLoader from 'Components/ProgressLoader';

import PageFooter from './components/PageFooter';
import PageTitle from './components/PageTitle';
import { PageBody } from './styled';

const PageLayout = ({
  isLoading = false,
  children,
  showBackHandler,
  showSelectDC = false,
  isFilterChanged,
  showFilterHandler,
  title,
  titleHelper,
  titleComponent,
  otherInfo,
  dcFilterFn,
}) => {
  return (
    <>
      <PageTitle
        showSelectDC={showSelectDC}
        dcFilterFn={dcFilterFn}
        showBackHandler={showBackHandler}
        showFilterHandler={showFilterHandler}
        isFilterChanged={isFilterChanged}
        titleHelper={titleHelper}
        title={title}
        otherInfo={otherInfo}
      >
        {titleComponent}
      </PageTitle>
      {isLoading ? <AppLoader /> : children}
    </>
  );
};

PageLayout.Body = PageBody;
PageLayout.Footer = PageFooter;
export default PageLayout;
