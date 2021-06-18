import styled from 'styled-components/macro'
import HistoryElement from '../components/HistoryElement'

export default function HistoryPage({ history }) {
  return (
    <Container>
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
  padding: 2rem;
  height: 100vh;
  overflow-y: auto;
`

const List = styled.ul`
  display: grid;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
`
