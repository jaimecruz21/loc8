import React, {useState, useEffect, useRef} from 'react'
import {Row, Col} from 'antd'
import MaptalksMap from './components/map'
import CoordinatesForm from './components/coordinatesForm'


const MapScreen = (props) => {

  const {devices, hubs: defaultHubs} = props

  const [hubs, setHubs] = useState(defaultHubs || [])

  const addHub = (data) => {
    const {uuid:newUUID} = data
    setHubs([...hubs.filter((({uuid})=>uuid!=newUUID)), data])
  }


  
  return <Row>
    <Col span={24}>
      <Row>
        <Col span={24} gutter={[4, 16]}>
          {/* Forms */}
          <CoordinatesForm label="Hub" onSubmit={addHub} />
        </Col>
      </Row>
      
      <Row>
        <Col span={24}>
          <MaptalksMap hubs={hubs} devices={devices || []} />
        </Col>
      </Row>

    </Col>
  </Row>
}

export default MapScreen