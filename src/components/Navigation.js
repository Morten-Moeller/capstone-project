import styled from 'styled-components/macro'
import { NavLink, Route } from 'react-router-dom'

export default function Navigation() {
  return (
    <Nav>
      <NavLink to="/">&lt;-- back</NavLink>
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
`
