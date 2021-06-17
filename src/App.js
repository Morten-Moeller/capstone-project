// @ts-check
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import styled from 'styled-components'
import Navigation from './components/Navigation'
import playlists from './data/playlists.json'
import useAudio from './hooks/useAudio'
import usePlaylist from './hooks/usePlayList'
import PlayPage from './pages/PlayPage'
import StartPage from './pages/StartPage'
import calcPoints from './services/calcPoints'
import HistoryPage from './pages/HistoryPage'

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

  const [newAnswers, setNewAnswers] = useState(null)
  let playlistName
  const [playerData, setPlayerData] = useState({ score: 0, playerName: '' })
  const [historyEntrys, setHistoryEntrys] = useState([])

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
      <Route path={['/playpage', '/history']}></Route>
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
              getCurrentTime={getCurrentTime}
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
    playlistName = selectedPlaylist.title
    setNewPlaylist(selectedPlaylist.songs)
    push('/playpage')
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
  display: grid;
`

export default App
