//@ts-check

import { useEffect, useRef, useState } from 'react'
import useMqtt from './useMqtt'
import usePlayList from './usePlayList'

export default function UseMultiplayer() {
  const {
    answers,
    counter,
    getNextUrl,
    initiateNextSong,
    isLoaded,
    setNewPlaylist,
  } = usePlayList(null)

  const {
    connect,
    curRoom,
    isConnected,
    messages,
    sendMessage,
    sendMessageString,
    setCurRoom,
    subscribe,
    unSubscribe,
  } = useMqtt()

  const [allAnswered, setAllAnswered] = useState([])
  const [allReady, setAllReady] = useState([])
  const [allSongsStarted, setAllSongsStarted] = useState([])
  const [endScore, setEndScore] = useState([])
  const [gameEnded, setGameEnded] = useState([])
  const [isGameEnded, setIsGameEnded] = useState(false)
  const [isGameRunning, setIsGameRunning] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [hostName, setHostName] = useState(null)
  const [isLastSong, setIsLastSong] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [newAnswers, setNewAnswers] = useState()
  const [player, setPlayer] = useState([])
  const [playerCheck, setPlayerCheck] = useState([])
  const [playlistName, setPlaylistName] = useState('Loaded')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [url, setUrl] = useState(null)
  const [userName, setUserName] = useState(null)
  const playerCheckRef = useRef(playerCheck)
  playerCheckRef.current = playerCheck
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

  useEffect(() => {
    if (!isConnected) {
      connect()
    }

    //warn player bevor reload
    window.addEventListener('beforeunload', handlePageQuit)
    return () => {
      window.removeEventListener('beforeunload', handlePageQuit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNewPlaylist(selectedPlaylist)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist])

  useEffect(() => {
    if (isConnected) {
      subscribe(curRoom)
      sendMessageString('anybody')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  useEffect(() => {
    handleHost()
  }, [player])

  useEffect(() => {
    if (areAllAnswered) {
      if (isHost) {
        sendNextSong()
        sendNextAnswers()
        if (counter === 1) {
          const message = { title: curRoom, body: 'noMoreSongs' }
          sendMessage(message)
        }
      }
      setAllAnswered([])
      setAllSongsStarted([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areAllAnswered])

  useEffect(() => {
    //send first song

    if (isLoaded) {
      if (isHost) {
        sendNextSong()
        sendNextAnswers()
        sendMessageString('iAmSparta,' + userName)
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

  useEffect(() => {
    setTimeout(handleKick, 5000)
  }, [playerCheck])

  // ----------- message listener -----------
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
        case /(Playlist)/.test(messages[0]):
          handlePlaylistName(messages[0])
          break
        case /(quit)/.test(messages[0]):
          handleQuit(messages[0])
          break
        case /(check)/.test(messages[0]):
          handleCheck(messages[0])
          break
        case /(iAmSparta)/.test(messages[0]):
          handleHostName(messages[0])
          break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  function handleKick() {
    console.log(playerCheckRef.current)
    console.log(player)
    if (playerCheckRef.current.length > 0) {
      const userToRemove = player.filter(user => {
        if (playerCheckRef.current.some(checkUser => user === checkUser)) {
          console.log(false)
          return ''
        } else {
          console.log(true)
          return user
        }
      })

      if (userToRemove.some(user => user === hostName)) {
        setIsGameEnded(true)
      }

      userToRemove.forEach(userRemove => {
        setPlayer(player.filter(el => el !== userRemove))
        setAllReady(allReady.filter(({ user }) => user !== userRemove))
        setAllSongsStarted(allReady.filter(({ user }) => user !== userRemove))
      })

      setPlayerCheck([])
    }
  }

  // ---------- handler functions for server messages ---------

  function handleHostName(rawMessage) {
    const messageArray = rawMessage.split(',')
    setHostName(messageArray[1])
  }

  function handleCheck(rawMessage) {
    const messageArray = rawMessage.split(',')
    setPlayerCheck([...playerCheck, messageArray[1]])
  }

  function handlePageQuit(event) {
    event.preventDefault()
  }

  function handleQuit(rawMessage) {
    const messageArray = rawMessage.split(',')
    const userToRemove = messageArray[1]
    if (messageArray[2] === 'host') {
      setIsGameEnded(true)
    }
    setPlayer(player.filter(el => el !== userToRemove))
    setAllReady(allReady.filter(({ user }) => user !== userToRemove))
    setAllSongsStarted(allReady.filter(({ user }) => user !== userToRemove))
  }

  function handlePlaylistName(rawMessage) {
    const messageArray = rawMessage.split(',')
    if (!isHost) {
      setPlaylistName(messageArray[1])
    }
  }

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

  function handleHost() {
    setTimeout(() => {
      const isHostAssigned = messagesRef.current.includes('host')

      if (!isHostAssigned) {
        setIsHost(true)
      }
    }, 1000)
  }

  function handleRequest() {
    sendMessageString('here' + userName)

    if (isHost) {
      sendPlaylistName(playlistName)
      sendMessageString('host')
      if (areAllReady) {
        sendMessageString('gameRunning')
      }
    }
  }

  function handleAnswers(rawAnswers) {
    const answerArray = rawAnswers.split(';')

    const answers = JSON.parse(answerArray[1])
    setNewAnswers(answers)
  }

  // --------- send functions to submit messages -----------

  function sendReady() {
    if (!isReady) {
      sendMessageString('isReady' + userName)
      setIsReady(true)
    }
  }

  function sendAnswers(answers) {
    const answerJson = 'answer;' + JSON.stringify(answers)
    sendMessageString(answerJson)
  }

  function sendUrl(url) {
    if (isCounter) {
      sendMessageString(url)
    }
  }

  function sendIsRight(bool) {
    let message
    if (bool) {
      message = { title: curRoom, body: 'isRight' + userName }
    } else if (!bool) {
      message = { title: curRoom, body: 'isWrong' + userName }
    }
    sendMessage(message)
  }

  function sendNextSong() {
    if (isConnected && isHost) {
      const newUrl = getNextUrl()
      sendUrl(newUrl)
    }
  }

  function sendNextAnswers() {
    if (answers) {
      sendAnswers(answers)
    }
  }

  function sendEndGame() {
    sendMessageString('gameEnded,' + userName)
  }

  function sendSongStarted() {
    sendMessageString('songStarted,' + userName)
  }

  function sendScore(score) {
    sendMessageString('endScore,' + userName + ',' + score)
  }

  function sendPlaylistName(playlistName) {
    if (isHost) {
      sendMessageString('Playlist,' + playlistName)
    }
  }

  function sendQuit() {
    sendMessageString('quit,' + userName)
    if (isHost) {
      sendMessageString('quit,' + userName + ',host')
    }
  }

  function sendPlayerCheck() {
    sendMessageString('check,' + userName)
  }

  return {
    allAnswered,
    allReady,
    areAllAnswered,
    areAllEnded,
    areAllReady,
    endScore,
    gameEnded,
    sendPlayerCheck,
    initiateNextSong,
    isGameEnded,
    isGameRunning,
    isLastSong,
    isLoaded,
    isReady,
    newAnswers,
    player,
    playlistName,
    sendEndGame,
    sendIsRight,
    sendQuit,
    sendReady,
    sendScore,
    sendSongStarted,
    setCurRoom,
    setPlaylistName,
    setSelectedPlaylist,
    setUserName,
    unSubscribe,
    url,
  }
}
