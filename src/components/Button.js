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
  width: 80%;
  padding: 0.5rem;
  font-size: 1.25rem;
  transition: 0.5s;

  ${props => {
    if (props.right) {
      return `
    background-color: var(--color-right);
    color: var(--color-primary-background);
    opacity: 0.8;
    box-shadow: var(--effect-neon-small-right);
    `
    } else if (props.wrong) {
      return `
    background-color: var(--color-wrong);
    color: var(--color-primary-background);
    opacity: 0.8;
    box-shadow: var(--effect-neon-small-wrong);
    `
    } else {
      return `
      background-color: var(--color-opacity);
    color: var(--color-primary);
    opacity: 0.8;
    box-shadow: var(--effect-neon-small);
    `
    }
  }}
`

export default Button
