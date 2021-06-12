import { useEffect } from 'react'
import { useState } from 'react'

export default function useAudio(url) {
  const [song, setSong] = useState(new Audio(url))
  const [isPlaying, setIsPlaying] = useState(false)

  const [duration, setDuration] = useState(null)

  song.volume = 0.5

  useEffect(() => {
    song.duration && setDuration(Math.round(song.duration))
  }, [song.duration])

  useEffect(() => {
    isPlaying ? song.play() : song.pause()
  }, [isPlaying, song])

  useEffect(() => {
    song.addEventListener('ended', () => setIsPlaying(false))
    return () => song.removeEventListener('ended', () => setIsPlaying(false))
  }, [song])

  function toggle() {
    // workaround for iOS becouse it need a dedicated play action.
    song.play()
    song.pause()
    setIsPlaying(!isPlaying)
  }

  function stop() {
    setIsPlaying(false)
  }

  function setSongUrl(url) {
    setSong(new Audio(url))
  }

  function volume(number) {
    const volume = number / 100
    song.volume = volume
  }

  return { setSongUrl, toggle, stop, isPlaying, duration, volume }
}
