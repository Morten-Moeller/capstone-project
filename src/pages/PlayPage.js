import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import StyledSlider from '../components/StyledSlider'
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
  playerData,
  counter,
  onEndGame,
}) {
  useShortcut(['a'], onAnswer)
  useShortcut(['1'], onAnswer)
  useShortcut(['b'], onAnswer)
  useShortcut(['2'], onAnswer)
  useShortcut(['c'], onAnswer)
  useShortcut(['3'], onAnswer)
  useShortcut(['s'], onPlay)
  const isCounter = Boolean(counter > 0)
  document.activeElement.blur()
  return (
    <Container>
      {Boolean(isLoaded) && isCounter && (
        <>
          <Wrapper>
            <span>{playerData.playerName}</span>
            score: {playerData.score}
            {isPlaying ? (
              duration && <Timer duration={duration} />
            ) : (
              <PlayButton onClick={onPlay}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 102 102.194"
                >
                  <g transform="translate(1 1.101)">
                    <path
                      d="M94.735,41.928,16.161,1.285C9.777-2.016,0,1.187,0,9.351V90.617c0,7.324,9.085,11.738,16.161,8.066L94.735,58.06c7.009-3.613,7.031-12.519,0-16.132Z"
                      transform="translate(0 -0.002)"
                      fill="none"
                      stroke="#ed67bf"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </PlayButton>
            )}
            <label>
              Volume:
              <StyledSlider
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
                onClick={() => onAnswer(answer.right)}
              >
                {answer.title}
              </Button>
            ))}
          </nav>
        </>
      )}
      {!isCounter && (
        <WrapperEndGmae>
          Game ended! You got {playerData.score} points.
          <Button onClick={onEndGame}>End game</Button>
        </WrapperEndGmae>
      )}
    </Container>
  )
}

const Container = styled.main`
  height: calc(100vh - 2rem);
  display: grid;
  align-items: center;
  grid-template-rows: 3fr 1fr 3fr;
  padding: 1rem;
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

const WrapperEndGmae = styled.section`
  display: grid;
  justify-items: center;
  gap: 2rem;
`
