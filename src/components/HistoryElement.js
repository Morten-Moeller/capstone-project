//@ts-check
import styled from 'styled-components/macro'
import PropType from 'prop-types'

HistoryElement.propTypes = {
  playerName: PropType.string,
  score: PropType.number,
  date: PropType.string,
  playlistName: PropType.string,
}

export default function HistoryElement({
  playerName,
  score,
  date,
  playlistName,
}) {
  return (
    <ListItem>
      <div>
        <span>{date}</span>
        {playlistName}
      </div>
      <div>
        <span>{playerName}</span> {score}
      </div>
    </ListItem>
  )
}

const ListItem = styled.li`
  display: grid;
  gap: 0.25rem;
  border: 1px solid var(--color-primary);
  padding: 0.75rem;
  margin: 0.25rem;
  border-radius: 1.5rem;
  box-shadow: var(--effect-neon-small);
  background-color: var(--color-opacity);
  div {
    display: flex;
    justify-content: space-between;
  }
`
