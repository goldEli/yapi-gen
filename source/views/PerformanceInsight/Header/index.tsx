/* eslint-disable react/jsx-handler-names */
import { DatePicker, Space } from 'antd'
import { useEffect, useState } from 'react'
import View from './components/View'
import Sprint from './components/Sprint'
import { HeaderRow, Text, Tabs, DivStyle, Btn1 } from './Style'
import SelectMain from './components/SelectMain'
import { Left } from '../components/style'
import CommonIconFont from '@/components/CommonIconFont'
import Select from '../components/Select'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import { useSelector } from '@store/index'
import { setSave } from '@store/performanceInsight'
import { useDispatch } from 'react-redux'
import ViewDialog from './components/ViewDialog'
interface ItemProps {
  name: string
  id: number
}
interface OptionProps {
  label: string
  value: string
  id: string
  avatar: string
}
const Iteration = () => {
  // sprint  iteration all
  const [type, setType] = useState('all')
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
  const [person, setPerson] = useState<ItemProps[] | []>([])
  const [options, setOptions] = useState<OptionProps[] | []>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleView, setIsVisibleView] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { save } = useSelector(store => store.performanceInsight)
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
  const onConfirm = (data: Array<{ name: string; id: number }>) => {
    // 保存弹窗提示需要
    dispatch(setSave(true))
    setIsVisible(false)
    setPerson(data)
  }
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPerson([])
  }
  return (
    <HeaderRow>
      <Space size={16}>
        <View />
        <Text onClick={() => setIsVisibleView(true)}>另存为</Text>
        {save && <Text>保存</Text>}
      </Space>

      <Space size={16}>
        {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
        {type === 'all' && (
          <Select
            onSearch={onSearch}
            options={options}
            more={more}
            onChange={(value: string[]) => {
              console.log(value, '项目'), dispatch(setSave(true))
            }}
            onShowAll={() => onShowAll()}
          />
        )}
        {/* 成员选择 */}
        <DivStyle onClick={() => setIsVisible(true)}>
          {person.length > 0 ? (
            <Left>
              <span>成员</span>
              <Btn1>已选{person.length}人</Btn1>
            </Left>
          ) : (
            <span>全员</span>
          )}
          {person.length > 0 ? (
            <CommonIconFont
              type={'close-solid'}
              size={14}
              color="var(--neutral-n4)"
              // onClick={(ev: React.MouseEvent) => clear(ev)}
            />
          ) : (
            <CommonIconFont
              onClick={() => setIsVisible(true)}
              type={isOpen ? 'up' : 'down'}
              size={14}
              color="var(--neutral-n4)"
            />
          )}
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
          <SelectMain
            onChange={e => {
              setTimekey(e), dispatch(setSave(true))
            }}
            placeholder="按周期"
            list={[
              {
                name: '近7天',
                key: 7,
              },
              {
                name: '近15天',
                key: 15,
              },
              {
                name: '近1月',
                key: 1,
              },
              {
                name: '近3个月',
                key: 3,
              },
              {
                name: '自定义',
                key: 0,
              },
            ]}
          />
        ) : (
          <Sprint />
        )}
        {timekey === 0 && <RangePicker style={{ width: '283px' }} />}
      </Space>
      <AddMemberCommonModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onConfirm={data => onConfirm(data)}
      />
      {/* 另存为视图 */}
      <ViewDialog
        name={''}
        title={'另存为视图'}
        onConfirm={val => {
          console.log(123, val)
        }}
        onClose={() => setIsVisibleView(false)}
        isVisible={isVisibleView}
      />
    </HeaderRow>
  )
}
export default Iteration
