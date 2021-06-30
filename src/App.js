// @ts-check
import { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import bgImage from './assets/jukequestfin.svg'
import playlists from './data/playlists.json'
import GlobalFonts from './fonts/fonts'
import MultiPlayPage from './pages/MultiPlayPage'
import StartPage from './pages/StartPage'

function App() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playerData, setPlayerData] = useState({ score: 0, playerName: '' })
  const [play, setPlay] = useState(false)

  const { push } = useHistory()

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
            />
          )}
          {play && (
            <MultiPlayPage
              selectedPlaylist={selectedPlaylist}
              playerData={playerData}
              handlePlayerData={handlePlayerData}
              roomName="test2"
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
  display: grid;
  background: center / cover no-repeat url(${bgImage});
`

export default App
