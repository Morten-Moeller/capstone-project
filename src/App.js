// @ts-check
import { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import bgImage from './assets/jukequestfin.jpg'
import playlists from './data/playlists.json'
import GlobalFonts from './fonts/fonts'
import MultiPlayPage from './pages/MultiPlayPage'
import StartPage from './pages/StartPage'

function App() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0])
  const [playerData, setPlayerData] = useState({
    score: 0,
    playerName: '',
    room: '',
  })
  const [play, setPlay] = useState(false)

  return (
    <Container>
      <GlobalFonts />
      <Switch>
        <Route exact path="/">
          {!play && (
            <StartPage
              playlists={playlists}
              onMark={handleMark}
              onGame={handleGame}
              selectedPlaylist={selectedPlaylist}
              onInputChange={handleNameInput}
              playerData={playerData}
              onInputChangeRoom={handleRoomInput}
            />
          )}
          {play && (
            <MultiPlayPage
              selectedPlaylist={selectedPlaylist}
              playerData={playerData}
              handlePlayerData={handlePlayerData}
              onNavigate={handleNavigate}
            />
          )}
        </Route>
      </Switch>
    </Container>
  )

  function handleGame() {
    if (selectedPlaylist) {
      setPlay(true)
    }
  }

  function handleRoomInput(event) {
    const input = event.target
    setPlayerData({ ...playerData, room: input.value })
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
    setPlayerData({ ...playerData, score: 0 })
  }
}

const Container = styled.main`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: center / cover no-repeat url(${bgImage});
`

export default App
