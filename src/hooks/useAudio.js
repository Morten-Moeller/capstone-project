import { useEffect } from 'react'
import { useState } from 'react'

export default function useAudio(url) {
  const [song, setSong] = useState(new Audio(url))
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    playing ? song.play() : song.pause()
  }, [playing, song])

  useEffect(() => {
    song.addEventListener('ended', () => setPlaying(false))
    return () => song.removeEventListener('ended', () => setPlaying(false))
  }, [song])

  function toggle() {
    setPlaying(!playing)
  }

  function stop() {
    setPlaying(false)
  }

  function songUrl(url) {
    setSong(new Audio(url))
  }

  return [() => songUrl(url), toggle, stop, playing]
}
