import styled from 'styled-components';

export const RightSection = styled.div`
  min-width: 300px;
  width: 25%;
  height: 100%;
  flex-direction: column;
  overflow: auto;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 0;
    min-width: 100%;
    overflow-x: hidden;
  }

`;
