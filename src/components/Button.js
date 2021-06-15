import styled from 'styled-components/macro'

const Button = styled.button`
  border: none;
  padding: 3px 8px;
  border-radius: 3px;
  transition: all 0.1s ease-in-out;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip ellipsis;
  text-overflow: '…';

  background-color: ${props =>
    props.wrong ? 'tomato' : props.right ? 'green' : 'lightgrey'};
`

export default Button
