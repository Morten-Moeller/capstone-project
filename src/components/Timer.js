import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components/macro'
import PropTypes from 'prop-types'

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
}

export default function Timer({ duration }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    let timer
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [timeLeft, duration])

  return <StyledTimer>{timeLeft}</StyledTimer>
}

const StyledTimer = styled.div`
  font-size: 2.5rem;
  justify-self: center;
`
