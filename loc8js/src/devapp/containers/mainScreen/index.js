import React, {useState, useEffect, useLayoutEffect} from 'react'
import Loc8 from 'loc8'
import SettingsTab from './settingsTab'
import Map from './map'
import {Row, Col, Space, Tabs} from 'antd'
import AuthForm from './components/authForm'
import SubscribeForm from './components/subscribeForm'
import DetectionsList from './components/detectionsList'


const {TabPane} = Tabs

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
    loc8?.updateCallbacks({
      onDetectionEvent: onDetectionEvent,
      onSubscribeEvent: onSubscribeEvent,
      onUnsubscribeEvent: onUnsubscribeEvent,
      onChangeStateEvent: onChangeState
    })
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

  const onHubSubscribe = ({uuid}) => {
    loc8.subscribeHub(uuid)
  }
  const onDeviceSubscribe = ({uuid}) => {
    loc8.subscribeDevice(uuid)
  }

  return <>
    <Row gutter={[4, 16]}>
      <Col xs="24">
        <Tabs defaultActiveKey="map" tabPosition="top">
          <TabPane tab='Settings' key="settings">
            <SettingsTab {...{disconnect, connected, authorized, authFormSubmit, onHubSubscribe, onDeviceSubscribe, hubSubscriptions}}/>
          </TabPane>
          <TabPane tab='Map' key="map">
            <Map />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    
  </>
}

export default mainScreen;