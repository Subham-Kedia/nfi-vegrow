import { InputAdornment, Link } from '@mui/material';
import { FieldInput } from 'Components/FormFields';
import { FieldArray, useFormikContext } from 'formik';
import { validateMax } from 'Utilities/formvalidation';
import { LibraryGrid, LibraryText } from 'vg-library/core';

const AdvanceAdjustment = ({
  poId,
  getAdvancePaymentNotAdjusted,
  remainingVendorAmount,
  calculateTotalPaymentAfterAdjustments,
}) => {
  // TODO: Subhankur, copied this from parent  component to make it reuseable and removed from parent
  // Previous code, need to clean the inline styles and optional chaining as well
  const { values } = useFormikContext();
  return (
    <>
      {values?.advance_amount_adjustments.length > 0 && (
        <>
          <LibraryText
            variant="subtitle1"
            style={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginLeft: '1rem',
            }}
          >
            Adjustments
          </LibraryText>
          <FieldArray
            name="advance_amount_adjustments"
            render={() =>
              values.advance_amount_adjustments.map((advance, index) => {
                return (
                  <LibraryGrid
                    container
                    alignItems="center"
                    key={index}
                    style={{ marginTop: '1rem' }}
                  >
                    <LibraryGrid item md={2} xs={12}>
                      <LibraryText variant="body1">
                        from PR {advance?.from_payment_request_id}
                      </LibraryText>
                    </LibraryGrid>
                    <LibraryGrid item md={2} xs={12}>
                      <FieldInput
                        name={`advance_amount_adjustments.${index}.amount`}
                        size="small"
                        type="number"
                        label=""
                        placeholder="Advance"
                        variant="outlined"
                        style={{ width: '14rem' }}
                        validate={validateMax(advance.total_adjustment_amount)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <LibraryText style={{ color: 'grey' }}>
                                /{advance.total_adjustment_amount}
                              </LibraryText>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </LibraryGrid>
                  </LibraryGrid>
                );
              })
            }
          />
        </>
      )}
      <Link
        component="button"
        variant="subtitle1"
        style={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
          marginTop: '1rem',
        }}
        onClick={getAdvancePaymentNotAdjusted}
      >
        Pay from previous advances ₹ {remainingVendorAmount}
      </Link>
      {values?.vendor_advance_adjustments?.length > 0 && (
        <>
          <LibraryText
            variant="subtitle1"
            style={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginLeft: '1rem',
              marginTop: '1rem',
            }}
          >
            Adjustments from other PO
          </LibraryText>
          <FieldArray
            name="vendor_advance_adjustments"
            render={() =>
              values.vendor_advance_adjustments.map((advance, index) => {
                return (
                  <LibraryGrid
                    container
                    alignItems="center"
                    key={index}
                    style={{ marginTop: '1rem' }}
                  >
                    <LibraryGrid item md={2} xs={12}>
                      <LibraryText variant="body1">
                        from
                        {poId !== advance?.nfi_purchase_order_id && (
                          <> PO {advance?.nfi_purchase_order_id} - </>
                        )}
                        PR {advance?.from_payment_request_id}
                      </LibraryText>
                    </LibraryGrid>
                    <LibraryGrid item md={2} xs={12}>
                      <FieldInput
                        name={`vendor_advance_adjustments.${index}.amount`}
                        size="small"
                        type="number"
                        placeholder="Advance"
                        variant="outlined"
                        style={{ width: '14rem' }}
                        validate={validateMax(advance.total_adjustment_amount)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <LibraryText style={{ color: 'grey' }}>
                                /{advance.total_adjustment_amount}
                              </LibraryText>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </LibraryGrid>
                  </LibraryGrid>
                );
              })
            }
          />
        </>
      )}
      <LibraryGrid container style={{ margin: '2rem 0' }}>
        <LibraryGrid item md={3} xs={12}>
          <LibraryText
            variant="h6"
            style={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            To be Paid (After Adjustments)
          </LibraryText>
        </LibraryGrid>
        <LibraryGrid item md={3} xs={12}>
          <LibraryText
            variant="h6"
            color="primary"
            style={{
              fontWeight: 'bold',
            }}
          >
            ₹ {calculateTotalPaymentAfterAdjustments(values)}
          </LibraryText>
        </LibraryGrid>
      </LibraryGrid>
    </>
  );
};

export default AdvanceAdjustment;
