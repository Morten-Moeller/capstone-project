import { useEffect, useReducer } from 'react'

const keysReducer = (state, action) => {
  switch (action.type) {
    case 'SET_KEY_DOWN':
      const keyDownState = { ...state, [action.key]: true }
      return keyDownState
    case 'SET_KEY_UP':
      const keyUpState = { ...state, [action.key]: false }
      return keyUpState
    case 'RESET_KEY':
      const resetState = { ...action.data }
      return resetState
    default:
      return state
  }
}

const useShortcut = (shortcutKeys, callback) => {
  const initalKeyMapping = shortcutKeys.reduce((currentKeys, key) => {
    currentKeys[key.toLowerCase()] = false
    return currentKeys
  }, {})

  const [keys, setKeys] = useReducer(keysReducer, initalKeyMapping)

  const keyDownListener = assignedKey => keyDownEvent => {
    const loweredKey = assignedKey.toLowerCase()

    if (keyDownEvent.repeat) return
    if (loweredKey !== keyDownEvent.key.toLowerCase()) return

    setKeys({ type: 'SET_KEY_DOWN', key: loweredKey })
  }

  const keyUpListener = assignedKey => keyUpEvent => {
    const raisedKey = assignedKey.toLowerCase()

    if (keyUpEvent.key.toLowerCase() !== raisedKey) return

    setKeys({ type: 'SET_KEY_UP', key: raisedKey })
    return false
  }

  useEffect(() => {
    if (!Object.values(keys).some(value => !value)) {
      callback(keys)
      setKeys({ type: 'RESET_KEY', data: initalKeyMapping })
    } else {
      setKeys({ type: null })
    }
  }, [callback, keys])

  useEffect(() => {
    shortcutKeys.forEach(k => {
      window.addEventListener('keydown', keyDownListener(k))
      window.addEventListener('keyup', keyUpListener(k))
    })
    return () => {
      shortcutKeys.forEach(k => {
        window.removeEventListener('keydown', keyDownListener(k))
        window.removeEventListener('keyup', keyUpListener(k))
      })
    }
  }, [])
}

export default useShortcut
