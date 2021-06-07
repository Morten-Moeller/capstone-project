import { useEffect } from 'react'
import { useState } from 'react'

export default function useAudio(url) {
  const [song, setSong] = useState(new Audio(url))
  const [playing, setPlaying] = useState(false)

  const [duration, setDuration] = useState(30)

  useEffect(() => {
    song.duration && setDuration(Math.round(song.duration))
  }, [song])

  useEffect(() => {
    playing ? song.play() : song.pause()
  }, [playing, song])

  useEffect(() => {
    song.addEventListener('ended', () => setPlaying(false))
    return () => song.removeEventListener('ended', () => setPlaying(false))
  }, [song])

  function toggle() {
    // workaround for iOS becouse it need a dedicated play action.
    song.play()
    song.pause()
    setPlaying(!playing)
  }

  function stop() {
    setPlaying(false)
  }

  function songUrl(url) {
    setSong(new Audio(url))
  }

  return { songUrl: () => songUrl(url), toggle, stop, playing, duration }
}
