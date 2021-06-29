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
    allAnswers,
    isCounter,
    url,
    initiateNextSong,
    isReady,
    isGameEnded,
    handleEndGame,
    endScore,
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

  console.log(isGameEnded)

  useEffect(() => {
    setRoom(roomName)
    setUserName(playerData.playerName)
    setSelectedPlaylist(selectedPlaylist.songs)
  }, [])

  useEffect(() => {
    console.log('newUrlUseAudio')
    if (url) {
      setSongUrl(url)
    }
  }, [url])

  return (
    <Container>
      <Link onClick={handleNavigate}>&lt;-- start new</Link>
      {isLoaded && !isGameEnded && (
        <>
          <Wrapper>
            <span>{playerData.playerName}</span>
            score: {playerData.score}
            {!areAllReady ? (
              <Button active={isReady} onClick={setReady}>
                Ready?
              </Button>
            ) : isPlaying ? (
              duration && <Timer duration={duration} />
            ) : (
              isCounter && (
                <PlayButton onClick={handlePlay}>
                  <PlayButtonSVG />
                </PlayButton>
              )
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
                  hasRightAnswer={allAnswers.some(
                    ({ user, isRight }) => (user === name) & isRight
                  )}
                  hasWrongAnswer={allAnswers.some(
                    ({ user, isRight }) => (user === name) & !isRight
                  )}
                  key={name}
                >
                  {name}
                </ListItem>
              ))}
            </List>
          </Wrapper>
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
          <Button
            onClick={() => {
              handleEndGame(playerData.score)
              stopAudio()
            }}
          >
            Submit score
          </Button>
          <ul>
            {endScore.map(el => (
              <li>
                <span>{el.player}</span>
                <span>{el.score}</span>
              </li>
            ))}
          </ul>
        </WrapperEndGame>
      )}
    </Container>
  )

  function handleAnswer(isRight) {
    if (isRight && !isAnswerVisible && isPlaying) {
      const points = calcPoints(getCurrentTime())
      handlePlayerData({ ...playerData, score: playerData.score + points })
      handleIsRight(true)
    } else {
      handleIsRight(false)
    }
    if (isPlaying) {
      stopAudio()
      setIsAnswerVisible(true)
    }
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
`

const WrapperEndGame = styled.section`
  display: grid;
  justify-items: center;
  gap: 2rem;
`
