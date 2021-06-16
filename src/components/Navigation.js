import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

export default function Navigation({ onBack }) {
  return (
    <Nav>
      <Link to="/" onClick={onBack}>
        &lt;-- back
      </Link>
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  height: 1.5rem;
`
