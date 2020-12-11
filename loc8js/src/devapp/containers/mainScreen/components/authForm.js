import React, {useState, useEffect} from 'react';
import { Button, Form, Input} from 'antd';


const ConnectButton = ({connected, ...props}) => {
  const btnState = connected ? ['primary', 'Disconnect'] : ['default', 'Connect']
  const [btnType, btnText] = btnState
  return <Button type={btnType} {...props}>
    {btnText}
  </Button>

}

const AuthForm = (props) => {
  const {onSubmit, connected, disconnect} = props
  const [form] = Form.useForm()

  const onFinish = (values) => {
    onSubmit(values)
  }
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="token"
        label="JWT token"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item >
        <Button type="primary" htmlType="submit">
          {connected ? "Authorize" : "Connect"}
        </Button>
      </Form.Item> 
      {connected
        ? <Button
            htmlType="button"
            onClick = {(e) => {
              e.preventDefault;
              disconnect()
            }
          }>Disconnect</Button>
        : null
      }

    </Form>
  )
}

export default AuthForm