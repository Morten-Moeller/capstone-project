// @ts-check
import { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import bgImage from './assets/jukequestfin.svg'
import playlists from './data/playlists.json'
import GlobalFonts from './fonts/fonts'
import useLocalStorage from './hooks/useLocalStorage'
import HistoryPage from './pages/HistoryPage'
import MultiPlayPage from './pages/MultiPlayPage'
import SinglePlayPage from './pages/SinglePlayPage'
import StartPage from './pages/StartPage'

function App() {
  const [localStorage, setLocalStorage] = useLocalStorage('history', [])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playerData, setPlayerData] = useState({ score: 0, playerName: '' })
  const [historyEntrys, setHistoryEntrys] = useState(localStorage)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    setLocalStorage(historyEntrys)
  }, [historyEntrys, setLocalStorage])

  const { push } = useHistory()

  return (
    <Container>
      <GlobalFonts />
      <Switch>
        <Route exact path="/">
          {!play && (
            <StartPage
              history={historyEntrys}
              playlists={playlists}
              onMark={handleMark}
              onGame={handleGame}
              selectedPlaylist={selectedPlaylist}
              onInputChange={handleNameInput}
              playerData={playerData}
            />
          )}
          {play && (
            <MultiPlayPage
              selectedPlaylist={selectedPlaylist}
              playerData={playerData}
              handlePlayerData={handlePlayerData}
              roomName="test"
              onNavigate={handleNavigate}
            />
          )}
        </Route>
        <Route path="/history">
          <HistoryPage history={historyEntrys} />
        </Route>
      </Switch>
    </Container>
  )

  function handleGame() {
    if (selectedPlaylist) {
      setPlay(true)
    }
  }

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

  function handleMark(selectedPlaylistName) {
    const index = playlists.findIndex(
      ({ playlistName }) => playlistName === selectedPlaylistName.playlistName
    )
    setSelectedPlaylist(playlists[index])
  }

  function handlePlayerData(data) {
    setPlayerData(data)
  }

  function handleNavigate() {
    setPlay(false)
  }
}

const Container = styled.main`
  height: 100vh;
  display: grid;
  background: center / cover no-repeat url(${bgImage});
`

export default App
