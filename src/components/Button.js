import styled from 'styled-components/macro'

const Button = styled.button`
  font-family: 'Iceland';
  border: none;
  padding: 3px 8px;
  border-radius: 3px;
  transition: all 0.1s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip ellipsis;
  text-overflow: '…';
  border-radius: 2rem;
  min-width: 300px;
  width: 80%;
  padding: 0.25rem;
  font-size: 1.75rem;
  transition: 0.5s;

  ${props => {
    if (props.green) {
      return `
    background-color: var(--color-right);
    color: var(--color-primary-background);
    box-shadow: var(--effect-neon-small-right);
    `
    } else if (props.red) {
      return `
    background-color: var(--color-wrong);
    color: var(--color-primary-background);
    box-shadow: var(--effect-neon-small-wrong);
    `
    } else if (props.active) {
      return `
    background-color: var(--color-opacity);
    color: var(--color-secondary);
    box-shadow: var(--effect-neon-small-active);
    `
    } else if (props.question) {
      return `
      background-color: var(--color-button-background);
    color: var(--color-primary);
    box-shadow: var(--effect-neon-small);
    `
    } else {
      return `
      background-color: var(--color-button-background);
    color: var(--color-button);
    opacity: 0.8;
    box-shadow: var(--effect-neon-small-button);
    `
    }
  }}
`

export default Button
