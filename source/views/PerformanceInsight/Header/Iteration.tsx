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
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(true)
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
      {/* 导出 */}
      <Export
        time={'2023-03-01 ~ 2023-03-14'}
        title="按周期导出"
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => 123}
        personData={[{ name: '123' }]}
      />
      {/* 导出成功 */}
      <ExportSuccess
        title={'导出成功'}
        text={'Excel导出成功，可在本地打开文件查看'}
        isVisible={false}
        onConfirm={() => {
          setIsVisible(false)
        }}
        onChangeVisible={() => setIsVisible(false)}
      />
      {/* 分享  save代表是否保存的值*/}
      <Share
        title="分享"
        save={true}
        isVisible={isVisible}
        onConfirm={() => {
          setIsVisible(false)
        }}
        onClose={() => setIsVisible(false)}
      />
    </HeaderRow>
  )
}
export default Iteration
