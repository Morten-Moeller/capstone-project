// @ts-check
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Navigation from './components/Navigation'
import playlists from './data/playlists.json'
import useAudio from './hooks/useAudio'
import usePlaylist from './hooks/usePlayList'
import PlayPage from './pages/PlayPage'
import StartPage from './pages/StartPage'

function App() {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const defaultAnswers = [
    { title: 'Button A', right: true, id: 1 },
    { title: 'Button B', wrong: true, id: 2 },
    { title: 'Button C', wrong: true, id: 3 },
  ]

  const {
    getNextUrl,
    answers,
    initiateNextSong,
    setNewPlaylist,
    isLoaded,
  } = usePlaylist(null)

  const {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
    getCurrentTime,
  } = useAudio()

  const [newAnswers, setNewAnswers] = useState(null)

  const { push } = useHistory()

  useEffect(() => {
    setNewSong(getNextUrl)
  }, [getNextUrl])

  //set new answers for the buttons
  useEffect(() => {
    if (isPlaying) {
      setNewAnswers(answers)
    }
  }, [isPlaying])

  return (
    <Container>
      <Route path="/playpage">
        <Navigation onBack={handleBack} />
      </Route>
      <Switch>
        <Route exact path="/">
          <StartPage
            playlists={playlists}
            onMark={handleMark}
            onGame={handleGame}
            selectedPlaylist={selectedPlaylist}
          />
        </Route>
        <Route path="/playpage">
          {answers && (
            <PlayPage
              showAnswer={isAnswerVisible}
              answers={newAnswers || answers}
              onPlay={handlePlay}
              onAnswer={handleAnswer}
              isPlaying={isPlaying}
              duration={duration}
              onChange={handleVolume}
              isLoaded={isLoaded}
              getCurrentTime={getCurrentTime}
            />
          )}
        </Route>
      </Switch>
    </Container>
  )

  function handleBack() {
    setNewAnswers(defaultAnswers)
    setIsAnswerVisible(false)
    stopAudio()
  }

  function handleGame() {
    setNewPlaylist(selectedPlaylist.songs)
    push('/playpage')
  }

  function handleMark(selectedPlaylistName) {
    const index = playlists.findIndex(
      ({ playlistName }) => playlistName === selectedPlaylistName.playlistName
    )
    setSelectedPlaylist(playlists[index])
  }

  function handleAnswer() {
    if (isPlaying) {
      stopAudio()
      setIsAnswerVisible(true)
      initiateNextSong()
    }
    return
  }

  function handlePlay() {
    if (!isPlaying) {
      toggleAudio()
    }
    if (isAnswerVisible && !isPlaying) {
      setIsAnswerVisible(false)
    }
  }

  function setNewSong(url) {
    if (!isPlaying) {
      setSongUrl(url)
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
