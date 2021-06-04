import styled from 'styled-components'
import PlayPage from './pages/PlayPage'

function App() {
  const url =
    'https://audio-ssl.itunes.apple.com/itunes-assets/Music/12/f7/c9/mzm.hyfizvmg.aac.p.m4a'

  return (
    <Container>
      <PlayPage url={url} />
    </Container>
  )
}

const Container = styled.main`
  display: grid;
`

export default App
