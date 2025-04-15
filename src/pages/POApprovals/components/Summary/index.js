import { toFixedNumber } from 'Utilities';
import { LibraryGrid, LibraryText } from 'vg-library/core';

const Summary = ({ data }) => {
  return (
    <LibraryGrid p={1} container justifyContent="flex-end">
      <LibraryGrid item md={4}>
        <LibraryGrid container>
          <LibraryGrid item md={6}>
            <LibraryText fontWeight="fontWeightBold" mb={1}>
              Taxable Amount:
            </LibraryText>
            <LibraryText fontWeight="fontWeightBold" mb={1}>
              GST:
            </LibraryText>
            <LibraryText fontWeight="fontWeightBold" mb={1}>
              Total:
            </LibraryText>
          </LibraryGrid>
          <LibraryGrid item md={6}>
            <LibraryText mb={1} data-cy="nfi.poApprover.taxabaleAmount">
              {data.taxableAmount}
            </LibraryText>
            <LibraryText mb={1} data-cy="nfi.poApprover.gst">
              {toFixedNumber(data.gst)}
            </LibraryText>
            <LibraryText mb={1} data-cy="nfi.poApprover.total">
              {toFixedNumber(data.totalAmount)}
            </LibraryText>
          </LibraryGrid>
        </LibraryGrid>
      </LibraryGrid>
    </LibraryGrid>
  );
};

export default Summary;
