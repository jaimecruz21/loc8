import axios from 'axios'
import { SERVER_HOST } from 'constants';


export const getDetections = async (token, hubs=[], devices=[], interval=null, start=null) => {
  const headers = {
    Authorization: `Bearer ${token}`
  }
  let qs = '';
  hubs.map((val)=>{
    qs+=`hubs=${val}&`
  })
  devices.map((val)=>{
    qs+=`devices=${val}&`
  })
  
  const resp = await axios.get(`//${SERVER_HOST}/api/v1/detections/?${qs}`, {headers:headers})
  return resp.data.detections
}