import { useEffect } from 'react'
import { useState } from 'react'

export default function useAudio(url) {
  const [song] = useState(new Audio(url))
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    playing ? song.play() : song.pause()
  }, [playing])

  useEffect(() => {
    song.addEventListener('ended', () => setPlaying(false))
    return () => song.removeEventListener('ended', () => setPlaying(false))
  }, [])

  function toggle() {
    setPlaying(!playing)
  }

  function stop() {
    setPlaying(false)
  }

  return [playing, toggle, stop]
}
