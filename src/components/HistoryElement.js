//@ts-check
import styled from 'styled-components/macro'
import PropType from 'prop-types'

HistoryElement.propTypes = {
  history: PropType.shape({
    playerName: PropType.string,
    score: PropType.number,
    date: PropType.string,
    playlistName: PropType.string,
  }),
}

export default function HistoryElement({
  history: { playerName, score, date, playlistName },
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

  div {
    display: flex;
    justify-content: space-between;
  }
`
