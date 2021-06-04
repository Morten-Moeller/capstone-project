import styled from 'styled-components/macro'
import Button from '../components/Button'

export default function PlayPage() {
  return (
    <Container>
      <Button>&gt;</Button>
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
    display: flex;
    justify-content: center;
    align-items: center;
    justify-self: center;
    font-size: 3rem;
    width: 72px;
    height: 72px;
    padding-bottom: 7px;
  }
`
