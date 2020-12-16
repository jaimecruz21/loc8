import React, {useState, useEffect, useRef} from 'react'
import {Map, ImageLayer, TileLayer,VectorLayer, Marker} from 'maptalks'


const HUBS_LAYER_ID = 'hubsLayer'
const DEVICES_LAYER_ID = 'devicesLayer'


const createDevice  = ({uuid, x, y}) => {
  return new Marker([x, y], {
    'id' : uuid,
    'symbol' : {
        'markerFile'  : 'images/device.png',
        'markerWidth' : 20,
        'markerHeight': 20,
    },
});
}

const createHub = ({uuid, x, y}) => {
  return new Marker([x, y], {
    'id' : uuid,
    'symbol' : {
        'markerFile'  : 'images/hub.png',
        'markerWidth' : 20,
        'markerHeight': 20,
    },
});
}

const MaptalksMap = (props) => {
  const {hubs, devices} = props;
  const [map, setMap] = useState()
  
  const onMapMouseEvent = (e) => {
    const map = e.target
    function getStatus() {
      var extent = map.getExtent(),
        ex = [
          '{',
          'xmin:' + extent.xmin.toFixed(5),
          ', ymin:' + extent.ymin.toFixed(5),
          ', xmax:' + extent.xmax.toFixed(5),
          ', ymax:' + extent.xmax.toFixed(5),
          '}'
        ].join('');
      var center = map.getCenter();
      var mapStatus = [
        'Center : [' + [center.x.toFixed(5), center.y.toFixed(5)].join() + ']',
        'Extent : ' + ex,
        'Size : ' + map.getSize().toArray().join(),
        'Zoom : '   + map.getZoom(),
        'MinZoom : ' + map.getMinZoom(),
        'MaxZoom : ' + map.getMaxZoom(),
        'Projection : ' + map.getProjection().code
      ];
      console.log(mapStatus, map)
    }
    getStatus()
  }

  const renderHubs = () => {
    
  }
  

  // rerender hubs
  useEffect(
    () => {
      const layer =  map?.getLayer(HUBS_LAYER_ID)
      console.log('hubs', hubs)
      if (!layer) return
      layer.clear()
      layer.addGeometry(hubs.map((val)=>createHub(val)))
    }, [hubs, map]
  )
  // rerender hubs
  useEffect(
    () => {
      //new Marker([110, 70])
      const layer = map?.getLayer(DEVICES_LAYER_ID)
      // exit if no layer
      if (!layer) return
      layer.clear()
      layer.addGeometry(devices.map((val)=>createDevice(val)))

    }, [devices, map]
  )

  useEffect(()=>{
    const devicesLayer = new VectorLayer(DEVICES_LAYER_ID)
    const hubsLayer = new VectorLayer(HUBS_LAYER_ID)
    if (!map) {
      const map = new Map('maproot',{
        center: [74.75, 47.97],
        zoomable: false,
        draggable: false,
        zoom:  1.9,
        minZoom: 1.9,
        maxZoom: 1.9,
        baseLayer : new ImageLayer('base', [
          {
            url: '/images/smallmap2.png',
            extent: {xmin: -2.2, ymin:-19.339, xmax:152.02739, ymax:152.02734},
            maxZoom: 1.9,
            opacity: 0.3,
            forceRenderOnMoving: true,
            forceRenderOnZooming: true,
          }
        ]),

        layers : [
            hubsLayer,
            devicesLayer
        ]
      })
      map.on('mousedown mousemove mouseup', onMapMouseEvent, map)
      setMap(map)
    }
    
  }, [])
  
  return <div style={{height: '100%',width: '100%'}}>
    <div style={{height: '400px', width: '400px'}} id="maproot"></div>
  </div>
}

export default MaptalksMap