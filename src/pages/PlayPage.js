import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import Timer from '../components/Timer'
import useShortcut from '../hooks/useShortcut'

export default function PlayPage({
  onPlay,
  onAnswer,
  answers,
  showAnswer,
  isPlaying,
  duration,
  onChange,
  isLoaded,
}) {
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
                onClick={onAnswer}
              >
                {answer.title}
              </Button>
            ))}
          </nav>{' '}
        </>
      )}
    </Container>
  )
}

const Container = styled.main`
  height: 100vh;
  display: grid;
  align-items: center;
  grid-template-rows: 3fr 1fr 3fr;
  padding: 16px;

  nav {
    display: grid;
    gap: 10px;
  }

  nav,
  button {
    height: 48px;
    font-size: 1.25rem;
  }
`
const Hint = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 10px 0;
  font-size: 0.8rem;
  color: #555;
  background-color: #f1f1f1;
  width: 250px;
  justify-self: center;
  line-height: 1.5;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;

  label {
    margin-top: 10px;
    align-self: flex-start;
    display: grid;
    width: 70%;
  }
`
