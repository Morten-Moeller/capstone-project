//@ts-check

import { useEffect } from 'react'
import { useState } from 'react'
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
    connect,
    disconnect,
    subscribe,
    unSubscribe,
    sendMessage,
    messages,
    clientId,
    isConnected,
    lastMessage,
  } = useMqtt()

  const [isReady, setIsReady] = useState(false)
  const [isHost, setIsHost] = useState(null)
  const [isRight, setIsRight] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [room, setRoom] = useState(null)
  const [newAnswers, setNewAnswers] = useState(defaultAnswers)
  const [userName, setUserName] = useState(null)
  const [player, setPlayer] = useState(null)
  const [url, setUrl] = useState(null)
  const isCounter = Boolean(counter)

  useEffect(() => {
    connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNewPlaylist(selectedPlaylist)
  }, [selectedPlaylist])

  useEffect(() => {
    if (isConnected) {
      subscribe(room)
      sendMessage({ title: room, body: 'Goliat online' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  // host ping
  // useEffect(() => {
  //   let interval
  //   if (isHost && isConnected) {
  //     const message = { title: room, body: 'HostIsTaken' }
  //     sendMessage(message)
  //   }
  //   if (isHost === null && isConnected) {
  //     interval = setInterval(sendIsHost, 1000)
  //   } else {
  //     clearInterval(interval)
  //   }
  //   return clearInterval(interval)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isHost, isConnected])

  useEffect(() => {
    console.log(newAnswers)
  }, [newAnswers])

  useEffect(() => {
    initiateNextSong()
  }, [isReady])

  useEffect(() => {
    if (isConnected) {
      sendUrl(getNextUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNextUrl])

  useEffect(() => {
    console.log(answers)
    if (answers && isConnected) {
      sendAnswers(answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, isConnected])

  // useEffect(() => {
  //   if (isRight) {
  //     const message = { title: room, body: clientId + ',' + isRight }
  //     sendMessage(message)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isRight])

  //message listener
  useEffect(() => {
    if (messages[0] && isConnected) {
      switch (true) {
        case /(http:|https:)+[^\s]+[\w]/.test(messages[0]):
          setUrl(messages[0])
          break
        case /(answer)/.test(messages[0]):
          handleAnswers(messages[0])
          break
        // case /(isReady)/.test(messages[0]):
        //   handleIsReady(messages[0])
        //   break
        // case /(hostIsTaken)/.test(messages[0]):
        //   handleHost()
        //   break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // function handleHost() {
  //   if (!isHost) setIsHost(false)
  // }

  function handleAnswers(rawAnswers) {
    const reformAnswers = rawAnswers.split(/(answer )/)
    const answers = JSON.parse(reformAnswers[2])
    setNewAnswers(answers)
  }

  // function handleIsReady(rawMessage) {
  //   const reformMessage = rawMessage.split(/(isAnswer)/)
  //   const messageParts = reformMessage[2].split(',')
  //   const playerName = messageParts[0]
  //   const playerIsReady = messageParts[1]
  //   console.log(playerName)
  //   console.log(playerIsReady)

  //   setPlayer([
  //     ...player,
  //     { playerName, playerIsReady: JSON.parse(playerIsReady) },
  //   ])
  // }

  function sendAnswers(answers) {
    const answerJson = 'answer ' + JSON.stringify(answers)
    const message = { title: room, body: answerJson }
    sendMessage(message)
  }

  function sendUrl(url) {
    const message = { title: room, body: url }
    sendMessage(message)
  }

  // function sendIsHost() {
  //   const message = { title: room, body: 'noHost' }
  //   sendMessage(message)
  // }

  // function sendIsReady() {
  //   const message = {
  //     title: room,
  //     body: 'isReady' + userName + ',' + isReady,
  //   }
  //   sendMessage(message)
  // }

  return {
    setIsReady,
    setIsHost,
    setIsRight,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    newAnswers,
    player,
    isLoaded,
    initiateNextSong,
    isCounter,
    url,
  }
}
