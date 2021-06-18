import { render, screen } from '@testing-library/react'
import HistoryPage from './HistoryPage'

describe('HistoryPage', () => {
  it('has a list of HistryEntrys', () => {
    render(
      <HistoryPage
        history={[
          {
            id: '01',
            playerName: 'John Doe',
            date: '17. Juni 2021',
            playlistName: 'Italo Disco 80s',
            score: 1123,
          },
          {
            id: '02',
            playerName: 'Jane Doe',
            date: '17. Juni 2021',
            playlistName: 'Italo Disco 80s',
            score: 1312,
          },
        ]}
      />
    )

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(1)
  })
})
