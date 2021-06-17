import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import Button from '../components/Button'
import Headline from '../components/Headline'

StartPage.propTypes = {
  playlist: PropTypes.array,
  isSelected: PropTypes.bool,
  onGame: PropTypes.func,
  onMark: PropTypes.func,
}

export default function StartPage({
  playlists,
  onGame,
  onMark,
  selectedPlaylist,
  onInputChange,
  playerData,
}) {
  return (
    <Container>
      <Headline>Juke Quest</Headline>
      <Label>
        Name:
        <input
          type="text"
          onChange={onInputChange}
          value={playerData.playerName}
        />
      </Label>
      <List>
        {playlists.map(({ id, title, playlistName }) => (
          <ListItem
            isSelected={selectedPlaylist?.playlistName === playlistName}
            key={id}
            onClick={() => onMark({ playlistName })}
          >
            {title}
          </ListItem>
        ))}
      </List>
      <Button onClick={onGame}>Play</Button>
    </Container>
  )
}

const Container = styled.main`
  display: grid;
  justify-items: center;
  padding: 20px;
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  list-style: none;
  padding: 0;
`

const ListItem = styled.li`
  background-color: ${prop =>
    prop.isSelected
      ? 'var(--active-background-color)'
      : 'var(--secondary-background-color)'};
  border-radius: 0.15rem;
  padding: 0.15rem 0.2rem;
  cursor: pointer;
`
const Label = styled.label`
  display: grid;
`
