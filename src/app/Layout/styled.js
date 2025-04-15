import styled from 'styled-components';

export const SiteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  height: 100%;
  overflow-x: auto;
`;

export const AppWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
`;

export const MainContentWrapper = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  height: 100%;
`;
