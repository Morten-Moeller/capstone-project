import { render, screen } from '@testing-library/react'
  import PlayPage from './PlayPage'
  
  describe('PlayPage', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<PlayPage />)
  
      expect(container.firstChild).toHaveTextContent('PlayPage')
    })
  })
  