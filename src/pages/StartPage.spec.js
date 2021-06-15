import { render, screen } from '@testing-library/react'
import StartPage from './StartPage'

describe('StartPage', () => {
  it('has af Carcasonne as text', () => {
    const { container } = render(<StartPage />)

    expect(container.firstChild).toHaveTextContent('StartPage')
  })
})
