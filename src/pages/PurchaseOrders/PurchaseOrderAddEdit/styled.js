import { IconButton } from '@mui/material';
import SnackbarContent from '@mui/material/SnackbarContent';
import { FieldInput } from 'Components/FormFields';
import styled from 'styled-components';
import { LibraryGrid } from 'vg-library/core';

export const Banner = styled(SnackbarContent)`
  position: absolute;
  background: #000;
  color: #fff;
  opacity: 0.8;
  z-index: 9;
  width: 98%;
`;

export const ImageListWrapper = styled.div`
  display: flex;
  padding-bottom: ${(props) => props.theme.spacing(0.5)};
  overflow-x: auto;

  span {
    position: relative;
    display: flex;
    margin-right: ${(props) => props.theme.spacing(1)};
    padding: ${(props) => props.theme.spacing(1)};
    background: #fff;
    border-radius: 4px;

    img {
      width: 100px;
    }

    .cancel-icon {
      position: absolute;
      top: 1px;
      right: -2px;
    }

    .pdf-icon {
      font-size: ${(props) => props.theme.typography.h2.fontSize};
    }
  }
`;

export const ConversionRate = styled(FieldInput)`
  width: 4.625rem;
  margin-left: 0.125rem;
  margin-right: 0%.125rem;
`;

export const ConversionRateWrapper = styled(LibraryGrid).withConfig({
  shouldForwardProp: (prop) => prop !== 'showInput',
})`
  align-items: center;
  visibility: ${(props) => (props.showInput ? 'visible' : 'hidden')};
`;

export const StyledIconButton = styled(IconButton)`
  padding: 0;
`;
