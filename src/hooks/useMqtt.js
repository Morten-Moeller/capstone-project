import Paho from 'paho-mqtt'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function useMqtt() {
  const [client, setClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [curRoom, setCurRoom] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  let clientId

  useEffect(() => {
    if (client) {
      client.connect({
        onSuccess: handleSuccess,
        userName: process.env.REACT_APP_MQTT_USERNAME,
        password: process.env.REACT_APP_MQTT_PASSWORD,
      })

      client.onConnectionLost = onConnectionLost
      client.onMessageArrived = onMessageArrived
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  function handleSuccess() {
    setIsConnected(true)
  }

  function connect() {
    clientId = uuidv4()
    setClient(
      new Paho.Client(
        `wss://${
          process.env.REACT_APP_MQTT_USERNAME +
          ':' +
          process.env.REACT_APP_MQTT_PASSWORD
        }@dagame.boschek.eu:1883/mqtt`,
        clientId
      )
    )
  }

  function subscribe(room) {
    client.subscribe(room)
    console.log('Joined room: ' + room)
    setCurRoom(room)
  }

  function unSubscribe() {
    client.unsubscribe(curRoom)
    setCurRoom(null)
  }

  function disconnect() {
    client.disconnect()
    setIsConnected(false)
    console.log('Server disconnected')
  }

  function sendMessage(payload) {
    const { title, body } = payload
    const message = new Paho.Message(body)
    message.destinationName = title
    client.send(message)
  }

  function onConnectionLost(responseObject) {
    setIsConnected(false)
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
    }
  }

  function onMessageArrived(message) {
    setMessages(messages => [message.payloadString, ...messages])
    console.log(message.payloadString)
  }

  return {
    connect,
    disconnect,
    subscribe,
    unSubscribe,
    sendMessage,
    messages,
    clientId,
    isConnected,
  }
}
