import React, {useState, useEffect} from 'react'
import Loc8 from 'lib'

import AuthForm from './components/authForm'


const mainScreen = (props) => {
  
  const [connected, setConnected] = useState(false)
  const [loc8, setLoc8] = useState()
  // Initialize loc8
  useEffect(()=> {
    const loc8 = Loc8.init({
      onChangeState: onChangeState
    });
    setLoc8(loc8)
  }, [])

  const onChangeState = ({wsConnection, ...props}) => {
    console.log('change state', wsConnection, props)
    const {connected} = wsConnection;
    setConnected(connected)
  }

  const authFormSubmit = ({token, ...props}) => {
    loc8.authorize(token)
    !connected && loc8.connect()
  }

  const disconnect = () => {
    connected && loc8.disconnect()
  }

  return <>
    <AuthForm
      onSubmit={authFormSubmit}
      connected={connected}
      disconnect={disconnect}
      />
  </>
}

export default mainScreen;