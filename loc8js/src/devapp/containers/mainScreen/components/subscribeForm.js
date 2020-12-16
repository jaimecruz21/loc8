import React from 'react';
import { Button, Form, Input} from 'antd';


const DEFAULT_HUB_ID = 'hub1'

const SubscribeForm = (props) => {
  const {onSubmit, label, values} = props
  const [form] = Form.useForm()

  const onFinish = (values) => {
    onSubmit(values)
  }

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item
        name="uuid"
        label={label| 'uuid'}
        initialValue={values && values.uuid? values.uuid : DEFAULT_HUB_ID}
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
          Subscribe {label}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SubscribeForm