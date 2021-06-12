import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'
import usePlaylist from './hooks/usePlayList'

function App() {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  // usePlaylist takes a list of Objects including an iTunes trackId as id.
  // it checkes if the Id response valid and then retuns a random url from the list and matching random answers
  // with next song we can trigger to get another url
  const { getNextUrl, answers, innitiateNextSong } = usePlaylist(playlist)

  // useAudio hold and controll the audio element
  const { setSongUrl, toggle, stop, isPlaying, duration, volume } = useAudio()

  const [newAnswers, setNewAnswers] = useState(answers)

  // //set a new song
  useEffect(() => {
    !isPlaying && setSongUrl(getNextUrl)
  }, [getNextUrl])

  //set new answers for the buttons
  useEffect(() => {
    setNewAnswers(answers)
  }, [isPlaying])

  return (
    <Container>
      {answers && (
        <PlayPage
          showAnswer={isAnswerVisible}
          answers={newAnswers || answers}
          onPlay={handlePlay}
          onAnswer={handleAnswer}
          playing={isPlaying}
          duration={duration}
          onChange={changeVolume}
        />
      )}
    </Container>
  )

  function handleAnswer() {
    if (isPlaying) {
      stop()
      setIsAnswerVisible(true)
      innitiateNextSong()
    }
    return
  }

  function handlePlay() {
    !isPlaying && toggle()
    if (isAnswerVisible && !isPlaying) {
      setIsAnswerVisible(false)
    }
  }

  function changeVolume(event) {
    volume(event.target.value)
  }
}

const Container = styled.main`
  display: grid;
`

export default App
