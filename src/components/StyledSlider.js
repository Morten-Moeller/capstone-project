import styled from 'styled-components/macro'

const StyledSlider = styled.input`
  margin-top: 1.25rem;
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }

  &::-moz-range-thumb {
    -webkit-appearance: none;
    border: 0.01rem solid var(--effect-neon-small-active);
    height: 2.5rem;
    width: 1rem;
    border-radius: 0.1rem;
    background: var(--color-secondary);
    cursor: pointer;
    margin-top: -1rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: var(
      --effect-neon-small-active
    ); /* Add cool effects to your sliders! */
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 0.01rem solid var(--effect-neon-small-active);
    height: 2.5rem;
    width: 1rem;
    border-radius: 0.1rem;
    background: var(--color-secondary);
    cursor: pointer;
    margin-top: -1rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: var(--effect-neon-small-active);
  }

  &::-ms-thumb {
    box-shadow: var(--effect-neon-small-active);
    border: 0.01rem solid var(--effect-neon-small-active);
    height: 2.5rem;
    width: 1rem;
    border-radius: 0.2rem;
    background: var(--color-secondary);
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.25rem;
    cursor: pointer;
    box-shadow: var(--effect-neon-small);
    background: var(--color-primary);
    border-radius: 0.1rem;
    border: 0.01rem solid var(--effect-neon-small);
  }

  &:focus::-webkit-slider-runnable-track {
    background: var(--color-primary);
  }

  &::-moz-range-track {
    width: 100%;
    height: 0.25rem;
    cursor: pointer;
    box-shadow: var(--effect-neon-small);
    background: var(--color-primary);
    border-radius: 0.01rem;
    border: 0.01rem solid var(--effect-neon-small);
  }

  &::-ms-track {
    width: 100%;
    height: 0.25rem;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 1rem 0;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: var(--color-primary);
    border: 0.01rem solid var(--effect-neon-small);
    border-radius: 0.25rem;
    box-shadow: var(--effect-neon-small);
  }
  &:focus::-ms-fill-lower {
    background: var(--color-primary);
  }
  &::-ms-fill-upper {
    background: var(--color-primary);
    border: 0.01rem solid var(--effect-neon-small);
    border-radius: 0.25rem;
    box-shadow: var(--effect-neon-small);
  }
  &:focus::-ms-fill-upper {
    background: var(--color-primary);
  }
`

export default StyledSlider
