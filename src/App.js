import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'

function App() {
  const [newUrl, setNewUrl] = useState(null)
  const [songId, setSongId] = useState('1449299027')
  const [rightAnswer, setRightAnswer] = useState()
  const [wrongAnswers, setWrongAnswers] = useState([
    { title: 'Angel Eyes' },
    { title: 'Backstreets' },
  ])
  const [answers, setAnswers] = useState([
    { title: 'Button A', right: true },
    { title: 'Button B', wrong: true },
    { title: 'Button C', wrong: true },
  ])

  useEffect(() => {
    const baseUrl = 'https://itunes.apple.com/lookup?id='
    fetch(baseUrl + songId)
      .then(res => res.json())
      .then(data => {
        setNewUrl(data.results[0].previewUrl)
        setRightAnswer({ title: data.results[0].trackName, right: true })
      })
      .catch(error => console.error(error))
  }, [songId])

  useEffect(() => {
    songUrl(newUrl)
  }, [newUrl])

  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    if (rightAnswer && !showAnswer) {
      const answer = [
        { title: wrongAnswers[0].title, wrong: true },
        { title: rightAnswer.title, right: true },
        { title: wrongAnswers[1].title, wrong: true },
      ]
      setAnswers(shuffle(answer))
    }
  }, [rightAnswer, wrongAnswers, showAnswer])

  const { songUrl, toggle, stop, playing, duration } = useAudio()

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
    setSongId(playlist[Math.floor(Math.random() * playlist.length)].id)
    return
  }

  function handlePlay() {
    !playing && toggle()
    if (showAnswer) {
      setShowAnswer(false)
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

const Container = styled.main`
  display: grid;
`

export default App
