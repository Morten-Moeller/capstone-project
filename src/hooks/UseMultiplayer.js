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
  const [isHost, setIsHost] = useState(null)
  const [isRight, setIsRight] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [room, setRoom] = useState(null)
  const [newAnswers, setNewAnswers] = useState(defaultAnswers)
  const [userName, setUserName] = useState(null)
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    setNewPlaylist(selectedPlaylist)
    connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    subscribe(room)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect])

  // host ping
  useEffect(() => {
    let interval
    if (isHost) {
      const message = { title: room, body: 'HostIsTaken' }
      sendMessage(message)
    }
    if (isHost === null) {
      interval = setInterval(sendIsHost, 1000)
    } else {
      clearInterval(interval)
    }
    return clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost])

  useEffect(() => {
    sendUrl(getNextUrl)
  }, [getNextUrl])

  useEffect(() => {
    if (answers) {
      sendAnswers(answers)
    }
  }, [answers])

  useEffect(() => {
    if (isRight) {
      const message = { title: room, body: clientId + ',' + isRight }
      sendMessage(message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRight])

  //message listener
  useEffect(() => {
    switch (true) {
      case /(http:|https:)+[^\s]+[\w]/.test(messages[0].body):
        setSongUrl(messages[0].body.match(/(www|http:|https:)+[^\s]+[\w]/))
        break
      case /(answer)/.test(messages[0].body):
        handleAnswers(messages[0].body)
        break
      case /(isReady)/.test(messages[0].body):
        handleIsReady(messages[0].body)
        break
      case /(hostIsTaken)/.test(messages[0].body):
        handleHost()
        break
      default:
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  function handleHost() {
    if (!isHost) setIsHost(false)
  }

  function handleAnswers(rawAnswers) {
    const reformAnswers = rawAnswers.split(/(answer )/)
    const answers = JSON.parse(reformAnswers[2])
    setNewAnswers(answers)
  }

  function handleIsReady(rawMessage) {
    const reformMessage = rawMessage.split(/(isAnswer)/)
    const messageParts = reformMessage[2].split(',')
    const playerName = messageParts[0]
    const playerIsReady = messageParts[1]
    console.log(playerName)
    console.log(playerIsReady)

    setPlayer([
      ...player,
      { playerName, playerIsReady: JSON.parse(playerIsReady) },
    ])
  }

  function sendAnswers(answers) {
    const answerJson = 'answer ' + JSON.stringify(answers)
    const message = { title: room, body: answerJson }
    sendMessage(message)
  }

  function sendUrl(url) {
    const message = { title: room, body: url }
    sendMessage(message)
  }

  function sendIsHost() {
    if (isHost === null) {
      const message = { title: room, body: 'noHost' }
      sendMessage(message)
    }

    function sendIsReady() {
      const message = {
        title: room,
        body: 'isReady' + userName + ',' + isReady,
      }
      sendMessage(message)
    }
  }

  return {
    setIsReady,
    setIsHost,
    setIsRight,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    newAnswers,
    isPlaying,
    duration,
    player,
    toggleAudio,
    stopAudio,
    isLoaded,
    initiateNextSong,
  }
}
