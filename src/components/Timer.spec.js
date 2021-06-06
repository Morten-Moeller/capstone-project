import { render, screen } from '@testing-library/react'
  import Timer from './Timer'
  
  describe('Timer', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<Timer />)
  
      expect(container.firstChild).toHaveTextContent('Timer')
    })
  })
  