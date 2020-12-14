import { COMMUNICATION_WS_URL} from 'constants';


class WsConnection {

  constructor(host, onConnect=null, onDisconnect=null, onMessage=null) {
    this.url = `ws://${host}/${COMMUNICATION_WS_URL}`
    this.onConnectCallback = onConnect
    this.onDisconnectCallback = onDisconnect
    this.onMessage = onMessage
    this.state = {
    }
  }

  setState (state) {
    this.state = {...this.state, ...state}
  }

  connect = () => {
    this.disconnect()
    const newConn = this.initConnection()
    this.setState({connection: newConn})
    return newConn
  }

  sendMessage = ({command, payload}) => {
    const {connection} = this.state;
    connection.send(this.stringifyMessage({command, payload}))
  }


  stringifyMessage = ({command, payload}) => {
    return JSON.stringify({
      command: command, 
      payload: payload
    })
  }

  initConnection = () => {
    const {url} = this
    const protocols = []
    const connection = new WebSocket(url, protocols)
    connection.onclose = this.onClose
    connection.onopen = this.onOpen
    connection.onmessage = this.incomingMessage
    return connection
  }

  incomingMessage = (e) => {
    const data = JSON.parse(e.data)
    const {command, payload} = data
    this.onMessage({command, payload})
  }

  onOpen = () => {
    // callback
    this.onConnectCallback()
  }

  disconnect = () => {
    const { connection } = this.state
    connection && connection.close()
    this.onClose()
  }

  onClose = (...props) => {
    this.onDisconnectCallback()
  }
}

export default WsConnection