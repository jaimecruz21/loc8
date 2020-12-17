export const DEBUG_DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodWJJZCI6Imh1YjEifQ.ppV1VeG6VWOLViIJgsZN3ioF65O1c7MRVokB-nH3Fwo'

export const PIXELS_PER_METER = 60/30 // 60 pixels contains 30 meters

export const DEFAULT_HUBS = [
  {
    uuid: 'hub1',
    x: 14,
    y: 73.5
  },
  {
    uuid: 'hub2',
    x: 77,
    y: 73.5
  },
  {
    uuid: 'hub3',
    x: 140,
    y: 73.5
  },
  {
    uuid: 'hub4',
    x: 14,
    y: 53.5
  },
  {
    uuid: 'hub5',
    x: 77,
    y: 53.5
  },
  {
    uuid: 'hub6',
    x: 140,
    y: 53.5
  },
  {
    uuid: 'hub7',
    x: 14,
    y: 18
  },
  {
    uuid: 'hub8',
    x: 77,
    y: 18
  },
  {
    uuid: 'hub9',
    x: 140,
    y: 18
  },

]

export const HUBS_POSITIONS = {}
DEFAULT_HUBS.map((data)=>{
  const {uuid, ...rest} = data
  HUBS_POSITIONS[uuid] = rest

})