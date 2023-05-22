import { Tabs, TabsProps } from 'antd'
import { ActivityTabItem, InfoItem, ItemNumber, Label } from '../style'

const ActivitySprint = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>Tab 1</span>
          <ItemNumber>5</ItemNumber>
        </ActivityTabItem>
      ),
      children: `Content of Tab Pane 1`,
    },
    {
      key: '2',
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ]

  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <InfoItem>
      <Label>活动</Label>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </InfoItem>
  )
}

export default ActivitySprint
