import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
  }

  body {
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    background: #f3f3f4;
  }

  *::-webkit-scrollbar {
    width: 4px;
    height: 8px;
  }
 
  *::-webkit-scrollbar-track {
    background: #c4c4c4;
    border-radius: 3px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
 
  *::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  *::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
  }

  .hidden {
    display: none;
  }

  .margin-horizontal {
    margin: ${(props) => props.theme.spacing(0, 1)} !important;
  }

  .margin-vertical {
    margin: ${(props) => props.theme.spacing(1, 0)} !important;
  }
   .margin-bottom {
    margin: ${(props) => props.theme.spacing(0, 0, 1, 0)} !important;
  }

  .MuiTableCell-head {
    font-weight: bold;
  }
  .disabled {
    pointer-events: none;
  }
  .disabled-text, .disabled-text * {
    color: ${(props) => props.theme.palette.text.disabled} !important;
  }
  svg.disabled {
    color: ${(props) => props.theme.palette.text.disabled} !important;
    pointer-events: none;
    opacity: 0.5;
  }
  .default-color {
    color: #00000091;
  }
  .float-right {
    float: right;
  }
  .word-wrap {
    word-wrap: break-word
  }
  .no-padding {
    padding: 0 !important
  }
  .text-align-right {
    text-align: end;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .word-break{
    word-break: break-all;
  }
  .position-absolute {
    position: absolute;
  }

  .height100 {
    height: 100%;
  }
  .width100 {
    width: 100%;
  }
  .command-palette {
    z-index: 9999;
  }
`;

export default GlobalStyle;
