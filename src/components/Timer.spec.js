import { render, screen } from '@testing-library/react'
import Timer from './Timer'
import { act } from 'react-dom/test-utils'

describe('Timer', () => {
  it('count to 0 and dont count below', () => {
    jest.useFakeTimers()
    act(() => {
      render(<Timer duration={1} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      jest.runAllTimers()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
