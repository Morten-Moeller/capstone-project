import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components/macro'

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    let timer
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      timeLeft < 0 ?? clearTimeout(timer)
    }
    return () => clearTimeout(timer)
  }, [timeLeft])

  return <StyledTimer>{timeLeft}</StyledTimer>
}

const StyledTimer = styled.div`
  font-size: 2.5rem;
  justify-self: center;
`
