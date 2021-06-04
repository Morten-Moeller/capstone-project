import { render, screen } from '@testing-library/react'
  import PlayButton from './PlayButton'
  
  describe('PlayButton', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<PlayButton />)
  
      expect(container.firstChild).toHaveTextContent('PlayButton')
    })
  })
  