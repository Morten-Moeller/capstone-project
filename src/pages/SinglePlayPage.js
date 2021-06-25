import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import styled from 'styled-components/macro'
import { ReactComponent as PlayButtonSVG } from '../assets/play.svg'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import StyledSlider from '../components/StyledSlider'
import Timer from '../components/Timer'
import useAudio from '../hooks/useAudio'
import usePlayList from '../hooks/usePlayList'
import useShortcut from '../hooks/useShortcut'
import calcPoints from '../services/calcPoints'
import defaultAnswers from '../services/defaultAnswers'

export default function SinglePlayPage({
  selectedPlaylist,
  playerData,
  onEndGame,
  handlePlayerData,
}) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)
  const [newAnswers, setNewAnswers] = useState(defaultAnswers)

  const {
    getNextUrl,
    answers,
    initiateNextSong,
    setNewPlaylist,
    isLoaded,
    counter,
  } = usePlayList(null)

  const {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
    getCurrentTime,
  } = useAudio()

  useEffect(() => {
    if (isPlaying) {
      setNewAnswers(answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  useEffect(() => {
    setNewSong(getNextUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNextUrl])

  useEffect(() => {
    if (typeof selectedPlaylist === 'object') {
      setNewPlaylist(selectedPlaylist.songs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist])

  useShortcut(['a'], handleAnswer)
  useShortcut(['1'], handleAnswer)
  useShortcut(['b'], handleAnswer)
  useShortcut(['2'], handleAnswer)
  useShortcut(['c'], handleAnswer)
  useShortcut(['3'], handleAnswer)
  useShortcut(['s'], handlePlay)
  const isCounter = Boolean(counter > 0)
  document.activeElement.blur()

  return (
    <Container>
      <Link to="/" onClick={handleBack}>
        &lt;-- start new
      </Link>
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
          <Hint tabIndex="0" aria-label="You can use this game by shortcuts">
            <li>Use 's' to start the Song</li>
            <li>Use first answer with 'a' or '1'</li>
            <li>Use second answer with 'b' or '2'</li>
            <li>Use third answer with 'c' or '3'</li>
          </Hint>
          <nav tabIndex="1">
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
      {isLoaded && !isCounter && (
        <WrapperEndGame>
          Game ended! You got {playerData.score} points.
          <Button onClick={onEndGame}>End game</Button>
        </WrapperEndGame>
      )}
    </Container>
  )

  function setNewSong(url) {
    if (!isPlaying) {
      setSongUrl(url)
    }
  }

  function handleBack() {
    setNewAnswers(defaultAnswers)
    setIsAnswerVisible(false)
    stopAudio()
    handlePlayerData({ ...playerData, score: 0 })
    setNewPlaylist(null)
  }

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

  function handleVolume(event) {
    const volume = event.target.value
    changeVolume(volume)
  }

  function handlePlay() {
    if (!isPlaying) {
      toggleAudio()
    }
    if (isAnswerVisible && !isPlaying) {
      setIsAnswerVisible(false)
    }
  }
}

const Container = styled.main`
  height: calc(100vh - 2rem);
  display: grid;
  align-items: center;
  grid-template-rows: min-content 3fr 1fr 3fr;
  padding: 0.5rem 1rem 1rem;
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
const Hint = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0.5rem 0;
  font-size: 1rem;
  color: var(--color-primary);
  background-color: var(--color-opacity);
  width: 35ch;
  justify-self: center;
  line-height: 1.5;
  border: 1px solid var(--color-primary);
  border-radius: 2rem;
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

const WrapperEndGame = styled.section`
  display: grid;
  justify-items: center;
  gap: 2rem;
`
