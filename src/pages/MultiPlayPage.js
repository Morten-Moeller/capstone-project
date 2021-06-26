//@ts-check
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
    setIsReady,
    setIsHost,
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
    setUserName(playerData.userName)
    setSelectedPlaylist(selectedPlaylist.songs)
  }, [])

  useEffect(() => {
    if (url) {
      setSongUrl(url)
    }
  }, [url])

  return (
    <Container>
      <Link to="/">&lt;-- start new</Link>
      {isLoaded && isCounter && (
        <>
          <Wrapper>
            <span>{playerData.playerName}</span>
            score: {playerData.score}
            {isPlaying ? (
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
          </Wrapper>

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
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;

  label {
    margin-top: 0.5rem;
    align-self: flex-start;
    display: grid;
    width: 70%;
  }
`
