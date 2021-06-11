import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

export default function Button({ children, onClick, ...props }) {
  return (
    <StyledButton onClick={onClick} {...props}>
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  border: none;
  padding: 3px 8px;
  border-radius: 3px;

  background-color: ${props =>
    props.wrong ? 'tomato' : props.right ? 'green' : 'lightgrey'};
`
