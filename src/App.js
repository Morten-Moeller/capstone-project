import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'
import usePlaylist from './hooks/usePlayList'

function App() {
  const [showAnswer, setShowAnswer] = useState(false)

  // usePlaylist takes a list of Objects including an iTunes trackId as id.
  // it checkes if the Id response valid and then retuns a random url from the list and matching random answers
  // with next song we can trigger to get another url
  const { newUrl, answers, nextSong } = usePlaylist(playlist)

  // useAudio hold and controll the audio element
  const { songUrl, toggle, stop, playing, duration } = useAudio()

  const [loaded, setLoaded] = useState(false)
  const [newAnswers, setNewAnswers] = useState(answers)

  //Checks if necessary data are loaded
  useEffect(() => {
    answers && setLoaded(true)
  }, [answers])

  // //set a new song
  useEffect(() => {
    !playing && songUrl(newUrl)
  }, [newUrl])

  //set new answers for the buttons
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
