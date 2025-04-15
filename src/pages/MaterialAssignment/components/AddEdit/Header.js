import { CustomerSelection, DCSelection, VendorSelection } from 'Components';
import { DC_TYPE } from 'Utilities/constants';
import { getFormattedDate } from 'Utilities/dateUtils';
import { LibraryGrid, LibraryText } from 'vg-library/core';

const Header = ({
  showVendors,
  showCustomers,
  disableHeader,
  disableVendors,
  disableCustomer,
  showSource,
  sourceLabel,
  banner,
}) => {
  return (
    <header>
      {banner}
      <LibraryGrid
        container
        display="flex"
        alignItems="baseline"
        mb={5}
        spacing={2}
        mt={1.5}
      >
        {showVendors && (
          <LibraryGrid item md={2} xs={4}>
            <VendorSelection
              name="vendor"
              disabled={disableHeader || disableVendors}
            />
          </LibraryGrid>
        )}
        {showCustomers && (
          <LibraryGrid item md={2} xs={4}>
            <CustomerSelection
              name="customer"
              disabled={disableHeader || disableCustomer}
            />
          </LibraryGrid>
        )}
        <LibraryGrid item md={2} xs={4}>
          {showSource && (
            <DCSelection
              name="source"
              label={sourceLabel}
              placeholder={`Select ${sourceLabel}`}
              disabled={disableHeader}
              filterBy={Object.values(DC_TYPE)}
            />
          )}
        </LibraryGrid>
        <LibraryGrid item md={8} xs={4} textAlign="end">
          <LibraryText>
            Created Date: {getFormattedDate(new Date())}
          </LibraryText>
        </LibraryGrid>
      </LibraryGrid>
    </header>
  );
};

export default Header;
