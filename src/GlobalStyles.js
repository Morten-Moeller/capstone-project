import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
}

body {
    font-family: sans-serif;
    letter-spacing: 0.02rem;
    font-size: 112.5%;
}
`

export default GlobalStyle
