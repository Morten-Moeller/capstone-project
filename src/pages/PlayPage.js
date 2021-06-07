import styled from 'styled-components/macro'
import Button from '../components/Button'
import PlayButton from '../components/PlayButton'
import Timer from '../components/Timer'

export default function PlayPage({
  onPlay,
  onAnswer,
  answers,
  showAnswer,
  playing,
  duration,
}) {
  return (
    <Container>
      {playing ? (
        <Timer duration={duration} />
      ) : (
        <PlayButton onClick={onPlay}>&gt;</PlayButton>
      )}
      {answers.map(answer => (
        <Button
          key={answer.title}
          right={showAnswer ? answer.right : false}
          wrong={showAnswer ? answer.wrong : false}
          onClick={onAnswer}
        >
          {answer.title}
        </Button>
      ))}
    </Container>
  )
}

const Container = styled.main`
  height: 100vh;
  display: grid;
  align-items: center;
  grid-template-rows: 5fr 1fr 1fr 1fr;
  padding: 16px;

  button {
    height: 48px;
    font-size: 1.25rem;
  }

  button:first-child {
  }
`
