//@ts-check

import { useEffect } from 'react'
import { useState } from 'react'
import useAudio from './useAudio'
import useMqtt from './useMqtt'
import usePlayList from './usePlayList'
import defaultAnswers from '../services/defaultAnswers'

export default function UseMultiplayer() {
  const {
    getNextUrl,
    answers,
    initiateNextSong,
    setNewPlaylist,
    isLoaded,
    counter,
  } = usePlayList(null)

  const {
    setSongUrl,
    toggleAudio,
    stopAudio,
    isPlaying,
    duration,
    changeVolume,
    getCurrentTime,
  } = useAudio()

  const {
    connect,
    disconnect,
    subscribe,
    unSubscribe,
    sendMessage,
    messages,
    clientId,
  } = useMqtt()

  const [isReady, setIsReady] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [isRight, setIsRight] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [room, setRoom] = useState(null)
  const [newAnswers, setNewAnswers] = useState(defaultAnswers)

  useEffect(() => {
    if (isRight) {
      const message = { title: room, body: clientId + ' ' + isRight }
      sendMessage(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRight])

  //message listener
  useEffect(() => {
    switch (true) {
      case /(http:|https:)+[^\s]+[\w]/.test(messages[0]):
        setSongUrl(messages[0].match(/(www|http:|https:)+[^\s]+[\w]/))
        break
      case /(answer)/.test(messages[0]):
        handleAnswers(messages[0])
        break
      default:
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  function handleAnswers(rawAnswers) {
    const reformAnswers = rawAnswers.split(/(answer )/)
    const answers = JSON.parse(reformAnswers[2])
    setNewAnswers(answers)
  }

  function sendAnswers(answers) {
    const answerJson = 'answer ' + JSON.stringify(answers)
    const message = { title: room, body: answerJson }
    sendMessage(message)
  }

  return {
    setIsReady,
    setIsHost,
    setIsRight,
    newAnswers,
    isPlaying,
    duration,
    setSelectedPlaylist,
    setRoom,
  }
}
