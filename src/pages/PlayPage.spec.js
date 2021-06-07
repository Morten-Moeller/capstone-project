import { render, screen } from '@testing-library/react'
import PlayPage from './PlayPage'

describe('PlayPage', () => {
  it('has 4 Button component rendered', () => {
    const answers = [
      { title: 'Bulls on Parade', right: true },
      { title: 'Bomb Track', wrong: true },
      { title: 'People of the Sun', wrong: true },
    ]

    render(<PlayPage answers={answers} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
  })
})
