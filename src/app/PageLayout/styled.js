import styled from 'styled-components';

export const PageBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: ${(props) => props.flexDirection || 'column'};
  height: 100%;
  overflow: auto;
  padding: ${(props) => props.theme.spacing(1)};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: ${(props) => props.theme.spacing(0.5)};
  }
`;
