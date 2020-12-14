import React, {useState, useEffect, useCallback} from 'react'
import Loc8 from 'lib'
import {Row, Col} from 'antd'
import AuthForm from './components/authForm'
import SubscribeForm from './components/subscribeForm'
import DetectionsList from './components/detectionsList'


const mainScreen = (props) => {
  
  const [connected, setConnected] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loc8, setLoc8] = useState()
  const [hubSubscriptions, setHubSubscriptions] = useState({})
  // Initialize loc8
  useEffect(()=> {
    initLoc8()
  }, [])

  const initLoc8 = () => {
    const loc8 = Loc8.init({
      onChangeState: onChangeState,
      onSubscribeEvent: onSubscribeEvent
    });
    setLoc8(loc8)
    loc8.onDetectionEvent = onDetectionEvent
  }

  const onDetectionEvent = useCallback(({command, payload}) => {
    const {hubId} = payload
    const currentDetections = hubSubscriptions[hubId] || []
    const newState = {...hubSubscriptions, [hubId]: [...currentDetections, payload]}
    setHubSubscriptions(newState)
  }, [])

  const onSubscribeEvent = ({command, payload}) => {
    const {hubId} = payload
    const currentDetections = hubSubscriptions[hubId] || []
    const newState = {...hubSubscriptions, [hubId]: [...currentDetections]}
    setHubSubscriptions(newState)
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
  <Row>
    <Col xs="24">
      <AuthForm
        onSubmit={authFormSubmit}
        connected={connected}
        disconnect={disconnect}
        authorized={authorized}
      />
    </Col>
  </Row>
  <Row>
    <Col xs="24">
      {
        connected && authorized ? <SubscribeForm onSubmit={onHubSubscribe} /> : null
      }
    </Col>
  </Row>
  <Row>
    <Col xs="24">
      {Object.keys(hubSubscriptions).map((hubId)=><DetectionsList key={hubId} hubId={hubId} data={hubSubscriptions[hubId]}/>)}
    </Col>
  </Row>
    
  </>
}

export default mainScreen;