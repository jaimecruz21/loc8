import {SERVER_HOST} from 'constants'
import WSConnection from './api/ws'
import {
  AUTH_COMMAND,
  SUBSCRIBE_COMMAND,
  DETECTION_COMMAND,
  UNSUBSCRIBE_COMMAND
} from './commands'


const CALLBACKS = new Set([
  'onDetectionEvent',
  'onSubscribeEvent',
  'onUnsubscribeEvent',
  'onChangeStateEvent'
])


class Loc8 {
  constructor(){
    // Entry to the app
    this.clientToken = null;
    this.host = null;
    this.state = {
      wsConnection: {connected: false, authorized: false},
    }
    this.connection = null
    this.incomingMessageHandlers = {
      [AUTH_COMMAND]: [this.onAuthCommand],
      [DETECTION_COMMAND]: [this.detectionEvent],
      [SUBSCRIBE_COMMAND]: [this.subscribeEvent],
      [UNSUBSCRIBE_COMMAND]: [this.unsubscribeEvent]
    }
    this.hubSubscriptions = new Set()
  }

  updateCallbacks = (callbacks) => {
      Object.keys(callbacks).filter((key)=>CALLBACKS.has(key)).map(
        (key)=>this[key] = callbacks[key]
      )
  }

  subscribeEvent = (...props) => {
    this.onSubscribeEvent && this.onSubscribeEvent(...props)
  }

  unsubscribeEvent = (...props) => {
    this.onUnsubscribeEvent && this.onUnsubscribeEvent(...props)
  }

  detectionEvent = (...props) => {
    // attachable callback
    this.onDetectionEvent && this.onDetectionEvent(...props)
  }

  subscribeHub = (hubId) => {
    this.hubSubscriptions.add(hubId)
    this.sendMessage({command: SUBSCRIBE_COMMAND, payload: {hubId: hubId}})
  }

  unsubscribeHub = (hubId) => {
    this.hubSubscriptions.delete(hubId)
    this.sendMessage({command: UNSUBSCRIBE_COMMAND, payload: {hubId: hubId}})
  }

  onAuthCommand = ({payload}) => {
    const {authorized} = payload
    const {wsConnection} = this.state
    this.setState({wsConnection: {...wsConnection, authorized: authorized}})
  }

  setState = (state) => {
    this.state = {...this.state , ...state}
    this.onChangeStateEvent(this.state)
  }

  onChangeWsConnection = (state) => {
    const {wsConnection} = this.state;
    this.setState({wsConnection:{...wsConnection, ...state}})
  }

  authorize = (token) => {
    this.clientToken = token
    this.sendMessage({command: AUTH_COMMAND, payload: {token: token}})
  }

  sendMessage = ({command, payload}) => {
    const {connection} = this
    connection.sendMessage({command, payload})
  }

  onMessage = ({command, payload}) => {
    console.log('incoming message from server', command, payload)
    const {incomingMessageHandlers} = this;
    const handlers = incomingMessageHandlers[command] || []
    // in the future put this to async/await possible
    handlers.map((fn) => fn({command, payload}))
  }

  subscribe = (map) => {
    console.log('subscribe', map)
  }

  connect = () => {
    this.connection?.disconnect()
    this.connection = new WSConnection(
      SERVER_HOST,
      //onConnect
      (...props) => this.onWsConnected(...props),
      //onDisconnect
      (...props) => this.onWsDisconnected(...props),
      //onMessage
      (...props) => this.onMessage(...props)
    )
    this.connection.connect()
  }

  onWsConnected = () => {
    const {clientToken} = this;
    // update connection state
    this.onChangeWsConnection({connected: true})
    // authorize socket connection
    clientToken && this.authorize(clientToken)
  }

  onWsDisconnected = () => {
    this.onChangeWsConnection({connected: false})
  }

  disconnect = () => {
    this.connection?.disconnect()
  }
}

const Loc8lib = {
  init: (params={}) => {
    const app = new Loc8(params)
    return app
  }
}

export default Loc8lib;
