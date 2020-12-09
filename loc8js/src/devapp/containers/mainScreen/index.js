import React from "react";
import { Button } from 'antd';

const mainScreen = (props) => {

  const [btnType, btnText] = ['primary', 'Connect'];

  return <Button type={btnType} >
    {btnText}
  </Button>
}

export default mainScreen;