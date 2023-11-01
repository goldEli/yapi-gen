import { Tabs } from 'antd'

interface TabsContentProps {
  tabItems: any
  activeKey: any
  onChangeRouter(url: string): void
  tabBarExtraContent?: any
}

const TabsContent = (props: TabsContentProps) => {
  const { tabItems, activeKey, onChangeRouter, tabBarExtraContent } = props
  const onChange = (key: string) => {
    onChangeRouter(key)
  }
  return (
    <Tabs
      tabBarExtraContent={tabBarExtraContent}
      onChange={onChange}
      type="card"
      activeKey={activeKey}
      items={tabItems}
    />
  )
}

export default TabsContent
