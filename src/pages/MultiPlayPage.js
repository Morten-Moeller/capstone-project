import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import { ReactComponent as PlayButtonSVG } from '../assets/play.svg'
import StyledSlider from '../components/StyledSlider'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import UseMultiplayer from '../hooks/UseMultiplayer'
import { useEffect, useState } from 'react'
import Timer from '../components/Timer'
import calcPoints from '../services/calcPoints'
import useAudio from '../hooks/useAudio'

export default function MultiPlayPage({
  playerData,
  roomName,
  selectedPlaylist,
  handlePlayerData,
}) {
  const {
    setReady,
    allReady,
    areAllReady,
    setIsRight,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    newAnswers,
    player,
    isLoaded,
    initiateNextSong,
    isCounter,
    url,
  } = UseMultiplayer()

  const {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
    getCurrentTime,
  } = useAudio()

  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  useEffect(() => {
    setRoom(roomName)
    setUserName(playerData.playerName)
    setSelectedPlaylist(selectedPlaylist.songs)
  }, [])

  useEffect(() => {
    if (url && areAllReady) {
      setSongUrl(url)
    }
  }, [url, areAllReady])

  return (
    <Container>
      <Link to="/">&lt;-- start new</Link>
      {isLoaded && isCounter && (
        <>
          <Wrapper>
            <span>{playerData.playerName}</span>
            score: {playerData.score}
            {!areAllReady ? (
              <Button onClick={setReady}>Ready?</Button>
            ) : isPlaying ? (
              duration && <Timer duration={duration} />
            ) : (
              <PlayButton onClick={handlePlay}>
                <PlayButtonSVG />
              </PlayButton>
            )}
            <label>
              Volume:
              <StyledSlider
                type="range"
                min="0"
                max="100"
                step="1"
                onMouseUp={handleVolume}
              />
            </label>
            <List>
              {player.map(name => (
                <ListItem
                  isReady={allReady.some(({ user }) => user === name)}
                  key={name}
                >
                  {name}
                </ListItem>
              ))}
            </List>
          </Wrapper>
          {areAllReady && (
            <nav tabIndex={1}>
              {newAnswers?.map(answer => (
                <Button
                  key={answer.id}
                  right={isAnswerVisible && answer.right}
                  wrong={isAnswerVisible && answer.wrong}
                  onClick={() => handleAnswer(answer.right)}
                >
                  {answer.title}
                </Button>
              ))}
            </nav>
          )}
        </>
      )}
    </Container>
  )

  function handleAnswer(isRight) {
    if (isRight && !isAnswerVisible && isPlaying) {
      const points = calcPoints(getCurrentTime())
      handlePlayerData({ ...playerData, score: playerData.score + points })
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

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }
}

const Container = styled.main`
  height: 100vh;
  display: grid;
  align-items: center;
  grid-template-rows: min-content 3fr 1fr 3fr;
  padding: 8px 16px 16px;
  span {
    font-size: 2rem;
  }

  nav {
    display: grid;
    gap: 1.5rem;
    justify-items: center;
  }

  svg {
    height: 5rem;
    width: 5rem;
  }

  label {
    justify-self: center;
    min-width: 250px;
    width: 100%;
    margin-bottom: 2rem;
  }
`

const Wrapper = styled.div`
  display: grid;
  justify-self: center;
  justify-items: center;
  align-items: center;
  width: 100%;

  label {
    margin-top: 0.5rem;
    align-self: flex-start;
    display: grid;
    width: 70%;
  }
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.25rem 1rem;
  list-style: none;
  padding: 0;
  border: 1px solid var(--color-primary);
  overflow-y: auto;
  border-radius: 2rem;
  padding: 0.75rem;
  height: 7.5rem;
  width: 100%;
  background-color: var(--color-opacity);
  box-shadow: var(--effect-neon-small);
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
  transition: var(--transition);
  box-shadow: ${prop =>
    prop.isReady
      ? 'var(--effect-neon-small-active)'
      : 'var(--effect-neon-small)'};
  color: var(--color-primary);
  height: 2rem;
  border-radius: 1rem;
  padding: 0.4rem 0.5rem 0.3rem;
  margin: 0.3rem;
  cursor: pointer;
  background-color: transparent;
`
