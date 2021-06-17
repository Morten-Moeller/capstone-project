import { render, screen } from '@testing-library/react'
  import HistoryElement from './HistoryElement'
  
  describe('HistoryElement', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<HistoryElement />)
  
      expect(container.firstChild).toHaveTextContent('HistoryElement')
    })
  })
  