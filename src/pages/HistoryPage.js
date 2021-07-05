import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import styled from 'styled-components/macro'
import HistoryElement from '../components/HistoryElement'

export default function HistoryPage({ history }) {
  return (
    <Container>
      <StyledLink to="/">&lt;-- start new</StyledLink>
      <List>
        {history.map(({ playlistName, playerName, date, score, id }) => (
          <HistoryElement
            key={id}
            score={score}
            date={date}
            playerName={playerName}
            playlistName={playlistName}
          />
        ))}
      </List>
    </Container>
  )
}

const Container = styled.main`
  padding: 8px 16px 0;
  height: 100vh;
  overflow-y: auto;
`

const List = styled.ul`
  display: grid;
  gap: 1.5rem;
  list-style: none;
  padding: 0 16px 16px;
`
const StyledLink = styled(Link)`
  color: var(--color-secondary);
  text-shadow: var(--effect-neon-small-navigation);
`
