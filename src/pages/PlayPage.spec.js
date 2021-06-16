import { render, screen } from '@testing-library/react'
import PlayPage from './PlayPage'

describe('PlayPage', () => {
  it('has 4 Button component rendered', () => {
    const answers = [
      { title: 'Bulls on Parade', right: true, id: '1' },
      { title: 'Bomb Track', wrong: true, id: '2' },
      { title: 'People of the Sun', wrong: true, id: '3' },
    ]

    render(<PlayPage answers={answers} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
  })
})
