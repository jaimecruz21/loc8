import React from 'react';
import { Button, Form, Input} from 'antd';


const DEFAULT_HUB_ID = 'hub1'

const SubscribeForm = (props) => {
  const {onSubmit} = props
  const [form] = Form.useForm()

  const onFinish = (values) => {
    onSubmit(values)
  }

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item
        name="hubId"
        label="Hub Id"
        initialValue={DEFAULT_HUB_ID}
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
          Subscribe
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SubscribeForm