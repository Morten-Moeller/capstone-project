import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

const page = 'history'

describe('Navigation', () => {
  it('has a back link', () => {
    render(<Navigation page={page} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('can be clicked', () => {
    const onBack = jest.fn()

    render(<Navigation page={page} onBack={onBack} />, {
      wrapper: MemoryRouter,
    })
    userEvent.click(screen.getByRole('link'))

    expect(onBack).toHaveBeenCalled()
  })
})
