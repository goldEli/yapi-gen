/* eslint-disable react/jsx-handler-names */
// eslint-disable typescript-eslint/no-extra-semi
import { DatePicker, Space } from 'antd'
import { useEffect, useState } from 'react'
import View from './components/View'
import Sprint from './components/Sprint'
import { HeaderRow, Text, Tabs, DivStyle, Btn1 } from './Style'
import SelectMain from './components/SelectMain'
import { Left } from '../components/style'
import CommonIconFont from '@/components/CommonIconFont'
import Select from '../components/Select'
import { useSelector } from '@store/index'
import {
  setSave,
  setHeaderParmas,
  setProjectDataList,
} from '@store/performanceInsight'
import { useDispatch } from 'react-redux'
import ViewDialog from './components/ViewDialog'
import { getProjectList } from '@/services/project'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import moment from 'moment'
import { getDate } from '../components/Date'
import { recentCreateData } from '@/services/efficiency'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
interface ItemProps {
  name: string
  id: number
}
interface Props {
  homeType: string
  viewDataList: Array<Models.Efficiency.ViewItem> | undefined
  onCreateView(value: string, type: string, key?: string): void
  onDelView(key: string): void
  onSetDefaulut(id: number): void
  onChange(title: string, value: number): void
  defalutConfig: Models.Efficiency.ConfigItem | undefined
  onEdit(): void
  value: number
  projectId: number
}
const periodTimes = [
  { label: 'two_week', value: 14 },
  { label: 'four_week', value: 28 },
  { label: 'one_month', value: 1 },
  { label: 'three_month', value: 3 },
  { label: 'six_month', value: 6 },
]

const Iteration = (props: Props) => {
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
  const [more, setMore] = useState<boolean>(false)
  const [person, setPerson] = useState<ItemProps[] | []>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleView, setIsVisibleView] = useState<boolean>(false)
  const [projectListAll, setProjectListAll] = useState([])
  const [projectList, setProjectList] = useState([])
  const [timeVal, setTimeVal] = useState<any>()
  const [iterateData, setIterateData] =
    useState<API.Sprint.RecentCreateData.Result>([])
  // 项目的id
  const [projectIds, setProjectIds] = useState<number[]>()
  const [iterateIds, setIterateIds] = useState<any>()
  const dispatch = useDispatch()
  const { save } = useSelector(store => store.performanceInsight)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  // tads切换
  const getTabsActive = (index: number) => {
    setTabsActive(index)
    setTimekey(index)
  }

  useEffect(() => {
    // 展示的tabs不同
    if (props.homeType === 'iteration' || props.homeType === 'sprint') {
      getIterateData()
    }
    props.homeType === 'iteration' && setTabs(tabs2)
    props.homeType === 'sprint' && setTabs(tabs1)
    props.homeType === 'all' && getProjectData()
  }, [props.homeType])
  // 获取近期的冲刺项目
  const getIterateData = async () => {
    const res = await recentCreateData({
      project_id: projectId,
      resource_type: props.homeType === 'iteration' ? 6 : 9,
    })
    setIterateData(res)
  }
  useEffect(() => {
    // 回显的项目id
    setProjectIds(props.defalutConfig?.project_id)
    setTabsActive(
      props.defalutConfig?.period_time !== '' ||
        props.defalutConfig?.start_time !== ''
        ? 0
        : 1,
    )
    getTime(props.defalutConfig?.period_time || 'four_week')
    props.defalutConfig &&
      props.defalutConfig?.period_time === '' &&
      props.defalutConfig?.start_time === '' &&
      setIterateIds(
        props.defalutConfig?.iterate_ids?.length === 0
          ? // eslint-disable-next-line no-undefined
            undefined
          : props.defalutConfig?.iterate_ids?.[0],
      )
  }, [props.defalutConfig])
  // 获取时间回显
  const getTime = (type: string) => {
    const date = getDate(type)
    setTimekey(date)
    props.defalutConfig?.start_time &&
      props.defalutConfig?.end_time &&
      setTimeVal([
        moment(props.defalutConfig.start_time),
        moment(props.defalutConfig.end_time),
      ])
    !props.defalutConfig?.start_time &&
      !props.defalutConfig?.end_time &&
      props.defalutConfig?.period_time === '' &&
      setTimekey(1)
  }
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
        // eslint-disable-next-line no-undefined
        users: data?.length ? data.map(k => k.id) : undefined,
      }),
    )
  }
  // 清除选择的成员
  const onClear = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setPerson([])
    dispatch(
      setHeaderParmas({
        // eslint-disable-next-line no-undefined
        users: undefined,
      }),
    )
  }
  // 自定义时间
  const onChangeDate = (e: any, values: string[]) => {
    setTimeVal([moment(values[0]), moment(values[1])])
    dispatch(
      setHeaderParmas({
        time: {
          type: 0,
          time: values,
        },
      }),
    )
  }
  // 冲刺选择的
  const oniterateChange = (val: number) => {
    dispatch(
      setHeaderParmas({
        // eslint-disable-next-line no-undefined
        period_time: undefined,
        time: {
          // eslint-disable-next-line no-undefined
          time: undefined,
          // eslint-disable-next-line no-undefined
          type: undefined,
        },
        // eslint-disable-next-line no-undefined
        iterate_ids: val === 0 ? undefined : [...[val]],
      }),
    )
  }

  return (
    <HeaderRow>
      <Space size={16}>
        <View
          onChange={props.onChange}
          value={props.value}
          viewDataList={props.viewDataList}
          onCreateView={props.onCreateView}
          onDelView={props.onDelView}
          defalutConfig={props.defalutConfig}
          onSetDefaulut={props.onSetDefaulut}
        />
        <Text onClick={() => setIsVisibleView(true)}>另存为</Text>
        {/* 保存需要人员，项目选择和时间修改后 */}
        {save ? <Text onClick={props.onEdit}>保存</Text> : null}
      </Space>
      <Space size={16}>
        {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
        {props.homeType === 'all' && (
          <Select
            placeholder="请选择项目"
            options={projectList}
            more={more}
            value={projectIds || []}
            onChange={(value: number[]) => {
              setProjectIds(value),
                dispatch(setSave(true)),
                dispatch(
                  setHeaderParmas({
                    projectIds: value,
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
              type="close-solid"
              size={14}
              color="var(--neutral-n4)"
              onClick={() => onClear}
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
                className={tabsActive === index ? 'tabsActive' : ''}
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
            allowClear={false}
            onChange={e => {
              setTimekey(e)
              setTimeVal([])
              dispatch(setSave(true))
              dispatch(
                setHeaderParmas({
                  time: {
                    type: e,
                    // eslint-disable-next-line no-undefined
                    time: undefined,
                  },
                  period_time: periodTimes.find(item => item.value === e)
                    ?.label,
                }),
              )
            }}
            value={timekey}
            placeholder="请选择周期"
            list={[
              {
                name: '最近2周',
                key: 14,
              },
              {
                name: '最近4周',
                key: 28,
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
                name: '近6个月',
                key: 6,
              },
              {
                name: '自定义',
                key: 0,
              },
            ]}
          />
        ) : (
          <Sprint
            homeType={props.homeType}
            data={iterateData}
            value={iterateIds}
            onChange={oniterateChange}
          />
        )}
        {timekey === 0 && (
          <RangePicker
            value={timeVal}
            onChange={onChangeDate}
            style={{ width: '283px' }}
          />
        )}
      </Space>
      <NewAddUserModalForTandD
        title="添加成员"
        state={2}
        isVisible={isVisible}
        onConfirm={onConfirm}
        onClose={() => setIsVisible(false)}
      />
      {/* 另存为视图 */}
      <ViewDialog
        name=""
        titleType={{ title: '另存为视图', type: 'add' }}
        onConfirm={async val => {
          try {
            await props.onCreateView(val, 'add')
            setIsVisibleView(false)
          } catch (error) {
            console.log(error)
          }
        }}
        onClose={() => setIsVisibleView(false)}
        isVisible={isVisibleView}
      />
    </HeaderRow>
  )
}
export default Iteration
