import { Tabs, TabsProps } from 'antd'
import { ActivityTabItem, InfoItem, ItemNumber, Label } from '../style'
import { useState } from 'react'
import ChangeRecord from './ChangeRecord'
import Circulation from './Circulation'
import CommonComment from '@/components/CommonComment'

const ActivitySprint = () => {
  const [activeKey, setActiveKey] = useState('1')
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>评论</span>
          <ItemNumber isActive={activeKey === '1'}>5</ItemNumber>
        </ActivityTabItem>
      ),
      children: <CommonComment />,
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>变更记录</span>
          <ItemNumber isActive={activeKey === '2'}>6</ItemNumber>
        </ActivityTabItem>
      ),
      children: <ChangeRecord />,
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>流转记录</span>
          <ItemNumber isActive={activeKey === '3'}>8</ItemNumber>
        </ActivityTabItem>
      ),
      children: <Circulation />,
    },
  ]

  const onChange = (key: string) => {
    setActiveKey(key)
  }

  return (
    <InfoItem>
      <Label>活动</Label>
      <Tabs defaultActiveKey={activeKey} items={items} onChange={onChange} />
    </InfoItem>
  )
}

export default ActivitySprint
