import React, {useState, useEffect, useLayoutEffect} from 'react'
import {Row, Col} from 'antd'
import AuthForm from './components/authForm'
import SubscribeForm from './components/subscribeForm'
import DetectionsList from './components/detectionsList'


const SettingsTab = (props) => {
  const {disconnect, connected, authorized, authFormSubmit, onHubSubscribe, onDeviceSubscribe, hubSubscriptions, deviceSubscriptions } = props
  return <>
    <Row gutter={[4, 16]}>
      <Col span={24}>
        <AuthForm
          onSubmit={authFormSubmit}
          connected={connected}
          disconnect={disconnect}
          authorized={authorized}
        />
      </Col>
    </Row>
    <Row gutter={[4, 16]}>
      <Col span={8}>
        <Col span={24}>
          {
            connected && authorized ? <SubscribeForm onSubmit={onHubSubscribe} label="Hub" /> : null
          }
        </Col>
        <Col span={24}>
          <Row>
          {Object.keys(hubSubscriptions).map((hubId)=><Col span={24} gutter={[4, 4]}><DetectionsList key={hubId} onUnsubscribe={()=>onUnsubscribeHub(hubId)} hubId={hubId} data={hubSubscriptions[hubId]}/></Col>)}
          </Row>
        </Col>
        
      </Col>
      <Col span={8}>
        <Col span={24}>
        {
          connected && authorized ? <SubscribeForm onSubmit={onDeviceSubscribe} label="Device" values={{uuid: 'uuid1'}}/> : null
        }
        </Col>
        <Col span={24}>
          {Object.keys(deviceSubscriptions).map((val)=><div>{val}</div>)}
        </Col>
      </Col>
    </Row>
  </>
}

export default SettingsTab