import { render, screen } from '@testing-library/react'
  import HistoryPage from './HistoryPage'
  
  describe('HistoryPage', () => {
    it('has af Carcasonne as text', () => {
      const { container } = render(<HistoryPage />)
  
      expect(container.firstChild).toHaveTextContent('HistoryPage')
    })
  })
  