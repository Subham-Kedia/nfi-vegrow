import styled from 'styled-components';

export const LeftSection = styled.div`
  display: flex;
  min-width: 300px;
  width: 40%;
  height: 100%;
  flex-direction: column;
  overflow: auto;
  margin-right: 4px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-self: center;
    width: 98%;
  }
`;

export const RightSection = styled.div`
  display: flex;
  flex: 1;
  min-width: 300px;
  height: 100%;
  flex-direction: column;
  overflow: auto;
`;

export const BomStatusPill = styled.div(({ enabled, theme }) => ({
  height: '8px',
  width: '8px',
  borderRadius: '100%',
  background: enabled ? theme.palette.colors.green : theme.palette.colors.red,
}));

export const BomStatusBox = styled.div(({ enabled, theme }) => ({
  padding: '0.2rem 0.6rem',
  borderRadius: 16,
  color: enabled ? theme.palette.colors.green : theme.palette.colors.red,
  background: enabled
    ? theme.palette.colors.bgGreen
    : theme.palette.colors.bgRed,
  fontWeight: 'bold',
  marginLeft: '0.6rem',
  fontSize: '12px',
}));
