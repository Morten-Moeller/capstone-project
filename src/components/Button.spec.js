import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'
import { DefaultButton } from './Button.stories'

describe('Button', () => {
  it('has its children name as text and get rendered', () => {
    const { container } = render(
      <Button onClick={() => jest.fn()}>Button</Button>
    )

    expect(container.firstChild).toHaveTextContent('Button')
  })

  it('calls onClick after an click', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Button</Button>)
    const button = screen.getByRole('button', { name: 'Button' })
    userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
