// @ts-check
import { useEffect } from 'react'
import { useState } from 'react'

export default function useAudio(url) {
  const [song, setSong] = useState(new Audio(url))
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    song.volume = volume
  }, [volume, song])

  useEffect(() => {
    if (song.duration) {
      setDuration(Math.round(song.duration))
    }
  }, [song.duration])

  useEffect(() => {
    if (isPlaying) {
      song.play()
    } else {
      song.pause()
    }
  }, [isPlaying, song])

  useEffect(() => {
    song.addEventListener('ended', () => setIsPlaying(false))
    return () => song.removeEventListener('ended', () => setIsPlaying(false))
  }, [song])

  function toggleAudio() {
    song.play() // workaround for iOS because it need a dedicated play action.
    song.pause() // workaround for iOS because it need a dedicated play action.
    setIsPlaying(!isPlaying)
  }

  function stopAudio() {
    setIsPlaying(false)
  }

  function setSongUrl(url) {
    setSong(new Audio(url))
  }

  function changeVolume(number) {
    const volume = number / 100
    setVolume(volume)
  }

  function getCurrentTime() {
    return song.currentTime
  }

  return {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
    getCurrentTime,
  }
}
