import { render, screen } from '@testing-library/react'
import HistoryElement from './HistoryElement'

describe('HistoryElement', () => {
  it('renders its given propertys', () => {
    const historyEntry = {
      id: '02',
      playerName: 'Jane Doe',
      date: '17. Juni 2021',
      playlistName: 'Italo Disco 80s',
      score: 1312,
    }
    render(
      <HistoryElement
        playerName={historyEntry.playerName}
        playlistName={historyEntry.playlistName}
        score={historyEntry.score}
        date={historyEntry.date}
      />
    )
    const listItem = screen.getByRole('listitem')
    expect(listItem).toHaveTextContent(historyEntry.score)
    expect(listItem).toHaveTextContent(historyEntry.date)
    expect(listItem).toHaveTextContent(historyEntry.playerName)
    expect(listItem).toHaveTextContent(historyEntry.playlistName)
  })
})
