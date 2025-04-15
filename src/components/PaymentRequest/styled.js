import styled from 'styled-components';

export const ShipmentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.palette.divider};
  border-radius: ${(props) => props.theme.shape.borderRadius};
  padding: ${(props) => props.theme.spacing(0.5)};
  box-shadow: ${(props) => props.theme.shadows[3]};
  margin-bottom: 1rem;

  input {
    padding: 6px;
  }
  .shipment-table {
    td {
      padding: ${(props) => props.theme.spacing(0.4)};
    }
    .other {
      background: #1ab3943b;
    }
  }
`;
