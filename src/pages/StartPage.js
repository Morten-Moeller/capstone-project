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
  onInputChangeRoom,
  playerData,
}) {
  return (
    <Container>
      <Headline>Juke Quest</Headline>
      <Form onSubmit={handleSubmit}>
        <Label>
          name:
          <input
            type="text"
            name="playerName"
            maxLength="12"
            onChange={onInputChange}
            value={playerData.playerName}
          />
        </Label>
        <Label>
          room:
          <input
            type="text"
            name="roomName"
            maxLength="12"
            onChange={onInputChangeRoom}
            value={playerData.room}
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
        <Button>start game</Button>
      </Form>
    </Container>
  )

  function handleSubmit(event) {
    event.preventDefault()
    const { roomName, playerName } = event.target.elements
    if (!playerName.value || !roomName.value) {
      if (!playerName.value) {
        playerName.placeholder = 'please enter a name'
      }
      if (!roomName.value) {
        roomName.placeholder = 'please enter a room'
      }
    } else {
      onGame()
    }
  }
}

const Container = styled.main`
  display: grid;
  max-width: 500px;
  max-height: 900px;
  justify-items: center;
  gap: 1rem;
  padding: 8px 16px 16px;
  margin-bottom: 16px;
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  list-style: none;
  padding: 0;
  border: 1px solid var(--color-primary);
  overflow-y: auto;
  border-radius: 2rem;
  padding: 1rem;
  height: 33vh;
  background-color: var(--color-opacity);
  box-shadow: var(--effect-neon-small);
`

const ListItem = styled.li`
  transition: var(--transition);
  box-shadow: ${prop =>
    prop.isSelected
      ? 'var(--effect-neon-small-active)'
      : 'var(--effect-neon-small)'};
  color: ${prop => prop.isSelected && 'var(--color-secondary)'};
  border-radius: 1rem;
  padding: 0.4rem 0.5rem 0.3rem;
  margin: 0.3rem;
  cursor: pointer;
  background-color: transparent;
`
const Label = styled.label`
  display: grid;
  height: 5rem;
  input {
    font-family: 'Iceland';
    border: none;
    box-shadow: var(--effect-neon-small);
    border-radius: 2rem;
    font-size: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    background-color: var(--color-opacity);
    padding: 0.25rem 1rem;
    color: var(--color-primary);
    &:focus {
      outline: none;
    }
  }
`
const Form = styled.form`
  display: grid;
  justify-items: center;
  gap: 1rem;
`
