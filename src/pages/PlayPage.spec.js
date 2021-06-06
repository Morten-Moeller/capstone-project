import { render, screen } from '@testing-library/react'
import PlayPage from './PlayPage'

describe('PlayPage', () => {
  it('has 4 Button component rendered', () => {
    render(<PlayPage />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(4)
  })
})
