import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import play from '../assets/play.png'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import StyledSlider from '../components/StyledSlider'
import Timer from '../components/Timer'
import useAudio from '../hooks/useAudio'
import UseMultiplayer from '../hooks/UseMultiplayer'
import calcPoints from '../services/calcPoints'
import defaultAnswers from '../services/defaultAnswers'

export default function MultiPlayPage({
  playerData,
  selectedPlaylist,
  handlePlayerData,
  onNavigate,
}) {
  const {
    allAnswered,
    allReady,
    areAllReady,
    endScore,
    gameEnded,
    initiateNextSong,
    isGameEnded,
    isGameRunning,
    isLastSong,
    isLoaded,
    isReady,
    newAnswers,
    player,
    playlistName,
    sendEndGame,
    sendIsRight,
    sendPlayerCheck,
    sendQuit,
    sendReady,
    sendScore,
    sendSongStarted,
    setCurRoom,
    setPlaylistName,
    setSelectedPlaylist,
    setUserName,
    unSubscribe,
    url,
  } = UseMultiplayer()

  const {
    changeVolume,
    duration,
    getCurrentTime,
    isPlaying,
    setSongUrl,
    stopAudio,
    toggleAudio,
  } = useAudio()

  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [answers, setAnswers] = useState(defaultAnswers)
  const [isSpectator, setIsSpectator] = useState(true)
  const [isNextSong, setIsNextSong] = useState(false)

  const thisGameEnded = gameEnded.some(
    ({ player }) => player === playerData.playerName
  )

  if (endScore) {
    endScore?.sort((a, b) => a.score - b.score).reverse()
  }

  useEffect(() => {
    setCurRoom(playerData.room)
    setUserName(playerData.playerName)
    setSelectedPlaylist(selectedPlaylist.songs)
    setPlaylistName(selectedPlaylist.title)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (thisGameEnded || isGameEnded) {
      sendScore(playerData.score)
      setTimeout(unSubscribe, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnded, isGameEnded])

  useEffect(() => {
    if (url) {
      setSongUrl(url)
      setIsNextSong(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    if (areAllReady && !isPlaying && !isAnswerVisible) {
      sendIsRight(false)
      setIsAnswerVisible(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  useEffect(() => {
    let checkTimer
    if (areAllReady) {
      checkTimer = setInterval(sendPlayerCheck, 10000)
    }
    return () => clearInterval(checkTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllReady])

  return (
    <Container>
      <Link onClick={handleNavigate}>&lt;-- start new</Link>
      {isSpectator && isLoaded && !isGameEnded && (
        <WrapperStart>
          <List>
            <p>
              Selected playlist: {playlistName}
              <br />
              Selected room: {playerData.room}
              <br />
              Player already joined:
            </p>

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
          {!isGameEnded && isGameRunning ? (
            <span>Game is already running</span>
          ) : (
            <Button active={isReady} onClick={handleReady}>
              Ready?
            </Button>
          )}
        </WrapperStart>
      )}
      {!isSpectator && !isGameEnded && (
        <>
          <WrapperGame>
            <PlayerName>{playerData.playerName}</PlayerName>
            score: {playerData.score}
            <PlayButtonWrapper>
              {isPlaying ? (
                duration && <Timer duration={duration} />
              ) : (!isAnswerVisible && areAllReady) ||
                (!thisGameEnded && isNextSong) ? (
                <PlayButton onClick={handlePlay}>
                  <img src={play} alt="Play" height="100" width="100" />
                </PlayButton>
              ) : (
                <GlowContainer2>Please wait</GlowContainer2>
              )}
            </PlayButtonWrapper>
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
            {
              <nav tabIndex={1}>
                {answers?.map(answer => (
                  <Button
                    question={true}
                    key={answer.id}
                    green={isAnswerVisible && answer.state === 'right'}
                    red={isAnswerVisible && answer.state === 'wrong'}
                    onClick={event =>
                      !isAnswerVisible && handleAnswer(event, answer.state)
                    }
                  >
                    {answer.title}
                  </Button>
                ))}
              </nav>
            }
          </WrapperGame>
        </>
      )}
      {isGameEnded && (
        <WrapperEndGame>
          <GlowContainer>
            Game ended! You got {playerData.score} points.
            <ScoreList>
              {endScore.map(el => (
                <ScoreListItem key={el.player}>
                  <span>{el.player}</span>
                  <span>{el.score}</span>
                </ScoreListItem>
              ))}
            </ScoreList>
          </GlowContainer>
        </WrapperEndGame>
      )}
      {!isLoaded && !areAllReady && (
        <>
          <WrapperLoading>
            <GlowContainer>Please wait while loading</GlowContainer>
          </WrapperLoading>
        </>
      )}
    </Container>
  )

  function handleReady() {
    sendReady()
    setIsSpectator(false)
  }

  function handleAnswer(event, answer) {
    const clickedButton = event.target
    clickedButton.style.opacity = 1
    if (answer === 'right' && !isAnswerVisible && isPlaying) {
      const points = calcPoints(getCurrentTime())
      handlePlayerData({ ...playerData, score: playerData.score + points })
      sendIsRight(true)
    } else {
      sendIsRight(false)
    }
    stopAudio()
    setIsAnswerVisible(true)
    if (isLastSong) {
      sendEndGame()
    }
  }

  function handlePlay() {
    if (!isPlaying) {
      toggleAudio()
    }
    initiateNextSong()
    setIsAnswerVisible(false)
    sendSongStarted()
    setIsNextSong(false)
    setAnswers(newAnswers)
  }

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }

  function handleNavigate() {
    stopAudio()
    if (isReady && !isGameEnded) {
      sendQuit()
      unSubscribe()
    }
    onNavigate()
  }
}

const Container = styled.main`
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 900px;
  display: grid;
  grid-template-rows: 3rem auto;
  padding: 8px 32px 16px;
  margin-bottom: 24px;
  align-items: center;
`

const WrapperStart = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  min-width: 325px;

  gap: 1rem;
  justify-items: center;
  button {
    align-self: end;
    padding: 0.25rem;
    font-size: 1.75rem;
    height: 45px;
  }

  ul {
    margin-top: 3rem;
  }
`

const WrapperGame = styled.div`
  height: 100%;
  width: 100%;
  min-width: 325px;
  display: grid;
  justify-self: center;
  justify-items: center;
  /* gap: 0.5rem; */

  label {
    align-self: flex-start;
    display: grid;
  }

  ul {
    min-height: 7.5rem;
    max-height: 7.5rem;
  }

  nav {
    display: grid;
    gap: 2rem;
    justify-items: center;

    button {
      font-size: 1.5rem;
    }
  }
`

const WrapperEndGame = styled.section`
  height: 100%;
  width: 100%;
  min-width: 325px;
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

const WrapperLoading = styled.div`
  height: 100%;
  width: 100%;
  min-width: 325px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlayerName = styled.span`
  font-size: 2.5rem;
`

const List = styled.ul`
  margin: 0 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: start;
  gap: 0.25rem 1rem;
  list-style: none;
  padding: 0;
  border: 1px solid var(--color-primary);
  overflow-y: auto;
  border-radius: 2rem;
  padding: 0.75rem;
  min-height: 30vh;
  max-height: 60vh;
  width: 100%;
  background-color: var(--color-opacity);
  box-shadow: var(--effect-neon-small);

  p {
    width: 100%;
    font-size: 1.25rem;
    line-height: 1.5;
    padding: 1rem;
  }
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
  min-height: 2rem;
  border-radius: 1rem;
  padding: 0.4rem 0.5rem 0.3rem;
  margin: 0.3rem;
  background-color: transparent;
`
const Link = styled.a`
  color: var(--color-secondary);
  text-shadow: var(--effect-neon-small-navigation);
  cursor: pointer;
  position: left;
`

const GlowContainer = styled.div`
  width: 100%;
  min-height: 7.5rem;
  box-shadow: var(--effect-neon-small);
  background-color: var(--color-opacity);
  box-shadow: var(--effect-neon-small);
  border-radius: 2rem;
  padding: 0.75rem;
  text-align: center;
`

const GlowContainer2 = styled.div`
  width: 100%;
  box-shadow: var(--effect-neon-small);
  background-color: var(--color-opacity);
  box-shadow: var(--effect-neon-small);
  border-radius: 2rem;
  padding: 0.75rem;
  margin-top: 1rem;
  text-align: center;
`

const ScoreList = styled.ul`
  padding: 0;
  list-style: none;
  padding: 1rem;
  color: var(--color-secondary);
  width: 100%;
  align-self: flex-start;
`
const ScoreListItem = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
`

const PlayButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5.5rem;
  button {
    height: 100%;
    opacity: 1;
  }
  img {
    width: auto;
    height: 100%;
  }
`
