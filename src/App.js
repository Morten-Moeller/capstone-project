import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'

function App() {
  const [newUrl, setNewUrl] = useState(null)
  const [songId, setSongId] = useState('1449299027')
  const baseUrl = 'https://itunes.apple.com/lookup?id='

  useEffect(() => {
    fetch(baseUrl + songId)
      .then(res => res.json())
      .then(data => setNewUrl(data.results[0].previewUrl))
      .catch(error => console.error(error))
  }, [songId])

  const url =
    'https://audio-ssl.itunes.apple.com/itunes-assets/Music/12/f7/c9/mzm.hyfizvmg.aac.p.m4a'

  const { songUrl, toggle, stop, playing, duration } = useAudio(url)
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
      songUrl(newUrl)
      setShowAnswer(false)
      setSongId(playlist[Math.floor(Math.random() * playlist.length)].id)
    }
  }
}

const Container = styled.main`
  display: grid;
`

export default App
