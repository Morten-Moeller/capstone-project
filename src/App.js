// @ts-check
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlist from './data/playlist.json'
import usePlaylist from './hooks/usePlayList'
import StartPage from './pages/StartPage'

function App() {
  const playlists = [
    { id: '1', title: 'Classic Rock', playlistName: 'playlist' },
  ]
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  // usePlaylist takes a list of Objects including an iTunes trackId as id.
  // it checkes if the Id response valid and then retuns a random url from the list and matching random answers
  // with next song we can trigger to get another url
  const { getNextUrl, answers, innitiateNextSong, setPlaylist } = usePlaylist()

  // useAudio hold and controll the audio element
  const {
    setSongUrl,
    toggle,
    stop,
    isPlaying,
    duration,
    changeVolume,
  } = useAudio()

  const [newAnswers, setNewAnswers] = useState(answers)

  // //set a new song
  useEffect(() => {
    if (!isPlaying) {
      setSongUrl(getNextUrl)
    }
  }, [getNextUrl])

  //set new answers for the buttons
  useEffect(() => {
    setNewAnswers(answers)
  }, [isPlaying])

  return (
    <Container>
      <StartPage playlists={playlists} onClick={handlePlaylist} />
      {answers && (
        <PlayPage
          showAnswer={isAnswerVisible}
          answers={newAnswers || answers}
          onPlay={handlePlay}
          onAnswer={handleAnswer}
          isPlaying={isPlaying}
          duration={duration}
          onChange={handleVolume}
        />
      )}
    </Container>
  )

  function handlePlaylist(playlistName) {
    setPlaylist(playlistName)
  }

  function handleAnswer() {
    if (isPlaying) {
      stop()
      setIsAnswerVisible(true)
      innitiateNextSong()
    }
    return
  }

  function handlePlay() {
    if (!isPlaying) {
      toggle()
    }
    if (isAnswerVisible && !isPlaying) {
      setIsAnswerVisible(false)
    }
  }

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }
}

const Container = styled.main`
  display: grid;
`

export default App
