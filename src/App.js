// @ts-check
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useAudio from './hooks/useAudio'
import PlayPage from './pages/PlayPage'
import playlists from './data/playlists.json'
import usePlaylist from './hooks/usePlayList'
import StartPage from './pages/StartPage'
import { Switch, Route } from 'react-router-dom'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Navigation from './components/Navigation'

function App() {
  const playlistsCopy = [...playlists]
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const defaultAnswers = [
    { title: 'Button A', right: true, id: 1 },
    { title: 'Button B', wrong: true, id: 2 },
    { title: 'Button C', wrong: true, id: 3 },
  ]
  // usePlaylist takes a list of Objects including an iTunes trackId as id.
  // it checkes if the Id response valid and then retuns a random url from the list and matching random answers
  // with next song we can trigger to get another url
  const {
    getNextUrl,
    answers,
    innitiateNextSong,
    setPlaylist,
    isLoaded,
  } = usePlaylist(null)

  // useAudio hold and controll the audio element
  const {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
  } = useAudio()

  const [newAnswers, setNewAnswers] = useState(null)

  const { push } = useHistory()

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
            />
          )}
        </Route>
      </Switch>
    </Container>
  )

  function handleBack() {
    setNewAnswers(defaultAnswers)
    stopAudio()
  }

  function handleGame() {
    setPlaylist(selectedPlaylist.songs)
    push('/playpage')
  }

  function handleMark(selectedPlaylistName) {
    const index = playlistsCopy.findIndex(
      ({ playlistName }) => playlistName === selectedPlaylistName.playlistName
    )
    setSelectedPlaylist(playlistsCopy[index])
  }

  function handleAnswer() {
    if (isPlaying) {
      stopAudio()
      setIsAnswerVisible(true)
      innitiateNextSong()
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

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }
}

const Container = styled.main`
  display: grid;
`

export default App
