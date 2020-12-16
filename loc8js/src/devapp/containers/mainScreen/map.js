import React, {useState, useEffect, useLayoutEffect} from 'react'
import {Map, TileLayer, VectorLayer, Marker} from 'maptalks'

const MapScreen = (props) => {

  const [map, setMap] = useState()

  useEffect(()=>{
    const map = new Map("map",{
      center:     [180,0],
      zoom:  4,
      baseLayer : new TileLayer("base",{
          urlTemplate:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains:['a','b','c']
      }),
      layers : [
          new VectorLayer('v', [new Marker([180, 0])])
      ]
    })
    setMap(map)
  }, [])
  
  return 'Map'
}

export default MapScreen