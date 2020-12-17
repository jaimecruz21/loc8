import React, {useState, useEffect, useLayoutEffect} from 'react'
import Loc8 from 'loc8'
import SettingsTab from './settingsTab'
import Map from './map'
import {Row, Col, Space, Tabs} from 'antd'
import { DEBUG_DEFAULT_TOKEN, PIXELS_PER_METER, HUBS_POSITIONS, DEFAULT_HUBS} from './const'


const {TabPane} = Tabs

const DEFAULT_X = 14;

const DEFAULT_HUB_SUBSCRIPTIONS = {}
DEFAULT_HUBS.map((val)=>{DEFAULT_HUB_SUBSCRIPTIONS[val.uuid]=[]})
const DEFAULT_DEVICE_SUBSCRIPTIONS = {uuid1: [], uuid2: [], uuid3: []}


const calcPositionByHubs = (detections) => {

  const meaningDetections = Object.keys(detections).filter((key)=>HUBS_POSITIONS[key]).map((hub)=>{
    return {...HUBS_POSITIONS[hub], distance: PIXELS_PER_METER * detections[hub]}
  })
  const y = meaningDetections.map(({y})=>y).reduce((a, b) => a+ b, 0) / meaningDetections.length
  
  const coords = []
  let calculatedX = DEFAULT_X
  meaningDetections.map((data)=> {
    const {x, y, distance } = data
    if (!coords.length){
      coords.push(x+distance)
      coords.push(x-distance)
    } else {
      const possible = [x - distance, x + distance]
      const diffs = {}
      possible.map((val)=>coords.map((prev)=>{
        diffs[Math.abs(val-prev)]=[val, prev]
        diffs[val+prev]=[val, prev]
      }))
      const diffKeys = Object.keys(diffs)
      diffKeys.sort()
      calculatedX = diffKeys.length && diffKeys[0] ? diffs[diffKeys[0]][0] : DEFAULT_X
    }
  })

  console.log('meaning detections',  calculatedX, meaningDetections)
  return {x: calculatedX, y: y}
}


const detectionsToLocations = (detections) => {
  const hubsDetections = {}
  const hubsFound = new Set()
  detections.map((data) => {
    const {objectId, distance, hubId} = data
    if (hubsFound.has(objectId)) {
      hubsDetections[objectId][hubId] = distance
    } else {
      hubsFound.add(objectId)
      hubsDetections[objectId] = {[hubId]: distance}
    }
  })

  return Object.keys(hubsDetections).map((deviceId)=> {
    const position = calcPositionByHubs(hubsDetections[deviceId])
    return {uuid: deviceId, ...position}
  })
}



const mainScreen = (props) => {
  
  const [connected, setConnected] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loc8, setLoc8] = useState()
  const [hubSubscriptions, setHubSubscriptions] = useState(DEFAULT_HUB_SUBSCRIPTIONS)
  const [deviceSubscriptions, setDeviceSubscriptions] = useState(DEFAULT_DEVICE_SUBSCRIPTIONS)
  const [devicesLocations, setDevicesLocations] = useState([]);

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


  const getDeviceDetections = async () => {
    if (!loc8) return
    const detections = await loc8.getSubscribedDetections()
    setDevicesLocations(detectionsToLocations(detections))
  }


  useEffect(() => {
    if (!loc8) return
    const interval = setInterval(() => {
      getDeviceDetections()
    }, 3000);
    return () => clearInterval(interval);
  }, [loc8]);

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
        <Tabs defaultActiveKey="map" tabPosition="top">
          <TabPane tab='Settings' key="settings">
            <SettingsTab {...{disconnect, connected, authorized, authFormSubmit, onHubSubscribe, onDeviceSubscribe, hubSubscriptions, deviceSubscriptions}}/>
          </TabPane>
          <TabPane tab='Map' key="map">
            <Map hubs={DEFAULT_HUBS} devices={devicesLocations}/>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    
  </>
}

export default mainScreen;