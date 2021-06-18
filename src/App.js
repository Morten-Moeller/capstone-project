// @ts-check
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import Navigation from './components/Navigation'
import playlists from './data/playlists.json'
import useAudio from './hooks/useAudio'
import useLocalStorage from './hooks/useLocalStorage'
import usePlaylist from './hooks/usePlayList'
import HistoryPage from './pages/HistoryPage'
import PlayPage from './pages/PlayPage'
import StartPage from './pages/StartPage'
import calcPoints from './services/calcPoints'
import defaultAnswers from './services/defaultAnswers'
import GlobalFonts from './fonts/fonts'
import bgImage from './assets/placeholder.jpg'

function App() {
  const [localStorage, setLocalStorage] = useLocalStorage('history', [])

  // custom hooks
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const {
    getNextUrl,
    answers,
    initiateNextSong,
    setNewPlaylist,
    isLoaded,
    counter,
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

  // states
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [newAnswers, setNewAnswers] = useState(null)
  const [playerData, setPlayerData] = useState({ score: 0, playerName: '' })
  const [historyEntrys, setHistoryEntrys] = useState(localStorage)

  // side effects
  useEffect(() => {
    setLocalStorage(historyEntrys)
  }, [historyEntrys, setLocalStorage])

  const { push } = useHistory()

  useEffect(() => {
    setNewSong(getNextUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNextUrl])

  useEffect(() => {
    if (isPlaying) {
      setNewAnswers(answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  return (
    <Container>
      <GlobalFonts />
      <Switch>
        <Route exact path="/">
          <Navigation page={'start'} />
          <StartPage
            playlists={playlists}
            onMark={handleMark}
            onGame={handleGame}
            selectedPlaylist={selectedPlaylist}
            onInputChange={handleNameInput}
            playerData={playerData}
          />
        </Route>
        <Route path="/playpage">
          <Navigation page={'playpage'} onBack={handleBack} />
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
              playerData={playerData}
              counter={counter}
              onEndGame={handleEndGame}
            />
          )}
        </Route>
        <Route path="/history">
          <Navigation page={'history'} onBack={handleBack} />
          <HistoryPage history={historyEntrys} />
        </Route>
      </Switch>
    </Container>
  )

  function handleEndGame() {
    const date = Date.now()
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const newHistoryEntry = {
      id: uuidv4(),
      playerName: playerData.playerName,
      date: dateFormat.format(date),
      playlistName: selectedPlaylist.title,
      score: playerData.score,
    }
    setHistoryEntrys([...historyEntrys, newHistoryEntry])
    push('/history')
  }

  function handleNameInput(event) {
    const input = event.target
    setPlayerData({ ...playerData, playerName: input.value })
  }

  function handleBack() {
    setNewAnswers(defaultAnswers)
    setIsAnswerVisible(false)
    stopAudio()
    setPlayerData({ ...playerData, score: 0 })
    setNewPlaylist(null)
  }

  function handleGame() {
    if (selectedPlaylist) {
      setNewPlaylist(selectedPlaylist.songs)
      push('/playpage')
    }
  }

  function handleMark(selectedPlaylistName) {
    const index = playlists.findIndex(
      ({ playlistName }) => playlistName === selectedPlaylistName.playlistName
    )
    setSelectedPlaylist(playlists[index])
  }

  function handleAnswer(isRight) {
    if (isRight && !isAnswerVisible && isPlaying) {
      const points = calcPoints(getCurrentTime())
      setPlayerData({ ...playerData, score: playerData.score + points })
    }
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
  height: 100vh;
  display: grid;
  background: center / cover no-repeat url(${bgImage});
`

export default App
