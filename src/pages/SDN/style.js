import styled from 'styled-components';

export const SectionWrapper = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const LeftSectionWrapper = styled.section`
  width: 40%;
`;

export const RightSectionWrapper = styled.section`
  flex-grow: 1;
`;

export const SDNSummary = styled.summary`
  background-color: white;
  flex-grow: 1;
`;

export const NoDataScreen = styled.main`
  display: grid;
  place-items: center;
  height: 100%;
`;

export const ImageWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
`;
