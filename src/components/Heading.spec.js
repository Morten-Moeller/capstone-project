import { render } from '@testing-library/react'
import Heading from './Heading'

describe('Heading', () => {
  it('should render a headline with text', () => {
    const text = 'Juke Quest'
    const { container } = render(<Heading>{text}</Heading>)

    expect(container.firstChild.tagName).toEqual('H1')
    expect(container.firstChild).toHaveTextContent(text)
  })
})
