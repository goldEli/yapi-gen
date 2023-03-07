/* eslint-disable react/jsx-handler-names */
import { Form, Select } from 'antd'
import React from 'react'
import CommonModal from '../CommonModal'
import { PinkWrap, Wrap } from './style'

const { Option } = Select

const HandOverModal = (props: any) => {
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
    <CommonModal
      title="离职交接"
      onClose={props.close}
      isVisible={props.visible}
    >
      <Wrap>
        <PinkWrap>
          [张三]目前参与了3个项目，请指定交接项目接收人；交接后他的交接状态将更改为已交接；已经交接状态不可被项目添加及进行员工权限配置
        </PinkWrap>
        <Form form={form}>
          <Form.Item
            name="gender"
            label={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    marginRight: '8px',
                  }}
                  src="https://varlet.gitee.io/varlet-ui/cat.jpg"
                  alt=""
                />
                <span
                  style={{
                    display: 'inline-block',
                    width: '191px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  项目名称项目名称项目名称项项目名称项目名称项目名称项......
                </span>
              </div>
            }
          >
            <Select
              style={{
                width: '184px',
                marginLeft: '48px',
              }}
              placeholder="请选择交接人"
              onChange={onGenderChange}
              allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>
        </Form>
      </Wrap>
    </CommonModal>
  )
}

export default HandOverModal
