import React, {useState} from 'react';
import { Button } from 'antd';
import Loc8 from 'lib';



const ConnectButton = ({connected, ...props}) => {
  const btnState = connected ? ['primary', 'Disconnect'] : ['default', 'Connect']
  const [btnType, btnText] = btnState

  return <Button type={btnType} {...props}>
    {btnText}
  </Button>

}


const mainScreen = (props) => {
  const [connected, setConnected] = useState(false);

  const onChangeState = (...props) => {
    console.log('loc8 state changed', props)
  }

  const loc8 = Loc8.init({
    onChangeState: onChangeState
  });

  const toggleConnect = () => {
    connected ? loc8.disconnect() : loc8.connect()
  }

  return <ConnectButton connected={connected} onClick={toggleConnect} />
}

export default mainScreen;