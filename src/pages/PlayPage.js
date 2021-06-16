import { useState } from 'react'
import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import Timer from '../components/Timer'
import useShortcut from '../hooks/useShortcut'
import calcPoints from '../utils/calcPoints'

export default function PlayPage({
  onPlay,
  onAnswer,
  answers,
  showAnswer,
  isPlaying,
  duration,
  onChange,
  isLoaded,
  getCurrentTime,
}) {
  const [score, setScore] = useState(0)
  useShortcut(['a'], onAnswer)
  useShortcut(['1'], onAnswer)
  useShortcut(['b'], onAnswer)
  useShortcut(['2'], onAnswer)
  useShortcut(['c'], onAnswer)
  useShortcut(['3'], onAnswer)
  useShortcut(['s'], onPlay)

  return (
    <Container>
      {isLoaded && (
        <>
          <Wrapper>
            score: {score}
            {isPlaying ? (
              duration && <Timer duration={duration} />
            ) : (
              <PlayButton onClick={onPlay}>&gt;</PlayButton>
            )}
            <label>
              Volume:
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                onChange={onChange}
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
            {answers.map(answer => (
              <Button
                key={answer.id}
                right={showAnswer && answer.right}
                wrong={showAnswer && answer.wrong}
                onClick={() => handleAnswer(answer.right)}
              >
                {answer.title}
              </Button>
            ))}
          </nav>{' '}
        </>
      )}
    </Container>
  )

  function handleAnswer(isRight) {
    if (isRight) {
      const points = calcPoints(getCurrentTime())
      setScore(score + points)
    }
    onAnswer()
  }
}

const Container = styled.main`
  height: calc(100vh - 2rem);
  display: grid;
  align-items: center;
  grid-template-rows: 3fr 1fr 3fr;
  padding: 1rem;

  nav {
    display: grid;
    gap: 0.5rem;
  }

  nav,
  button {
    height: 3rem;
    font-size: 1.25rem;
  }
`
const Hint = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0.5rem 0;
  font-size: 0.8rem;
  color: #555;
  background-color: var(--primary-background-color);
  width: 35ch;
  justify-self: center;
  line-height: 1.5;
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
