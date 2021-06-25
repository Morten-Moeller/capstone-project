import { render, screen } from '@testing-library/react'
import StartPage from './StartPage'
import playlists from '../data/playlists.json'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom.min'

const playerData = {
  playerName: 'John Doe',
  score: '200',
}

describe('StartPage', () => {
  it('has a Headline', () => {
    render(<StartPage playerData={playerData} playlists={playlists} />)

    expect(screen.getByText('Juke Quest').tagName).toEqual('H1')
  })

  it('has a list with items', () => {
    render(<StartPage playerData={playerData} playlists={playlists} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(3)
  })

  it('has a button that can be clicked', () => {
    const onClick = jest.fn()
    render(
      <StartPage
        playerData={playerData}
        onGame={onClick}
        playlists={playlists}
      />,
      { wrapper: MemoryRouter }
    )

    const button = screen.getByRole('button', { text: 'Play' })
    userEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })
})
