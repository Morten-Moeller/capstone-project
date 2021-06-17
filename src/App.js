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
  const [playerData, setPlayerData] = useState({ score: 0, playerName: '' })
  const [historyEntrys, setHistoryEntrys] = useState([
    {
      id: '01',
      playerName: 'John Doe',
      date: '17. Juni 2021',
      playlistName: 'Italo Disco 80s',
      score: 1123,
    },
    {
      id: '02',
      playerName: 'Jane Doe',
      date: '17. Juni 2021',
      playlistName: 'Italo Disco 80s',
      score: 1312,
    },
  ])

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
      <Route path={['/playpage', '/history']}>
        <Navigation onBack={handleBack} />
      </Route>
      <Switch>
        <Route exact path="/">
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
            />
          )}
        </Route>
        <Route path="/history">
          <HistoryPage history={historyEntrys} />
        </Route>
      </Switch>
    </Container>
  )

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
    if (isRight && !isAnswerVisible) {
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
