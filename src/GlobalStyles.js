//@ts-check
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
}

:root {
    --primary-background-color: white;
    --secondary-background-color: hotpink;
    --active-background-color: skyblue;
    --primary-color: black;


}

body {
    font-family: sans-serif;
    letter-spacing: 0.02rem;
    font-size: 112.5%;
    margin: 0;
}
`

export default GlobalStyle
