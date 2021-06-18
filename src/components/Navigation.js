import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import PropType from 'prop-types'

Navigation.propTypes = {
  onBack: PropType.func,
  page: PropType.string,
}

export default function Navigation(props) {
  const { onBack, page } = props
  return (
    <Nav {...props}>
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
  flex-direction: row-reverse;
  flex-direction: ${props =>
    props.page === 'start' ? 'row-reverse;' : 'row;'};
  padding: 0.25rem;
  height: 1.5rem;
  position: sticky;
  top: 0;
  left: 0;
  background-color: transparent;
  text-shadow: var(--effect-neon-small);
  a {
    text-decoration: none;
  }
`
