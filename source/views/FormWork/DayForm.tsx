import { Checkbox, Switch, Form, TimePicker, Dropdown, MenuProps } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'
import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
const options = [
  {
    label: '周一',
    id: 1,
    value: false,
  },
  {
    label: '周二',
    id: 2,
    value: false,
  },
  {
    label: '周三',
    id: 3,
    value: false,
  },
  {
    label: '周四',
    id: 4,
    value: false,
  },
  {
    label: '周五',
    id: 5,
    value: false,
  },
  {
    label: '周六',
    id: 6,
    value: false,
  },
  {
    label: '周日',
    id: 7,
    value: false,
  },
]
const Text = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
`
const RowStyle = styled.div`
  display: flex;
  align-items: center;
`
const SupScope = () => {
  const [isOpen, setIsOpen] = useState(false)
  const items: MenuProps['items'] = [
    {
      label: '前一日',
      key: 1,
    },
    {
      label: '前二日',
      key: 2,
    },
    {
      label: '前三日',
      key: 3,
    },
    {
      label: '前四日',
      key: 4,
    },
    {
      label: '前五日',
      key: 5,
    },
    {
      label: '前六日',
      key: 6,
    },
    {
      label: '前七日',
      key: 7,
    },
    {
      label: '无限制',
      key: 8,
    },
  ]
  const onOpenChange = (e: { key: string }) => {
    return 12
  }
  return (
    <RowStyle>
      <Text>补交范围:</Text>
      <Dropdown
        placement="bottomLeft"
        open={isOpen}
        trigger={['click']}
        menu={{ items, onClick: onOpenChange }}
        overlayStyle={{
          width: 120,
          background: 'var(--neutral-white-d1)',
        }}
      >
        <CommonButton type="primaryText" onClick={() => setIsOpen(!isOpen)}>
          添加
          <CommonIconFont
            type={isOpen ? 'up' : 'down'}
            size={14}
            color="var(--primary-d2)"
          />
        </CommonButton>
      </Dropdown>
    </RowStyle>
  )
}
const Edit = () => {
  return (
    <RowStyle>
      <Text>提交汇报提交人可修改</Text>
      <Switch style={{ marginLeft: 8 }} />
    </RowStyle>
  )
}
const DayForm = () => {
  const [day, setDay] = useState(options)

  const onChange = (value: boolean, el: { value: boolean; id: number }) => {
    setDay(
      day.map(item => ({
        ...item,
        value: el.id === item.id ? value : item.value,
      })),
    )
  }
  return (
    <>
      <>
        <Form.Item label="" name="legal">
          <Checkbox>跟随中国法定节假日自动调整 </Checkbox>
        </Form.Item>
        <Form.Item label="" name="day">
          <>
            {day.map(el => (
              <Checkbox
                key={el.id}
                onChange={e => onChange(e.target.value, el)}
                value={el.value}
              >
                {el.label}
              </Checkbox>
            ))}
          </>
        </Form.Item>
        <Form.Item
          style={{
            margin: '32px 0',
          }}
          label="开始时间"
          name="startTime"
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          style={{
            margin: '32px 0',
          }}
          label="截止时间"
          name="endTime"
        >
          <TimePicker />
        </Form.Item>
        <RowStyle>
          <Form.Item style={{ marginRight: 48 }} label="" name="endTimeSup">
            <Checkbox>截止时间后允许补交</Checkbox>
          </Form.Item>
          <Form.Item label="" name="supScope">
            <SupScope />
          </Form.Item>
        </RowStyle>
        <Form.Item label="" name="RestrictedFilling">
          <Checkbox>每个周限填一次</Checkbox>
        </Form.Item>
        <Form.Item label="" name="edit">
          <Checkbox>提交汇报提交人可修改</Checkbox>
        </Form.Item>
        <Form.Item
          style={{
            marginTop: '32px',
          }}
          label=""
          name="edit"
        >
          <Edit />
        </Form.Item>
        <Form.Item
          style={{
            marginTop: '16px',
          }}
          label="提醒时间"
          name="remindTime"
        >
          <TimePicker />
        </Form.Item>
      </>
    </>
  )
}
export default DayForm
