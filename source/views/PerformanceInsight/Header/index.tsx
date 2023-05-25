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
import {
  setSave,
  setHeaderParmas,
  setProjectDataList,
} from '@store/performanceInsight'
import { useDispatch } from 'react-redux'
import ViewDialog from './components/ViewDialog'
import { getProjectList } from '@/services/project'
import dayjs from 'dayjs'
interface ItemProps {
  name: string
  id: number
}
interface Props {
  homeType: string
}
const Iteration = (props: Props) => {
  // sprint  iteration all
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
  const { RangePicker } = DatePicker
  const dateFormat = 'YYYY-MM-DD'
  const [more, setMore] = useState<boolean>(false)
  const [person, setPerson] = useState<ItemProps[] | []>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleView, setIsVisibleView] = useState<boolean>(false)
  const [projectListAll, setProjectListAll] = useState([])
  const [projectList, setProjectList] = useState([])
  // 项目的id
  const [projectIds, setProjectIds] = useState<number[]>()
  const dispatch = useDispatch()
  const { save, headerParmas } = useSelector(store => store.performanceInsight)
  const getTabsActive = (index: number) => {
    setTabsActive(index)
  }
  useEffect(() => {
    props.homeType === 'iteration' && setTabs(tabs2)
    props.homeType === 'sprint' && setTabs(tabs1)
    props.homeType === 'all' && getProjectData()
  }, [])
  // 获取项目列表
  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    // 默认展示10条数据
    setProjectListAll(
      res.list.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    setProjectList(
      res.list.slice(0, 10).map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    res.list.length <= 10 && setMore(true)
    dispatch(
      setProjectDataList(
        res.list.map((el: { id: number; name: string }) => ({
          ...el,
          label: el.name,
          value: el.id,
        })),
      ),
    )
  }
  // 选择项目展开全部
  const onShowAll = () => {
    setProjectList(projectListAll)
    setMore(true)
  }
  // 成员保存弹窗提示需要
  const onConfirm = (data: Array<{ name: string; id: number }>) => {
    dispatch(setSave(true))
    setIsVisible(false)
    setPerson(data)
    dispatch(
      setHeaderParmas({
        users: data,
        projectIds,
        time: headerParmas.time,
        view: headerParmas.view,
      }),
    )
  }
  // 清除选择的成员
  const onClear = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setPerson([])
  }
  // 自定义时间
  const onChangeDate = (e: any, values: string[]) => {
    dispatch(
      setHeaderParmas({
        users: person,
        projectIds: headerParmas.projectIds,
        time: {
          type: 0,
          time: values,
        },
        view: headerParmas.view,
      }),
    )
  }
  return (
    <HeaderRow>
      <Space size={16}>
        <View />
        <Text onClick={() => setIsVisibleView(true)}>另存为</Text>
        {/* 保存需要人员，项目选择和时间修改后 */}
        {save && <Text>保存</Text>}
      </Space>
      <Space size={16}>
        {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
        {props.homeType === 'all' && (
          <Select
            placeholder="请选择项目"
            options={projectList}
            more={more}
            onChange={(value: number[]) => {
              dispatch(setSave(true)), setProjectIds(value)
              dispatch(
                setHeaderParmas({
                  users: person,
                  projectIds: value,
                  view: headerParmas.view,
                  time: {
                    type: timekey,
                    time: '',
                  },
                }),
              )
            }}
            onShowAll={onShowAll}
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
              onClick={onClear}
            />
          ) : (
            <CommonIconFont
              onClick={() => setIsVisible(true)}
              type={isVisible ? 'up' : 'down'}
              size={14}
              color="var(--neutral-n4)"
            />
          )}
        </DivStyle>
        {(props.homeType === 'sprint' || props.homeType === 'iteration') && (
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
              dispatch(
                setHeaderParmas({
                  userIds: person.map(el => el.id),
                  projectIds,
                  time: e,
                  view: headerParmas.view,
                }),
              )
            }}
            value={1}
            placeholder="请选择周期"
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
        {timekey === 0 && (
          <RangePicker
            format={(times: moment.Moment) => {
              if (times.unix() === -28800 || times.unix() === 1893427200) {
                return ''
              }
              return times.format('YYYY-MM-DD')
            }}
            onChange={onChangeDate}
            style={{ width: '283px' }}
          />
        )}
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
