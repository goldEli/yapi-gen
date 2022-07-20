import React, { useState } from 'react'
import { Select, Button, Form, Input } from 'antd'
import { css } from '@emotion/css'
const { Option } = Select
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

const Left = styled.div`
  width: 120px;
  height: 316px;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;

  align-items: center;
  border-right: 1px solid #ebedf0;
`
const Right = styled.div`
  box-sizing: border-box;
  padding-left: 24px;
  width: 354px;
  height: 316px;
`
const Contain = styled.div`
  position: relative;
  width: 475px;
  height: 316px;
  display: flex;
`
const StyledShape = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const FormWrap = styled.div`
  margin-top: 48px;
  box-sizing: border-box;
  padding-right: 24px;
`
const ButtonFooter = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  flex-direction: row-reverse;
  box-sizing: border-box;
  padding-right: 24px;
`
const Close = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
`
const shape = [
  { id: 1, name: '规划中' },
  { id: 2, name: '实现中' },
  { id: 3, name: '已实现' },
  { id: 4, name: '已关闭' },
]
type ShapeProps = {
  record: Record<string, number | string>
  hide: () => void
  tap: (value: any, active: any) => void
}
export const ShapeContent = (props: ShapeProps) => {
  const [form] = Form.useForm()
  const { record, hide, tap } = props

  const [active, setActive] = useState(record.level)

  const confirm = async () => {
    let res = await form.validateFields()
    tap(res, active)
    hide()
  }
  return (
    <Contain>
      <Left>
        {shape.map(item => (
          <div onClick={() => setActive(item.id)} key={item.id}>
            <StyledShape
              style={{
                color: item.id === active ? 'rgba(40, 119, 255, 1)' : '',
                border:
                  item.id === active ? ' 1px solid rgba(40, 119, 255, 1)' : '',
              }}
            >
              {item.name}
            </StyledShape>
            {item.id === record?.level}
          </div>
        ))}
      </Left>
      <Right>
        <FormWrap>
          <Form form={form}>
            <Form.Item
              labelCol={{ span: 5 }}
              label="处理人"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Select placeholder="请选择" allowClear>
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>

            <Form.Item labelCol={{ span: 5 }} label="评论" name="password">
              <Input.TextArea
                maxLength={200}
                style={{ maxHeight: '132px', minHeight: '132px' }}
              />
            </Form.Item>
          </Form>
        </FormWrap>

        <ButtonFooter>
          <Button
            onClick={confirm}
            style={{ marginLeft: '16px' }}
            type="primary"
          >
            流转
          </Button>
          <Button onClick={() => hide()}>取消</Button>
        </ButtonFooter>
      </Right>
      <Close onClick={() => hide()}>
        <IconFont type="close" style={{ fontSize: 20 }} />
      </Close>
    </Contain>
  )
}
