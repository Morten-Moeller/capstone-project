import { render, screen } from '@testing-library/react'
  import Button from './Button'
  
  describe('Button', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<Button />)
  
      expect(container.firstChild).toHaveTextContent('Button')
    })
  })
  