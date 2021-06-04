import styled from 'styled-components/macro'
import useAudio from '../hooks/useAudio'
import Button from './Button'

export default function PlayButton({ children, url }) {
  const [songUrl, toggle] = useAudio(url)

  return <StyledButton>{children}</StyledButton>
}

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
  font-size: 3rem;
  width: 72px;
  height: 72px;
  padding-bottom: 7px;
`
