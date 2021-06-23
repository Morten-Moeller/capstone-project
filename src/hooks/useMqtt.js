import Paho from 'paho-mqtt'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function useMqtt() {
  const [client, setClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [curRoom, setCurRoom] = useState(null)

  useEffect(() => {
    if (client) {
      client.connect({
        onSuccess: console.log('Connected'),
        userName: process.env.REACT_APP_MQTT_USERNAME,
        password: process.env.REACT_APP_MQTT_PASSWORD,
      })

      client.onConnectionLost = onConnectionLost
      client.onMessageArrived = onMessageArrived
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  function connect() {
    const clientId = uuidv4()
    setClient(new Paho.Client('dagame.boschek.eu', 1883, clientId))
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
    console.log('Server disconnected')
  }

  function sendMessage(payload) {
    const { title, body } = payload
    const message = new Paho.Message(body)
    message.destinationName = title
    client.send(message)
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
    }
  }

  function onMessageArrived(message) {
    setMessages([message.payloadString, ...messages])
  }

  return { connect, disconnect, subscribe, unSubscribe, sendMessage, messages }
}
