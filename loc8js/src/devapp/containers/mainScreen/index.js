import React, {useState} from 'react';
import { Button } from 'antd';


const ConnectButton = ({connected, ...props}) => {
  const btnState = connected ? ['primary', 'Disconnect'] : ['default', 'Connect']
  const [btnType, btnText] = btnState

  return <Button type={btnType} {...props}>
    {btnText}
  </Button>

}


const mainScreen = (props) => {
  const [connected, setConnected] = useState(false);
  const {loc8} = props;

  const toggleConnect = () => {
    connected ? loc8.disconnect() : loc8.connect()
  }

  return <ConnectButton connected={connected} onClick={toggleConnect} />
}

export default mainScreen;