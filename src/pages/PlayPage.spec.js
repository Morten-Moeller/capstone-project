import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlayPage from './PlayPage'

const answers = [
  { title: 'Bulls on Parade', right: true, id: '1' },
  { title: 'Bomb Track', wrong: true, id: '2' },
  { title: 'People of the Sun', wrong: true, id: '3' },
]
const playerData = {
  playerName: 'John Doe',
  score: '200',
}

describe('PlayPage', () => {
  it('has 4 Button component rendered when the game is active', () => {
    render(
      <PlayPage
        playerData={playerData}
        isLoaded={true}
        counter={5}
        answers={answers}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
  })
  it('has just one button when the game is finished.', () => {
    render(
      <PlayPage
        playerData={playerData}
        isLoaded={true}
        counter={0}
        answers={answers}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
  it('has the end game button clickable', () => {
    const onClick = jest.fn()
    render(
      <PlayPage
        playerData={playerData}
        isLoaded={true}
        counter={0}
        answers={answers}
        onEndGame={onClick}
      />
    )
    const button = screen.getByRole('button', { text: 'End game' })
    userEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })
})
