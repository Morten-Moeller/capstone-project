import { render, screen } from '@testing-library/react'
import StartPage from './StartPage'
import playlists from '../data/playlists.json'
import userEvent from '@testing-library/user-event'

describe('StartPage', () => {
  it('has a Headline', () => {
    render(<StartPage playlists={playlists} />)

    expect(screen.getByText('Juke Quest').tagName).toEqual('H1')
  })

  it('has a list with items', () => {
    render(<StartPage playlists={playlists} />)

    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThan(3)
  })

  it('has a button that can be clicked', () => {
    const onClick = jest.fn()
    render(<StartPage onGame={onClick} playlists={playlists} />)

    const button = screen.getByRole('button', { text: 'Play' })
    userEvent.click(button)
    expect(onClick).toHaveBeenCalled()
  })
})
