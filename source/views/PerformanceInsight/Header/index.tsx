/* eslint-disable react/jsx-handler-names */
/* eslint-disable require-unicode-regexp */
import { DatePicker, Space } from 'antd'
import { useEffect, useState } from 'react'
import View from './components/View'
import { HeaderRow, Text, Tabs, DivStyle, Btn1 } from './Style'
import SelectMain from './components/SelectMain'
import { Left } from '../components/style'
import CommonIconFont from '@/components/CommonIconFont'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import Select from '../components/Select'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
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
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
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
      label: 'performance.time',
      key: '1',
    },
    {
      label: 'performance.cc',
      key: '2',
    },
  ]
  const tabs2 = [
    {
      label: 'performance.time',
      key: '1',
    },
    {
      label: 'performance.dd',
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
  const { save, viewType, headerParmas } = useSelector(
    store => store.performanceInsight,
  )
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [iterateApi, setIterateApi] = useState<any>([])
  const [projectApi, setProjectApi] = useState<any>()
  const projectId = paramsData?.id
  const [t] = useTranslation()
  // tads切换
  const getTabsActive = (index: number) => {
    setTabsActive(index)
    setTimekey(index)
    dispatch(
      setHeaderParmas({
        period_time: 'one_month',
        time: {
          type: 1,
        },
      }),
    )
  }
  useEffect(() => {
    props.homeType === 'iteration' || props.homeType === 'sprint'
      ? getIterateApi()
      : getProjectApi()
  }, [props.homeType])
  // 这两个是监听传过来的数组id，一开始展示10条，包含的id没在里面的情况
  useEffect(() => {
    // 展示的tabs不同
    props.homeType === 'iteration' && setTabs(tabs2)
    props.homeType === 'sprint' && setTabs(tabs1)
    setPerson(props.defalutConfig?.user_ids || [])
    getTime(props.defalutConfig?.period_time || '')
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
  }, [props.iterateViewIds, props.homeType, props.defalutConfig, iterateApi])
  const getIterateApi = async () => {
    const res: any = await recentCreateData({
      project_id: projectId,
      resource_type: props.homeType === 'iteration' ? 1 : 2,
    })
    setIterateApi(res)
  }
  const getProjectApi = async () => {
    const res = await getProjectList({
      // self: 1,
      all: 1,
    })
    setProjectApi(res)
  }
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
  }, [props.projectViewIds, props.homeType, props.defalutConfig, projectApi])
  const getIterateIdsList = async () => {
    const filterVal = iterateApi
      ?.filter((el: { id: number }) => props.iterateViewIds.includes(el.id))
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 默认展示10条数据
    setIterateDataAll(
      iterateApi?.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    const newData = iterateApi
      ?.slice(0, 10)
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    iterateApi.length < 10 && setMore1(true)
    // 判断里面是否有
    const hasIds = newData?.filter((el: { id: number }) =>
      props.iterateViewIds.includes(el.id),
    )
    hasIds?.length >= 1
      ? setIterateData([...newData])
      : setIterateData([...filterVal, ...newData])
    setIterateIds(props.iterateViewIds)
  }
  const getProjectIdsList = async () => {
    const filterVal = projectApi?.list
      ?.filter((el: { id: number }) => props.projectViewIds?.includes(el.id))
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 默认展示10条数据
    setProjectListAll(
      projectApi?.list?.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    const newData = projectApi?.list
      ?.slice(0, 10)
      .map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      }))
    // 判断里面是否有
    const hasIds = newData?.filter((el: { id: number }) =>
      props.iterateViewIds.includes(el.id),
    )
    hasIds?.length >= 1
      ? setProjectList([...newData])
      : setProjectList([...filterVal, ...newData])
    // 回显的项目id
    setProjectIds(props.projectViewIds || [])
  }
  // 获取近期的冲刺项目
  const getIterateData = async () => {
    setIterateDataAll(
      iterateApi.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    setIterateData(
      iterateApi.slice(0, 10).map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    iterateApi.length <= 10 && setMore1(true)
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
    // 默认展示10条数据
    setProjectListAll(
      projectApi?.list?.map((el: { id: number; name: string }) => ({
        ...el,
        label: el.name,
        value: el.id,
      })),
    )
    setProjectList(
      projectApi?.list
        ?.slice(0, 10)
        .map((el: { id: number; name: string }) => ({
          ...el,
          label: el.name,
          value: el.id,
        })),
    )
    projectApi?.list?.length <= 10 && setMore(true)
    dispatch(
      setProjectDataList(
        projectApi?.list?.map((el: { id: number; name: string }) => ({
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
    if (values[0] === '' && values[1] === '') {
      setTimeVal(values)
      dispatch(setSave(false))
      return
    }
    setTimeVal([moment(values[0]), moment(values[1])])
    dispatch(setSave(true))
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

        return new Date(mint?.replace(/-/g, '/')) >
          new Date(t?.replace(/-/g, '/'))
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
      return new Date(maxt?.replace(/-/g, '/')) <
        new Date(t?.replace(/-/g, '/'))
        ? t
        : maxt
    }, data[0].end_at)
    return maxt
  }
  console.log(props, 'props')
  return (
    <div>
      {(props.homeType === 'iteration' || props.homeType === 'sprint') && (
        <div
          style={{
            margin: '20px 0px 0px 24px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MyBreadcrumb />
        </div>
      )}
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
          <Text onClick={() => setIsVisibleView(true)}>
            {t('performance.save1')}
          </Text>
          {/* 保存需要人员，项目选择和时间修改后 */}
          {save && viewType !== 2 ? (
            <Text onClick={props.onEdit}>{t('performance.save')}</Text>
          ) : null}
        </Space>
        <Space size={16}>
          {/* 全部多一个下拉搜索条件，先传10个，查看更多展示完成 */}
          {props.homeType === 'all' && (
            <Select
              type=""
              placeholder={t('common.pleaseSelect')}
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
                <span>{t('project.member')}</span>
                <Btn1>{t('version2.checked', { count: person.length })}</Btn1>
              </Left>
            ) : (
              <span>{t('performance.all')}</span>
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
              {tabs.map((el: { label: any }, index) => (
                <span
                  className={tabsActive === index ? 'tabsActive' : ''}
                  onClick={() => getTabsActive(index)}
                  key={el.label}
                >
                  {t(el.label)}
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
                viewType === 1 && e !== 0 && dispatch(setSave(true))
                e === 0 && dispatch(setSave(false))
                e !== 0 &&
                  dispatch(
                    setHeaderParmas({
                      time: {
                        type: e,
                        time: '',
                      },
                      period_time: periodTimes.find(item => item.value === e)
                        ?.label,
                    }),
                  )
              }}
              value={timekey}
              placeholder={t('common.pleaseSelect')}
              list={[
                {
                  name: t('performance.tWeek'),
                  key: 14,
                },
                {
                  name: t('performance.fWeek'),
                  key: 28,
                },
                {
                  name: t('performance.oMonth'),
                  key: 1,
                },
                {
                  name: t('performance.tMonth'),
                  key: 3,
                },
                {
                  name: t('performance.sMonth'),
                  key: 6,
                },
                {
                  name: t('performance.custom'),
                  key: 0,
                },
              ]}
            />
          ) : (
            // 是否是迭代和冲刺的项目
            <Select
              type={props.homeType}
              placeholder={
                props.homeType === 'iteration'
                  ? t('performance.selectdd')
                  : t('performance.selectcc')
              }
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
        {props.homeType === 'all' ? (
          <NewAddUserModalForTandD
            title={t('calendarManager.add_a_member')}
            state={2}
            defaultPeople={headerParmas.users}
            isVisible={isVisible}
            onConfirm={onConfirm}
            onClose={() => setIsVisible(false)}
          />
        ) : (
          /* 项目走的 */
          <AddDepartmentOrTeamModal
            users={headerParmas.users}
            projectId={paramsData?.id}
            type={2}
            isVisible={isVisible}
            onConfirm={onConfirm}
            onClose={() => setIsVisible(false)}
          />
        )}

        {/* 另存为视图 */}
        <ViewDialog
          name=""
          titleType={{ title: t('performance.saveView'), type: 'add' }}
          onConfirm={async val => {
            try {
              await props.onCreateView(val, 'add')
              setIsVisibleView(false)
            } catch (error) {
              // console.log(error)
            }
          }}
          onClose={() => setIsVisibleView(false)}
          isVisible={isVisibleView}
        />
      </HeaderRow>
    </div>
  )
}
export default Iteration
