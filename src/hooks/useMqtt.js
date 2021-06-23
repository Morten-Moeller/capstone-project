import Paho from 'paho-mqtt'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function useMqtt() {
  const [client, setClient] = useState(null)
  const [messages, setMessages] = useState([])

  function connect() {
    const clientId = uuidv4()
    setClient(new Paho.Client('dagame.boschek.eu', 1883, clientId))
  }

  useEffect(() => {
    if (client) {
      client.connect({
        onSuccess: onConnect,
        userName: process.env.REACT_APP_MQTT_USERNAME,
        password: process.env.REACT_APP_MQTT_PASSWORD,
      })

      // set callback handlers
      client.onConnectionLost = onConnectionLost
      client.onMessageArrived = onMessageArrived
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log('onConnect')
  }

  function subscribe(room) {
    client.subscribe(room)
  }

  function sendMessage(payload) {
    const { title, body } = payload
    const message = new Paho.Message(body)
    message.destinationName = title
    client.send(message)
  }
  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    setMessages([message.payloadString, ...messages])
  }

  return { sendMessage, subscribe, connect, messages }
}
