//@ts-check
import styled from 'styled-components/macro'
import Heading from '../components/Headline'

export default function StartPage({ playlists, onClick }) {
  return (
    <Container>
      <Heading>Juke Quest</Heading>
      <List>
        {playlists.map(({ id, title, playlistName }) => (
          <li key={id} onClick={() => onClick({ playlistName })}>
            {title}
          </li>
        ))}
      </List>
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

  li {
    background-color: var(--secondary-background-color);
    border-radius: 0.15rem;
    padding: 0.15rem 0.2rem;
    cursor: pointer;
  }
`
