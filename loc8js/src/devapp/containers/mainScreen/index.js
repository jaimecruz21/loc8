import React, {useState, useEffect, useLayoutEffect} from 'react'
import Loc8 from 'lib'
import {Row, Col, Space} from 'antd'
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
    const loc8 = Loc8.init();
    setLoc8(loc8)
  }

  const onDetectionEvent = ({command, payload}) => {
    const {hubId} = payload
    const currentDetections = hubSubscriptions[hubId] || []
    const newState = {...hubSubscriptions, [hubId]: [payload, ...currentDetections]}
    setHubSubscriptions(newState)
    //console.log('is the same callback' , loc8, loc8?.onDetectionEvent === onDetectionEvent)
  }

  useLayoutEffect(()=>{
    // reinitialize links  for loc8 callback. 
    //during render React creates new links for the callback
    if (loc8) {
      loc8.onDetectionEvent = onDetectionEvent
      loc8.onSubscribeEvent = onSubscribeEvent
      loc8.onUnsubscribeEvent = onUnsubscribeEvent
      loc8.onChangeStateEvent = onChangeState
      //loc8.updateCallbacks({onDetectionEvent: onDetectionEvent})
    }
  })

  const onSubscribeEvent = ({command, payload}) => {
    const {hubId} = payload
    const currentDetections = hubSubscriptions[hubId] || []
    const newState = {...hubSubscriptions, [hubId]: [...currentDetections]}
    setHubSubscriptions(newState)
  }

  const onUnsubscribeEvent = ({command, payload}) => {
    const {hubId} = payload
    const newSubscriptions = {}
    Object.keys(hubSubscriptions).filter(
      (hub)=> hub != hubId
    ).map((hub)=>{
      newSubscriptions[hub] = hubSubscriptions[hub]
    })
    setHubSubscriptions(newSubscriptions)
  }

  const onUnsubscribeHub = (hubId) => {
    loc8?.unsubscribeHub(hubId)
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
  <Row gutter={[4, 16]}>
    <Col xs="24">
      <AuthForm
        onSubmit={authFormSubmit}
        connected={connected}
        disconnect={disconnect}
        authorized={authorized}
      />
    </Col>
  </Row>
  <Row gutter={[4, 16]}>
    <Col xs="24">
      {
        connected && authorized ? <SubscribeForm onSubmit={onHubSubscribe} /> : null
      }
    </Col>
  </Row>
  <Row gutter={[4, 16]}>
    <Col xs="24">
      <Row>
      {Object.keys(hubSubscriptions).map((hubId)=><Col xs="8" gutter={[4, 4]}><DetectionsList key={hubId} onUnsubscribe={()=>onUnsubscribeHub(hubId)} hubId={hubId} data={hubSubscriptions[hubId]}/></Col>)}
      </Row>
    </Col>
  </Row>
    
  </>
}

export default mainScreen;