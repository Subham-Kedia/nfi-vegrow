import Paper from '@mui/material/Paper';
import styled, { css } from 'styled-components';

export const PageTitleWrapper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props) => props.theme.spacing(1.5, 2)};

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: ${(props) => props.theme.spacing(1.5, 1)};
  }
  & > svg {
    align-self: flex-start;
    margin: ${(props) => props.theme.spacing(0, 0, 0, 1.5)};

    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: ${(props) => props.theme.spacing(0.5)};
    }
  }
`;

export const FilterButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: ${(props) => props.theme.spacing(0.5)};
  cursor: pointer;

  &::after {
    ${(props) =>
      props.active &&
      css`
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        width: 6px;
        height: 6px;
        background: ${props.theme.palette.secondary.main};
        border-radius: 50%;
        content: '';
      `};
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  h2 {
    margin-right: ${(props) => props.theme.spacing(2)};
  }
`;

export const ArrowWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: ${(props) => props.theme.spacing(0, 1.5, 0, 0.5)};
  background: #eee;
  border-radius: 50%;
  cursor: pointer;
`;

export const LeftSection = styled.div`
  display: flex;
  flex: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

export const RightSection = styled.div``;

export const OtherInfoWrapper = styled.section`
  flex-grow: 1;
  text-align: center;
`;
