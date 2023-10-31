import { Tabs } from 'antd'

interface TabsContentProps {
  tabItems: any
  activeKey: any
  onChangeRouter(url: string): void
}

const TabsContent = (props: TabsContentProps) => {
  const { tabItems, activeKey, onChangeRouter } = props
  const onChange = (key: string) => {
    onChangeRouter(key)
  }
  return (
    <Tabs
      onChange={onChange}
      type="card"
      activeKey={activeKey}
      items={tabItems}
    />
  )
}

export default TabsContent
