import React, {useState, useEffect} from 'react'
import Loc8 from 'lib'

import AuthForm from './components/authForm'
import SubscribeForm from './components/subscribeForm'


const mainScreen = (props) => {
  
  const [connected, setConnected] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loc8, setLoc8] = useState()
  // Initialize loc8
  useEffect(()=> {
    const loc8 = Loc8.init({
      onChangeState: onChangeState
    });
    setLoc8(loc8)
    loc8.onDetectionEvent = onDetectionEvent
  }, [])

  const onDetectionEvent = (...props) => {
    console.log('detection event', props)
  }

  const onChangeState = ({wsConnection, ...props}) => {
    const {connected, authorized} = wsConnection;
    setConnected(connected)
    setAuthorized(authorized)
  }

  const authFormSubmit = ({token, ...props}) => {
    !connected && loc8.connect()
    connected && loc8.authorize(token)
  }

  const disconnect = () => {
    connected && loc8.disconnect()
  }

  const onHubSubscribe = ({hubId}) => {
    loc8.subscribeHub(hubId)
  }

  return <>
    <AuthForm
      onSubmit={authFormSubmit}
      connected={connected}
      disconnect={disconnect}
      authorized={authorized}
    />
    {
      connected && authorized ? <SubscribeForm onSubmit={onHubSubscribe} /> : null
    }
    
  </>
}

export default mainScreen;