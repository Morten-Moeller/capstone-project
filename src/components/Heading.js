//@ts-check
import styled from 'styled-components/macro'

export default function Heading({ children }) {
  return <Headline>{children}</Headline>
}

const Headline = styled.h1`
  font: 300;
  font-size: 1.75rem;
`
