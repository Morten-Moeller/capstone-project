import { createGlobalStyle } from 'styled-components'

import fasterOne from './FasterOne-Regular.ttf'
import iceland from './Iceland-Regular.ttf'

export default createGlobalStyle`
  @font-face {
    font-family: 'Faster One';
    src: url(${fasterOne}) format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: auto;
  }

  @font-face {
    font-family: 'Iceland';
    src: url(${iceland}) format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: auto;
  }
`
