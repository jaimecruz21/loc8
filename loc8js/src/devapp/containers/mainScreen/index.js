import React, {useState, useEffect, useLayoutEffect} from 'react'
import Loc8 from 'loc8'
import SettingsTab from './settingsTab'
import Map from './map'
import {Row, Col, Space, Tabs} from 'antd'


const {TabPane} = Tabs

const DEBUG_DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodWJJZCI6Imh1YjEifQ.ppV1VeG6VWOLViIJgsZN3ioF65O1c7MRVokB-nH3Fwo'



const DEFAULT_HUBS = [
  {
    uuid: 'hub1',
    x: 14,
    y: 0
  },
  {
    uuid: 'hub2',
    x: 14,
    y: 75
  },
  {
    uuid: 'hub3',
    x: 140,
    y: 0
  },
  {
    uuid: 'hub4',
    x: 140,
    y: 75
  },
]

const DEFAULT_HUB_SUBSCRIPTIONS = {}
DEFAULT_HUBS.map((val)=>{DEFAULT_HUB_SUBSCRIPTIONS[val.uuid]=[]})
const DEFAULT_DEVICE_SUBSCRIPTIONS = {uuid1: [], uuid2: [], uuid3: []}



const mainScreen = (props) => {
  
  const [connected, setConnected] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loc8, setLoc8] = useState()
  const [hubSubscriptions, setHubSubscriptions] = useState(DEFAULT_HUB_SUBSCRIPTIONS)
  const [deviceSubscriptions, setDeviceSubscriptions] = useState(DEFAULT_DEVICE_SUBSCRIPTIONS)

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

  const onHubSubscribe = ({uuid}) => {
    loc8.subscribeHub(uuid)
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

  useEffect(()=>{
    if (connected && !authorized) {
      loc8?.authorize(DEBUG_DEFAULT_TOKEN)
    }
    if (authorized && connected) {-
      Object.keys(hubSubscriptions).map((uuid)=>onHubSubscribe({uuid}))
      Object.keys(deviceSubscriptions).map((uuid)=>onDeviceSubscribe({uuid}))
    }
  }, [authorized, connected])

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

  const onDeviceSubscribe = ({uuid}) => {
    loc8.subscribeDevice(uuid)
    const currentDetections = deviceSubscriptions[uuid] || []
    const newState = {...deviceSubscriptions, [uuid]: [...currentDetections]}
    setDeviceSubscriptions(newState)
  }
  return <>
    <Row gutter={[4, 16]}>
      <Col span={24}>
        <Tabs defaultActiveKey="settings" tabPosition="top">
          <TabPane tab='Settings' key="settings">
            <SettingsTab {...{disconnect, connected, authorized, authFormSubmit, onHubSubscribe, onDeviceSubscribe, hubSubscriptions, deviceSubscriptions}}/>
          </TabPane>
          <TabPane tab='Map' key="map">
            <Map hubs={DEFAULT_HUBS} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    
  </>
}

export default mainScreen;