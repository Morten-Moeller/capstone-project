import { useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'

function App() {
  const url =
    'https://audio-ssl.itunes.apple.com/itunes-assets/Music/12/f7/c9/mzm.hyfizvmg.aac.p.m4a'

  const urlLong =
    'https://api.freeplaymusic.com/media/downloadable/files/link_samples/media/volume/edits/Soundtrack_Rock_Volume_5/e/a/eastbound_60.mp3'
  const { songUrl, toggle, stop, playing, duration } = useAudio(urlLong)
  const [answers, setAnswers] = useState([
    { title: 'Bulls on Parade', right: true },
    { title: 'Bomb Track', wrong: true },
    { title: 'People of the Sun', wrong: true },
  ])
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Container>
      <PlayPage
        showAnswer={showAnswer}
        answers={answers}
        onPlay={handlePlay}
        onAnswer={handleAnswer}
        playing={playing}
        duration={duration}
      />
    </Container>
  )

  function handleAnswer() {
    if (playing) {
      stop()
      setShowAnswer(true)
    }
    return
  }

  function handlePlay() {
    !playing && toggle()
    if (showAnswer) {
      songUrl(url)
      setShowAnswer(false)
    }
  }
}

const Container = styled.main`
  display: grid;
`

export default App
