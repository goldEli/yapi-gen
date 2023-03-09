/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
import { confirmHand, getHandMember } from '@/services/handover'
import { Form, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import { PinkWrap, Wrap } from './style'

const { Option } = Select

const HandOverModal = (props: any) => {
  const [form] = Form.useForm()
  const [list, setList] = useState([])
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
  const init = async () => {
    const res = await getHandMember(props.id.id)
    setList(res)
  }
  useEffect(() => {
    if (props.visible) {
      init()
    }
  }, [props.visible])
  const onConfirm = async () => {
    const res = await form.validateFields()

    if (res) {
      const newObj = []
      for (const key in res) {
        newObj.push({
          project_id: key,
          handover_user_id: res[key],
        })
      }

      const res1 = await confirmHand({ id: props.id.id, data: newObj })

      if (res1.code === 0) {
        message.success('成功')
        form.resetFields()
        props.close()
        props.confirm()
      }
    }
  }
  return (
    <CommonModal
      title="离职交接"
      onClose={props.close}
      isVisible={props.visible}
      onConfirm={onConfirm}
    >
      <Wrap>
        <PinkWrap>
          [{props.id.name}
          ]目前参与了{list.length}
          个项目，请指定交接项目接收人；交接后他的交接状态将更改为已交接；已经交接状态不可被项目添加及进行员工权限配置
        </PinkWrap>
        <Form form={form}>
          {list.map((i: any) => (
            <Form.Item
              rules={[{ required: true, message: '' }]}
              key={i.id}
              name={i.id}
              label={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    style={{
                      width: '30px',
                      height: '30px',
                      objectFit: 'cover',
                      marginRight: '8px',
                      borderRadius: '6px',
                    }}
                    src={i.cover}
                    alt=""
                  />
                  <span
                    style={{
                      textAlign: 'left',
                      display: 'inline-block',
                      width: '191px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {i.name}
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
                {i.members.map((k: any) => (
                  <Option key={k.user_id} value={k.user_id}>
                    {k.user_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
      </Wrap>
    </CommonModal>
  )
}

export default HandOverModal