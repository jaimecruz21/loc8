import React, {useState, useEffect, useLayoutEffect} from 'react'
import {Row, Col} from 'antd'
import AuthForm from './components/authForm'
import SubscribeForm from './components/subscribeForm'
import DetectionsList from './components/detectionsList'


const SettingsTab = (props) => {
  const {disconnect, connected, authorized, authFormSubmit, onHubSubscribe, onDeviceSubscribe, hubSubscriptions, } = props
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
      <Col xs="8">
        {
          connected && authorized ? <SubscribeForm onSubmit={onHubSubscribe} label="HubId" /> : null
        }
      </Col>
      <Col xs="8">
        {
          connected && authorized ? <SubscribeForm onSubmit={onDeviceSubscribe} label="DeviceId" values={{uuid: 'uuid1'}}/> : null
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

export default SettingsTab