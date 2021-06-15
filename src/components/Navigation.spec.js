import { render, screen } from '@testing-library/react'
  import Navigation from './Navigation'
  
  describe('Navigation', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<Navigation />)
  
      expect(container.firstChild).toHaveTextContent('Navigation')
    })
  })
  