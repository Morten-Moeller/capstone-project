import { render, screen } from '@testing-library/react'
import Navigation from './Navigation'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('Navigation', () => {
  it('has a back link', () => {
    render(<Navigation />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('can be clicked', () => {
    const onBack = jest.fn()
    render(<Navigation onBack={onBack} />, { wrapper: MemoryRouter })
    userEvent.click(screen.getByRole('link'))

    expect(onBack).toHaveBeenCalled()
  })
})
