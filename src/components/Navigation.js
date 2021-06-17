import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import PropType from 'prop-types'

Navigation.propTypes = {
  onBack: PropType.func,
}

export default function Navigation({ onBack, page }) {
  return (
    <Nav>
      {(page === 'playpage' || page === 'history') && (
        <Link to="/" onClick={onBack}>
          &lt;-- start new
        </Link>
      )}
      {page === 'start' && <Link to="/history">history</Link>}
    </Nav>
  )
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  height: 1.5rem;
`
