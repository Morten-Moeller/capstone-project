//@ts-check
import styled from 'styled-components/macro'
import Button from '../components/Button'
import Heading from '../components/Headline'

export default function StartPage({ playlists, onGame, onMark }) {
  return (
    <Container>
      <Heading>Juke Quest</Heading>
      <List>
        {playlists.map(({ id, title, playlistName }) => (
          <li key={id} onClick={() => onMark({ playlistName })}>
            {title}
          </li>
        ))}
      </List>
      <Button onClick={onGame}>Play</Button>
    </Container>
  )
}

const Container = styled.main`
  display: grid;
  justify-items: center;
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;

  li {
    background-color: var(--secondary-background-color);
    border-radius: 0.15rem;
    padding: 0.15rem 0.2rem;
    cursor: pointer;
  }
`
