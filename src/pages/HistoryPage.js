import styled from 'styled-components/macro'
import HistoryElement from '../components/HistoryElement'

export default function HistoryPage({ history }) {
  return (
    <Container>
      <List>
        {history.map(({ playlistName, playerName, date, score }) => (
          <HistoryElement
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
  padding: 10px;
`

const List = styled.ul`
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
`
