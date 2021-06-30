import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import { ReactComponent as PlayButtonSVG } from '../assets/play.svg'
import StyledSlider from '../components/StyledSlider'
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
  onNavigate,
}) {
  const {
    setReady,
    allReady,
    areAllReady,
    handleIsRight,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    newAnswers,
    player,
    isLoaded,
    allAnswered,
    isCounter,
    url,
    initiateNextSong,
    isReady,
    isGameRunning,
    isGameEnded,
    handleEndGame,
    endScore,
    areAllEnded,
    songStarted,
    areAllSongsStarted,
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
  const [answers, setAnswers] = useState([])
  const [isSpectator, setIsSpectator] = useState(true)

  useEffect(() => {
    setRoom(roomName)
    setUserName(playerData.playerName)
    setSelectedPlaylist(selectedPlaylist.songs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('newUrlUseAudio')
    if (url) {
      setSongUrl(url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    if (isGameEnded) {
      handleEndGame(playerData.score)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameEnded === true])

  return (
    <Container>
      <Link onClick={handleNavigate}>&lt;-- start new</Link>
      {isSpectator && isLoaded && (
        <WrapperStart>
          {isGameRunning ? (
            <span>Game is already running</span>
          ) : (
            <Button active={isReady} onClick={handleReady}>
              Ready?
            </Button>
          )}
        </WrapperStart>
      )}
      {!isSpectator && isLoaded && !isGameEnded && (
        <>
          <WrapperGame>
            <span>{playerData.playerName}</span>
            score: {playerData.score}
            {isPlaying
              ? duration && <Timer duration={duration} />
              : (!isAnswerVisible ||
                  (isAnswerVisible && !areAllSongsStarted)) && (
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
                  key={name}
                  isReady={allReady.some(({ user }) => user === name)}
                  hasRightAnswer={allAnswered.some(
                    ({ user, isRight }) => (user === name) & isRight
                  )}
                  hasWrongAnswer={allAnswered.some(
                    ({ user, isRight }) => (user === name) & !isRight
                  )}
                >
                  {name}
                </ListItem>
              ))}
            </List>
          </WrapperGame>
          {areAllReady && (
            <nav tabIndex={1}>
              {answers?.map(answer => (
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
      {isGameEnded && !isCounter && (
        <WrapperEndGame>
          Game ended! You got {playerData.score} points.
          {!areAllEnded ? (
            'Please wait until allready'
          ) : (
            <ScoreList>
              {endScore.map(el => (
                <ScoreListItem key={el.player}>
                  <span>{el.player}</span>
                  <span>{el.score}</span>
                </ScoreListItem>
              ))}
            </ScoreList>
          )}
        </WrapperEndGame>
      )}
    </Container>
  )

  function handleReady() {
    setReady()
    setIsSpectator(false)
  }

  function handleAnswer(isRight) {
    if (isRight && !isAnswerVisible && isPlaying) {
      const points = calcPoints(getCurrentTime())
      handlePlayerData({ ...playerData, score: playerData.score + points })
      handleIsRight(true)
    } else {
      handleIsRight(false)
    }

    stopAudio()
    setIsAnswerVisible(true)
  }

  function handlePlay() {
    if (!isPlaying) {
      toggleAudio()
    }
    if (isAnswerVisible && !isPlaying) {
      setIsAnswerVisible(false)
    }
    initiateNextSong()
    setAnswers(newAnswers)
    songStarted()
  }

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }

  function handleNavigate() {
    onNavigate()
    stopAudio()
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
    width: 80%;
  }
`

const WrapperGame = styled.div`
  display: grid;
  justify-self: center;
  justify-items: center;
  align-items: center;
  width: 100%;
  gap: 0.5rem;

  label {
    align-self: flex-start;
    display: grid;
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
  color: ${prop =>
    prop.hasRightAnswer
      ? 'var(--color-right)'
      : prop.hasWrongAnswer
      ? 'var(--color-wrong)'
      : 'var(--color-primary)'};
  height: 2rem;
  border-radius: 1rem;
  padding: 0.4rem 0.5rem 0.3rem;
  margin: 0.3rem;
  cursor: pointer;
  background-color: transparent;
`
const Link = styled.a`
  color: var(--color-secondary);
  text-shadow: var(--effect-neon-small-navigation);
`

const WrapperEndGame = styled.section`
  margin-top: 3rem;
  display: grid;
  justify-items: center;
  gap: 2rem;
`
const ScoreList = styled.ul`
  padding: 0;
  list-style: none;
  padding: 1rem;
  color: var(--color-secondary);
  width: 80vw;
`
const ScoreListItem = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
`
const WrapperStart = styled.div``
