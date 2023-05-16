import { Space } from 'antd'
import { useState } from 'react'
import View from './components/View'
import Sprint from './components/Sprint'
import { HeaderRow, Text, Tabs } from './Style'
import Export from './components/Export'
import ExportSuccess from './components/ExportSuccess'
import Share from './components/Share'
const Iteration = () => {
  const tabs = [
    {
      label: '按周期',
    },
    {
      label: '按冲刺',
    },
  ]
  const [tabsActive, setTabsActive] = useState<number>(0)

  const getTabsActive = (index: number) => {
    setTabsActive(index)
  }
  return (
    <HeaderRow>
      <Space size={16}>
        <View />
        <Text>另存为</Text>
        <Text>保存</Text>
      </Space>
      <Space size={16}>
        <Tabs>
          {tabs.map((el, index) => (
            <span
              className={tabsActive == index ? 'tabsActive' : ''}
              onClick={() => getTabsActive(index)}
              key={el.label}
            >
              {el.label}
            </span>
          ))}
        </Tabs>
        <Sprint />
      </Space>
    </HeaderRow>
  )
}
export default Iteration
