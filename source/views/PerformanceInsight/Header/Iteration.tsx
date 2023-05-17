/* eslint-disable react/jsx-handler-names */
import { DatePicker, Space } from 'antd'
import { useEffect, useState } from 'react'
import View from './components/View'
import Sprint from './components/Sprint'
import { HeaderRow, Text, Tabs, DivStyle, Btn1 } from './Style'
import TimeMain from './components/TimeMain'
import { Left } from '../components/style'
import CommonIconFont from '@/components/CommonIconFont'
import Select from '../components/Select'
interface ItemProps {
  label: string
  value: string
  id: string
  avatar: string | undefined
}
const Iteration = () => {
  // sprint  iteration all
  const [type, setType] = useState('sprint')
  const [tabs, setTabs] = useState<Array<{ label: string; key: string }>>([])
  const tabs1 = [
    {
      label: '按周期',
      key: '1',
    },
    {
      label: '按冲刺',
      key: '2',
    },
  ]
  const tabs2 = [
    {
      label: '按周期',
      key: '1',
    },
    {
      label: '按迭代',
      key: '2',
    },
  ]
  const [tabsActive, setTabsActive] = useState<number>(0)
  const [timekey, setTimekey] = useState<number>(-1)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { RangePicker } = DatePicker
  const [more, setMore] = useState<boolean>(false)
  const [person, setPerson] = useState<ItemProps[] | []>([
    {
      label: '1',
      value: '1',
      id: '1',
      avatar: '',
    },
  ])
  const [options, setOptions] = useState<ItemProps[] | []>([])
  const getTabsActive = (index: number) => {
    setTabsActive(index)
  }
  useEffect(() => {
    if (type === 'iteration') {
      setTabs(tabs1)
    } else {
      setTabs(tabs2)
    }
  }, [])
  const onSearch = (value: string) => {
    console.log(value)
  }
  useEffect(() => {
    const a = []
    for (let i = 1; i < 10; i++) {
      const value = i.toString(10) + i
      a.push({
        label: `Long Label: ${value}`,
        value,
        id: value,
        avatar: '',
      })
    }
    setOptions(a)
  }, [])
  const onShowAll = () => {
    setMore(true)
    const a = []
    for (let i = 1; i < 50; i++) {
      const value = i.toString(10) + i
      a.push({
        label: `Long Label: ${value}`,
        value,
        id: value,
        avatar: '',
      })
    }
    setOptions(a)
  }
  return (
    <HeaderRow>
      <Space size={16}>
        <View />
        <Text>另存为</Text>
        <Text>保存</Text>
      </Space>

      <Space size={16}>
        {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
        {type === 'all' && (
          <Select
            onSearch={onSearch}
            options={options}
            more={more}
            onChange={(value: string[]) => console.log(value)}
            onShowAll={() => onShowAll()}
          />
        )}
        <DivStyle onClick={() => 123}>
          {person.length > 0 ? (
            <Left>
              <span>成员</span>
              <Btn1>已选{person.length}人</Btn1>
            </Left>
          ) : (
            <>全员</>
          )}
          <CommonIconFont
            type={isOpen ? 'up' : 'down'}
            size={14}
            color="var(--neutral-n4)"
          />
        </DivStyle>
        {(type === 'sprint' || type === 'iteration') && (
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
        )}
        {tabsActive === 0 ? (
          <TimeMain onChange={e => setTimekey(e)} />
        ) : (
          <Sprint />
        )}
        {timekey === 0 && <RangePicker style={{ width: '283px' }} />}
      </Space>
    </HeaderRow>
  )
}
export default Iteration
