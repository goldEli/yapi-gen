/* eslint-disable react/jsx-handler-names */
/* eslint-disable require-unicode-regexp */
import { DatePicker, Space } from 'antd'
import { useEffect, useState } from 'react'
import View from './components/View'
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
  projectViewIds: any
  iterateViewIds: any
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
  const [more1, setMore1] = useState<boolean>(false)
  const [person, setPerson] = useState<any>([])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isVisibleView, setIsVisibleView] = useState<boolean>(false)
  const [projectListAll, setProjectListAll] = useState([])
  const [projectList, setProjectList] = useState<any>([])
  const [timeVal, setTimeVal] = useState<any>()
  const [iterateData, setIterateData] = useState<any>([])
  const [iterateDataAll, setIterateDataAll] = useState<any>([])
  // 项目的id
  const [projectIds, setProjectIds] = useState<number[]>()
  const [iterateIds, setIterateIds] = useState<any>()
  const dispatch = useDispatch()
  const { save, viewType } = useSelector(store => store.performanceInsight)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  // tads切换
  const getTabsActive = (index: number) => {
    setTabsActive(index)
    setTimekey(index)
    dispatch(
      setHeaderParmas({
        iterate_ids: [],
        period_time: 'one_month',
        time: {
          type: 1,
        },
      }),
    )
  }
  // 这两个是监听传过来的数组id，一开始展示10条，包含的id没在里面的情况
  useEffect(() => {
    // 展示的tabs不同
    props.homeType === 'iteration' && setTabs(tabs2)
    props.homeType === 'sprint' && setTabs(tabs1)
    setPerson(props.defalutConfig?.user_ids || [])
    getTime(props.defalutConfig?.period_time || 'one_month')
    // 回显是否是迭代还是周期
    if (props.iterateViewIds.length >= 1) {
      props.homeType === 'iteration' || props.homeType === 'sprint'
        ? getIterateIdsList()
        : null
      setTabsActive(1)
    } else {
      props.homeType === 'iteration' || props.homeType === 'sprint'
        ? getIterateData()
        : null
      setTabsActive(0)
      setIterateIds([])
    }
  }, [props.iterateViewIds, props.homeType, props.defalutConfig])
  useEffect(() => {
    if (props.projectViewIds.length >= 1) {
      props.homeType === 'all' && getProjectIdsList()
      props.homeType === 'all' && setTabsActive(0)
    } else {
      props.homeType === 'all' && getProjectData()
      props.homeType === 'all' && setTabsActive(0)
      // 回显的项目id
      setProjectIds([])
    }
  }, [props.projectViewIds, props.homeType, props.defalutConfig])
  const getIterateIdsList = async () => {
    const res = await recentCreateData({
      project_id: projectId,
      resource_type: props.homeType === 'iteration' ? 1 : 2,
    })
    const filterVal = res
      .filter((el: { id: number }) => props.iterateViewIds.includes(el.id))
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 默认展示10条数据
    setIterateDataAll(
      res.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    const newData = res
      .slice(0, 10)
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    res.length < 10 && setMore1(true)
    // 判断里面是否有
    const hasIds = newData.filter(el => props.iterateViewIds.includes(el.id))
    hasIds
      ? setIterateData([...newData])
      : setIterateData([...filterVal, ...newData])
    setIterateIds(props.iterateViewIds)
  }
  const getProjectIdsList = async () => {
    const res = await getProjectList({
      // self: 1,
      all: 1,
    })
    const filterVal = res.list
      .filter((el: { id: number }) => props.projectViewIds?.includes(el.id))
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 默认展示10条数据
    setProjectListAll(
      res.list.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    const newData = res.list
      .slice(0, 10)
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 判断里面是否有
    const hasIds = newData.filter((el: { id: number }) =>
      props.iterateViewIds.includes(el.id),
    )
    hasIds
      ? setProjectList([...newData])
      : setProjectList([...filterVal, ...newData])
    // 回显的项目id
    setProjectIds(props.projectViewIds || [])
  }
  // 获取近期的冲刺项目
  const getIterateData = async () => {
    const res = await recentCreateData({
      project_id: projectId,
      resource_type: props.homeType === 'iteration' ? 1 : 2,
    })
    setIterateDataAll(
      res.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    setIterateData(
      res.slice(0, 10).map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    res.length <= 10 && setMore1(true)
  }

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
      // self: 1,
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
  // 成员保存弹窗提示需要
  const onConfirm = (data: Array<{ name: string; id: number }>) => {
    viewType === 1 && dispatch(setSave(true))
    setIsVisible(false)
    setPerson(data)
    dispatch(setSave(true))
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
        period_time: '',
        time: {
          type: 0,
          time: values,
        },
      }),
    )
  }
  // 迭代和冲刺的选择
  const oniterateChange = (val: number[]) => {
    const tempObj = iterateData.filter((k: any) => val.includes(k.id))
    viewType === 1 && dispatch(setSave(true))
    dispatch(
      setHeaderParmas({
        iterate_ids: val,
        period_time: '',
        time: {
          type: 0,
          time: [
            tempObj.length >= 1 ? minDate(tempObj) : '',
            tempObj.length >= 1 ? maxDate(tempObj) : '',
          ],
        },
      }),
    )
    setIterateIds(val)
  }
  // 全部冲刺或者全部迭代
  const onAllProject = (type: string) => {
    const iterateIds = iterateData.map((el: { id: number }) => el.id)
    setIterateIds(iterateIds)
    dispatch(
      setHeaderParmas({
        iterate_ids: iterateIds,
        period_time: '',
        time: {
          type: 0,
          time: [minDate(iterateData), maxDate(iterateData)],
        },
      }),
    )
  }
  // 获取最小时间
  const minDate = (data: any) => {
    let mint: string = data.reduce(
      (mint: string, item: { start_at: string }) => {
        let t: any = item.start_at

        return new Date(mint.replace(/-/g, '/')) >
          new Date(t.replace(/-/g, '/'))
          ? t
          : mint
      },
      data[0].start_at,
    )
    return mint
  }
  // 获取最大时间
  const maxDate = (data: any) => {
    let maxt = data.reduce((maxt: string, item: { end_at: string }) => {
      let t: any = item.end_at
      return new Date(maxt.replace(/-/g, '/')) < new Date(t.replace(/-/g, '/'))
        ? t
        : maxt
    }, data[0].end_at)
    return maxt
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
        {save && viewType !== 2 ? (
          <Text onClick={props.onEdit}>保存</Text>
        ) : null}
      </Space>
      <Space size={16}>
        {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
        {props.homeType === 'all' && (
          <Select
            type=""
            placeholder="请选择项目"
            options={projectList}
            more={more}
            value={projectIds || []}
            onChange={(value: number[]) => {
              setProjectIds(value), viewType === 1 && dispatch(setSave(true))
              dispatch(
                setHeaderParmas({
                  projectIds: value,
                }),
              )
            }}
            onShowAll={() => {
              setProjectList(projectListAll), setMore(true)
            }}
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
              onClick={e => onClear(e)}
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
              viewType === 1 && dispatch(setSave(true))
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
          // 是否是迭代和冲刺的项目
          <Select
            type={props.homeType}
            placeholder="请选择项目"
            options={iterateData}
            more={more1}
            value={iterateIds || []}
            onChange={(value: number[]) => oniterateChange(value)}
            onAllProject={onAllProject}
            onShowAll={() => {
              setMore1(true), setIterateDataAll(iterateDataAll)
            }}
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
