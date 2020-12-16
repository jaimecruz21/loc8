import React from 'react';
import { Button, Form, Input} from 'antd';


const DEFAULT_HUB_ID = 'hub1'
const DEFAULT_X = 1
const DEFAULT_Y = 1

const CoordinatesForm = (props) => {
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
      <Form.Item
        name="x"
        label={label| 'x'}
        initialValue={values && values.x? values.x : DEFAULT_X}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="y"
        label={label| 'y'}
        initialValue={values && values.x? values.x : DEFAULT_Y}
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
          Add {label}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CoordinatesForm