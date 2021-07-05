//@ts-check
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`

* {
    box-sizing: border-box;
}

:root {
    --color-primary-background: #1E043C;
    --color-primary: #ED67BF;
    --color-primary-neon: #FFE8F7;
    --color-secondary: #0EEEED;
    --color-secondary-neon: #e8fcff;
    --color-wrong: #F4193BBB;
    --color-wrong-neon: #ffe8ef;
    --color-right: #04EBADBB;
    --color-right-neon: #e8fff7;

    --transition: cubic-bezier(0, 2.5, 0, -0.5) 1s;

    --effect-neon-small:  0 0 0.1rem var(--color-primary-neon),
                    0 0 0.25rem var(--color-primary-neon),
                    0 0 0.5rem var(--color-primary),
                    0 0 0.75rem var(--color-primary),
                    0 0 1rem var(--color-primary);

    --effect-neon-small-active:  0 0 0.1rem var(--color-secondary-neon),
                    0 0 0.25rem var(--color-secondary-neon),
                    0 0 0.5rem var(--color-secondary),
                    0 0 0.75rem var(--color-secondary),
                    0 0 1rem var(--color-secondary);

    --effect-neon-small-wrong:  0 0 0.1rem var(--color-wrong-neon),
                    0 0 0.25rem var(--color-wrong-neon),
                    0 0 0.5rem var(--color-wrong),
                    0 0 0.75rem var(--color-wrong),
                    0 0 1rem var(--color-wrong);

    --effect-neon-small-right:  0 0 0.1rem var(--color-right-neon),
                    0 0 0.25rem var(--color-right-neon),
                    0 0 0.5rem var(--color-right),
                    0 0 0.75rem var(--color-right),
                    0 0 1rem var(--color-right);

    --effect-neon-small-navigation:  0 0 0.1rem var(--color-secondary-neon),
                    0 0 0.15rem var(--color-secondary-neon),
                    0 0 0.5rem var(--color-secondary),
                    0 0 0.75rem var(--color-secondary),
                    0 0 1rem var(--color-secondary);

                    --effect-neon-small-button:  0 0 0.1rem var(--color-button-neon),
                    0 0 0.15rem var(--color-button-neon),
                    0 0 0.5rem var(--color-button),
                    0 0 0.75rem var(--color-button),
                    0 0 1rem var(--color-button),
                    0 0 1.5rem var(--color-button),
                    0 0 2rem var(--color-button);

    --color-opacity: rgba(0, 0, 0, 0.6);

    --color-button-background: rgba(0, 0, 0, 0.6);
    --color-button: #ffcc00;
    --color-button-neon: #ffedbd;



}

body {
    font-family: Iceland , sans-serif;
    letter-spacing: 0.02rem;
    font-size: 150%;
    margin: 0;
    color: var(--color-primary);
    background-color: var(--color-primary-background);
}
`

export default GlobalStyle
