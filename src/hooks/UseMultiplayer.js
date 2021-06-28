//@ts-check

import { useEffect, useRef } from 'react'
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
    isConnected,
  } = useMqtt()

  const [isReady, setIsReady] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [isRight, setIsRight] = useState(false)
  const [allAnswers, setAllAnswers] = useState([])
  const [allReady, setAllReady] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [room, setRoom] = useState(null)
  const [newAnswers, setNewAnswers] = useState(defaultAnswers)
  const [userName, setUserName] = useState(null)
  const [player, setPlayer] = useState([])
  const [url, setUrl] = useState(null)
  const isCounter = Boolean(counter)
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const areAllReady = Boolean(
    player.length === allReady.filter(el => el.isReady === true).length
  )

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
      request()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  useEffect(() => {
    if (isHost) {
      initiateNextSong()
    }
  }, [areAllReady === true])

  useEffect(() => {
    if (isConnected && isHost) {
      sendUrl(getNextUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady === true])

  useEffect(() => {
    checkHost()
  }, [player])

  useEffect(() => {
    if (answers && isConnected && isHost) {
      sendAnswers(answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllReady === true])

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
        case /(anybody)/.test(messages[0]):
          handleRequest()
          break
        case /(here)/.test(messages[0]):
          handlePlayer(messages[0])
          break
        case /(isReady)/.test(messages[0]):
          handleIsReady(messages[0])
          break
        case /(isWrong)/.test(messages[0]):
          handleWrong(messages[0])
          break
        case /(isRight)/.test(messages[0]):
          handleRight(messages[0])
          break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  function handleRight(rawMessage) {
    const messageArray = rawMessage.split(/(isRight)/)
    console.log(messageArray)
    const userName = messageArray[2]
    setAllAnswers([...allAnswers, { user: userName, isRight: true }])
  }

  function handleWrong(rawMessage) {
    const messageArray = rawMessage.split(/(isWrong)/)
    const userName = messageArray[2]
    setAllAnswers([...allAnswers, { user: userName, isRight: false }])
  }

  function handleIsReady(rawMessage) {
    const messageArray = rawMessage.split(/(isReady)/)
    const userName = messageArray[2]
    setAllReady([...allReady, { user: userName, isReady: true }])
  }

  function handlePlayer(rawMessage) {
    const messageArray = rawMessage.split(/(here)/)
    const newPlayer = messageArray[2]
    if (!player.includes(newPlayer)) {
      setPlayer([...player, newPlayer])
    }
  }

  function checkHost() {
    setTimeout(() => {
      const isHostAssigned = messagesRef.current.includes('host')

      if (!isHostAssigned) {
        setIsHost(true)
      }
    }, 1000)
  }

  function request() {
    const requestMessage = { title: room, body: 'anybody' }
    sendMessage(requestMessage)
  }

  function handleRequest() {
    const answer = { title: room, body: 'here' + userName }
    sendMessage(answer)
    if (isHost) {
      const answerHost = { title: room, body: 'host' }
      sendMessage(answerHost)
    }
  }

  function setReady() {
    const message = { title: room, body: 'isReady' + userName }
    sendMessage(message)
    setIsReady(true)
    initiateNextSong()
  }

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

  function sendUrl(url) {
    const message = { title: room, body: url }
    sendMessage(message)
  }

  function handleIsRight(bool) {
    setIsRight(bool)
    console.log(bool)
    let message
    if (bool) {
      message = { title: room, body: 'isRight' + userName }
    } else if (!bool) {
      message = { title: room, body: 'isWrong' + userName }
    }
    sendMessage(message)
  }

  return {
    setReady,
    allReady,
    areAllReady,
    allAnswers,
    handleIsRight,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    newAnswers,
    player,
    isLoaded,
    isCounter,
    url,
    disconnect,
    unSubscribe,
  }
}
