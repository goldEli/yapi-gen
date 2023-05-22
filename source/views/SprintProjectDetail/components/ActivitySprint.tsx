import { Tabs, TabsProps } from 'antd'
import { ActivityTabItem, InfoItem, ItemNumber, Label } from '../style'
import { useState } from 'react'

const ActivitySprint = () => {
  const [activeKey, setActiveKey] = useState('1')
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>Tab 1</span>
          <ItemNumber isActive={activeKey === '1'}>5</ItemNumber>
        </ActivityTabItem>
      ),
      children: `Content of Tab Pane 1`,
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>Tab 1</span>
          <ItemNumber isActive={activeKey === '2'}>6</ItemNumber>
        </ActivityTabItem>
      ),
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>Tab 1</span>
          <ItemNumber isActive={activeKey === '3'}>8</ItemNumber>
        </ActivityTabItem>
      ),
      children: `Content of Tab Pane 3`,
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
