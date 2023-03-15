/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
import {
  confirmHand,
  confirmTeamHand,
  getHandMember,
  getTeamMember,
} from '@/services/handover'
import { Form, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import CommonModal from '../CommonModal'
import { PinkWrap, Wrap } from './style'

const { Option } = Select

const HandOverModal = (props: any) => {
  const [form] = Form.useForm()
  const [list, setList] = useState([])

  const init = async () => {
    const res = await getTeamMember({
      team_id: props.id.team_id,
      user_id: props.id.id,
    })
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
          project_id: Number(key),
          handover_user_id: res[key],
        })
      }

      const res1 = await confirmTeamHand({
        id: props.id.team_id,
        user_id: props.id.id,
        data: newObj,
      })

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
          {props?.id?.name}在本团队中参与了{props?.id?.projects_count}
          个团队项目，请指定项目接收人；
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
