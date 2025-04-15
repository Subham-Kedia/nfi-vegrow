import styled from 'styled-components';

export const ShipmentWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.palette.divider};
  border-radius: ${(props) => props.theme.shape.borderRadius};
  padding: ${(props) => props.theme.spacing(0.5)};
  box-shadow: ${(props) => props.theme.shadows[3]};
  display: flex;
  flex-direction: column;
  margin-bottom: 2%;

  .shipment-table {
    td {
      padding: ${(props) => props.theme.spacing(0.4)};
    }
  }
`;

export const ShipmentHeading = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;
