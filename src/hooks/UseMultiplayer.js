//@ts-check

import { useEffect, useRef } from 'react'
import { useState } from 'react'
import useMqtt from './useMqtt'
import usePlayList from './usePlayList'

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
  const [allAnswered, setAllAnswered] = useState([])
  const [allSongsStarted, setAllSongsStarted] = useState([])
  const [allReady, setAllReady] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [room, setRoom] = useState(null)
  const [newAnswers, setNewAnswers] = useState()
  const [userName, setUserName] = useState(null)
  const [player, setPlayer] = useState([])
  const [url, setUrl] = useState(null)
  const [isGameEnded, setIsGameEnded] = useState(false)
  const [endScore, setEndScore] = useState([])
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [isLastSong, setIsLastSong] = useState(false)
  const [gameEnded, setGameEnded] = useState([])

  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const isCounter = Boolean(counter)
  const areAllReady = Boolean(
    player.length > 0 &&
      player.length === allReady.filter(el => el.isReady === true).length
  )

  const areAllAnswered = Boolean(
    player.length === allAnswered.length && allAnswered.length > 0
  )

  const areAllEnded = Boolean(
    player.length === endScore.length && endScore.length > 0
  )

  const areAllSongsStarted = Boolean(
    player.length === allSongsStarted.length && allSongsStarted.length > 0
  )

  useEffect(() => {
    connect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNewPlaylist(selectedPlaylist)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist])

  useEffect(() => {
    if (isConnected) {
      subscribe(room)
      request()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  useEffect(() => {
    checkHost()
  }, [player])

  useEffect(() => {
    if (areAllAnswered) {
      if (isHost) {
        sendNextSong()
        sendNextAnswers()
        if (counter === 1) {
          const message = { title: room, body: 'noMoreSongs' }
          sendMessage(message)
        }
      }
      setAllAnswered([])
      setAllSongsStarted([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllAnswered])

  useEffect(() => {
    if (areAllSongsStarted) {
    }
  }, [areAllSongsStarted])

  useEffect(() => {
    //send first song

    if (isLoaded) {
      if (isHost) {
        sendNextSong()
        sendNextAnswers()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllReady === true])

  useEffect(() => {
    if (areAllEnded) {
      setTimeout(() => {
        setIsGameEnded(true)
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endScore])

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
        case /(endScore)/.test(messages[0]):
          handleEndScore(messages[0])
          break
        case /(gameEnded)/.test(messages[0]):
          handleGameEnded(messages[0])
          break
        case /(songStarted)/.test(messages[0]):
          handleSongStarted(messages[0])
          break
        case /(gameRunning)/.test(messages[0]):
          setIsGameRunning(true)
          break
        case /(noMoreSong)/.test(messages[0]):
          setIsLastSong(true)
          break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  function handleSongStarted(rawMessage) {
    const messageArray = rawMessage.split(',')
    const user = messageArray[1]

    setAllSongsStarted([...allSongsStarted, { user }])
  }

  function handleGameEnded(rawMessage) {
    const messageArray = rawMessage.split(',')
    setGameEnded([
      ...gameEnded,
      {
        player: messageArray[1],
      },
    ])
  }

  function handleEndScore(rawMessage) {
    const messageArray = rawMessage.split(',')
    if (!endScore.some(({ player }) => player === messageArray[1])) {
      setEndScore([
        ...endScore,
        {
          player: messageArray[1],
          score: messageArray[2],
        },
      ])
    }
  }

  function handleRight(rawMessage) {
    const messageArray = rawMessage.split(/(isRight)/)
    console.log(messageArray)
    const userName = messageArray[2]
    setAllAnswered([...allAnswered, { user: userName, isRight: true }])
  }

  function handleWrong(rawMessage) {
    const messageArray = rawMessage.split(/(isWrong)/)
    const userName = messageArray[2]
    setAllAnswered([...allAnswered, { user: userName, isRight: false }])
  }

  function handleIsReady(rawMessage) {
    const messageArray = rawMessage.split(/(isReady)/)
    const userName = messageArray[2]
    setAllReady([...allReady, { user: userName, isReady: true }])
  }

  function handlePlayer(rawMessage) {
    console.log(areAllReady)
    if (!areAllReady) {
      const messageArray = rawMessage.split(/(here)/)
      const newPlayer = messageArray[2]
      if (!player.includes(newPlayer)) {
        setPlayer([...player, newPlayer])
      }
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
      if (areAllReady) {
        const message = { title: room, body: 'gameRunning' }
        sendMessage(message)
      }
    }
  }

  function setReady() {
    if (!isReady) {
      const message = { title: room, body: 'isReady' + userName }
      sendMessage(message)
      setIsReady(true)
      // initiateNextSong()
    }
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
    if (isCounter) {
      const message = { title: room, body: url }
      sendMessage(message)
    }
  }

  function handleIsRight(bool) {
    let message
    if (bool) {
      message = { title: room, body: 'isRight' + userName }
    } else if (!bool) {
      message = { title: room, body: 'isWrong' + userName }
    }
    sendMessage(message)
  }

  function sendNextSong() {
    if (isConnected && isHost) {
      console.log('sendUrl')
      const newUrl = getNextUrl()
      sendUrl(newUrl)
    }
  }

  function sendNextAnswers() {
    if (answers) {
      sendAnswers(answers)
    }
  }

  function handleEndGame() {
    const message = { title: room, body: 'gameEnded,' + userName }
    sendMessage(message)
  }

  function songStarted() {
    const message = { title: room, body: 'songStarted,' + userName }
    sendMessage(message)
  }

  function sendScore(score) {
    const message = { title: room, body: 'endScore,' + userName + ',' + score }
    sendMessage(message)
  }

  return {
    setReady,
    setUserName,
    setSelectedPlaylist,
    setRoom,
    isReady,
    isGameRunning,
    isGameEnded,
    isLoaded,
    isLastSong,
    areAllReady,
    areAllEnded,
    areAllAnswered,
    allReady,
    allAnswered,
    handleIsRight,
    handleEndGame,
    newAnswers,
    player,
    endScore,
    initiateNextSong,
    url,
    songStarted,
    sendScore,
    gameEnded,
  }
}
