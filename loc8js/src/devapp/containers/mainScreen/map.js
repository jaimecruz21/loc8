import React, {useState, useEffect, useRef} from 'react'
import {Row, Col} from 'antd'
import {Map, TileLayer, VectorLayer, Marker} from 'maptalks'

const MapScreen = (props) => {

  const [map, setMap] = useState()
  const mapContainer = useRef(null)

  useEffect(()=>{
    if (!map && mapContainer) {
      const map = new Map('maproot',{
        center:     [180,0],
        zoom:  4,
        baseLayer : new TileLayer('base',{
            urlTemplate:'/images/map.png',
        }),
        layers : [
            new VectorLayer('v', [new Marker([180, 0])])
        ]
      })
      setMap(map)
    }
    
  }, [mapContainer])
  
  return <Row>
      <Col span={24}>
        <div ref={mapContainer} id="maproot" style={{height: '400px', width: '100%'}}></div>
      </Col>
    </Row>
}

export default MapScreen