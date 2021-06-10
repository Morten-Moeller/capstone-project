import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'
import usePlayList from './hooks/usePlayList'

function App() {
  const [showAnswer, setShowAnswer] = useState(false)
  const { newUrl, answers, nextSong } = usePlayList(playlist)
  const { songUrl, toggle, stop, playing, duration } = useAudio()
  const [loaded, setLoaded] = useState(false)
  const [newAnswers, setNewAnswers] = useState(answers)

  useEffect(() => {
    answers && setLoaded(true)
  }, [answers])

  //set a new song
  useEffect(() => {
    !playing && songUrl(newUrl)
  }, [newUrl])

  useEffect(() => {
    setNewAnswers(answers)
  }, [playing])

  return (
    <Container>
      {loaded && (
        <PlayPage
          showAnswer={showAnswer}
          answers={newAnswers ? newAnswers : answers}
          onPlay={handlePlay}
          onAnswer={handleAnswer}
          playing={playing}
          duration={duration}
        />
      )}
    </Container>
  )

  function handleAnswer() {
    if (playing) {
      stop()
      setShowAnswer(true)
      nextSong()
    }

    return
  }

  function handlePlay() {
    !playing && toggle()
    if (showAnswer && !playing) {
      setShowAnswer(false)
    }
  }
}

const Container = styled.main`
  display: grid;
`

export default App
