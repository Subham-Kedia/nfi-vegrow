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
