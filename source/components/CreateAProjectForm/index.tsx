/* eslint-disable react-hooks/rules-of-hooks */
import { Form, Input, Select, Tooltip } from 'antd'
import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import MoreSelect from '../MoreSelect'
import { Wrap } from './style'

export type IndexRef = {
  postValue(): Record<string, unknown>
}

const index = (props: any, ref: ForwardedRef<IndexRef>) => {
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

  useImperativeHandle(ref, () => ({
    postValue: () => form?.getFieldsValue(),
  }))
  return (
    <Wrap>
      <Form form={form} layout="vertical" name="basic" autoComplete="off">
        <Form.Item
          label={<FormTitleSmall text="项目名称" />}
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<FormTitleSmall text="所属" />}
          name="their"
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
          name="keyboard"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="请输入键" />
        </Form.Item>
        <Form.Item
          label={<FormTitleSmall text="项目负责人" />}
          name="user"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <MoreSelect />
        </Form.Item>
        <Form.Item label={<FormTitleSmall text="项目描述" />} name="dec">
          <Input.TextArea
            placeholder="Controlled autosize"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Wrap>
  )
}

export default forwardRef(index)
