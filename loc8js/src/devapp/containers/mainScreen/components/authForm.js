import React from 'react';
import { Button, Form, Input} from 'antd';


const DEBUG_DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodWJJZCI6Imh1YjEifQ.ppV1VeG6VWOLViIJgsZN3ioF65O1c7MRVokB-nH3Fwo'


const AuthForm = (props) => {
  const {onSubmit, connected, disconnect, authorized} = props
  const [form] = Form.useForm()

  const onFinish = (values) => {
    onSubmit(values)
  }
  return (
    <Form form={form} layout={'inline'} onFinish={onFinish}>
      <Form.Item
        name="token"
        label="JWT token"
        initialValue={DEBUG_DEFAULT_TOKEN}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item >
        <Button type={authorized ? "default" : "primary"} htmlType="submit">
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