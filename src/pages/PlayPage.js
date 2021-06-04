import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'

export default function PlayPage({ url }) {
  return (
    <Container>
      <PlayButton url={url}>&gt;</PlayButton>
      <Button>Bulls on Parade</Button>
      <Button>Last Resort</Button>
      <Button>People of the Sun</Button>
    </Container>
  )
}

const Container = styled.main`
  height: 100vh;
  display: grid;
  align-items: center;
  grid-template-rows: 5fr 1fr 1fr 1fr;
  padding: 16px;

  button {
    height: 48px;
    font-size: 1.25rem;
  }

  button:first-child {
  }
`
