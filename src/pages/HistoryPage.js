import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import styled from 'styled-components/macro'
import HistoryElement from '../components/HistoryElement'

export default function HistoryPage({ history }) {
  return (
    <Container>
      <Link to="/">&lt;-- start new</Link>
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
  padding-top: 0.5rem;
  padding: 0.5rem 1rem 0;
  height: 100vh;
  overflow-y: auto;
`

const List = styled.ul`
  display: grid;
  gap: 1.5rem;
  list-style: none;
  padding: 0 1rem 1rem;
`
