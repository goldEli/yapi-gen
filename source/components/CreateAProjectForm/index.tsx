/* eslint-disable react-hooks/rules-of-hooks */
import { Form, Input, Select, Tooltip } from 'antd'
import React from 'react'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import MoreSelect from '../MoreSelect'
import { Wrap } from './style'

const index = () => {
  const [form] = Form.useForm()

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' })
        return
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' })
        return
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' })
    }
  }
  return (
    <Wrap>
      <Form form={form} layout="vertical" name="basic" autoComplete="off">
        <Form.Item
          label={<FormTitleSmall text="项目名称" />}
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<FormTitleSmall text="所属" />}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            onChange={onGenderChange}
            allowClear
          >
            <Select.Option value="male">male</Select.Option>
            <Select.Option value="female">female</Select.Option>
            <Select.Option value="other">other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <div>
              <FormTitleSmall text="键" />
              <Tooltip
                trigger={['click']}
                placement="top"
                title="键用以区分项目，作为需求编号前缀使用"
              >
                <IconFont
                  style={{
                    position: 'absolute',
                    left: '26px',
                    top: '5px',
                  }}
                  type="question"
                />
              </Tooltip>
            </div>
          }
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="请输入键" />
        </Form.Item>
        <Form.Item
          label={<FormTitleSmall text="项目负责人" />}
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <MoreSelect />
        </Form.Item>
      </Form>
    </Wrap>
  )
}

export default index
