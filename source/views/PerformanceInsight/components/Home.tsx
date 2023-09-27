/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-negated-condition */
import CommonIconFont from '@/components/CommonIconFont'
import { Space, Spin } from 'antd'
import Header from '../Header'
import { useTranslation } from 'react-i18next'
import {
  setHeaderParmas,
  setSave,
  setViewType,
} from '@store/performanceInsight'
import { useDispatch } from 'react-redux'
import {
  Col,
  RightRow,
  Time,
  TitleCss,
  Text,
  DataWrap,
  LotBox,
  TextNum,
  LotBoxRow,
  LotIcon,
} from '../Header/Style'
import { DialogMain, DialogHeader, TextColor, Footer } from './style'
import { useEffect, useState } from 'react'
import SelectMain from '../Header/components/SelectMain'
import CommonButton from '@/components/CommonButton'
import { useSelector } from '@store/index'
import ViewDialog from '../Header/components/ViewDialog'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate, useSearchParams } from 'react-router-dom'
import HightChartMainBar from './HightChartMainBar'
import HightChartMainLine from './HightChartMainLine'
import HightChartMainPie from './HightChartMainPie'
import HightChartMainSpline from './HightChartMainSpline'
import {
  contrastNewWork,
  createViewList,
  defaultView,
  delView,
  getCompletionRate,
  getDefectRatio,
  getStatisticsTotal,
  statisticsOther,
  viewsList,
  viewsUpdate,
} from '@/services/efficiency'
import { getDate, getDateStr } from './Date'
import { getParamsData } from '@/tools'
import { getMessage } from '@/components/Message'
import NewLoadingTransition from '@/components/NewLoadingTransition'
const WorkingStatus = (props: Models.Efficiency.WorkingStatus) => {
  const [t] = useTranslation()
  const { headerParmas } = useSelector(store => store.performanceInsight)
  const navigate = useNavigate()
  const onClick = (el?: any) => {
    const params = encryptPhp(
      JSON.stringify({
        homePage: el?.icon === 'chart-06' ? 2 : 1,
        data: props.data,
        id: props.projectId || 314,
        projectId: props.projectId,
        type:
          props.num === 1
            ? `Progress_${props.homeType}`
            : `Defect_${props.homeType}`,
        homeType: props.homeType,
        headerParmas,
        num: props.num,
        viewType: props.viewType,
        title:
          props.num === 1 && props.homeType === 'all'
            ? t('performance.title05')
            : props.num === 1
            ? t('performance.title06')
            : t('performance.title07'),
        newType: props?.newType,
      }),
    )
    console.log(params, 'params')

    navigate(`/ChildLevel?data=${params}`)
  }
  return (
    <>
      <Col>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        <Text size="12px" onClick={() => onClick()}>
          <Space size={4}>
            <span style={{ display: 'inline-block', height: '20px' }}>
              {t('performance.watch')}
            </span>
            <CommonIconFont
              type="right"
              size={14}
              color="var(--auxiliary-text-t2-d2)"
            />
          </Space>
        </Text>
      </Col>
      <DataWrap>
        {props.data?.map(el => (
          <LotBox key={el.name} onClick={() => onClick(el)}>
            <LotBoxRow>
              <LotIcon>
                <CommonIconFont
                  type={el.icon}
                  size={20}
                  color={el.icon_color}
                />
              </LotIcon>
              <div>
                <TextNum>
                  <span>{el.value}</span>
                  <span>{el.unit}</span>
                </TextNum>
                <Text size="12px" color="var(--neutral-n2)">
                  <Space size={4}>
                    <span>{el.name}</span>
                    <CommonIconFont type="right" size={12} />
                  </Space>
                </Text>
              </div>
            </LotBoxRow>
          </LotBox>
        ))}
      </DataWrap>
    </>
  )
}
const Home = () => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const { save, headerParmas, viewType } = useSelector(
    store => store.performanceInsight,
  )
  const [t] = useTranslation()
  const [projectId, setProjectId] = useState(
    paramsData?.projectId ? paramsData?.projectId : '',
  )
  const [charts6, setCharts6] = useState<Models.Efficiency.ChartPie>()
  const [charts4, setCharts4] = useState<Models.Efficiency.ChartBar>({
    chartType: '',
    yData: [],
    seriesData: [],
    time: '',
    growth_rate: 0,
  })
  const [charts1, setCharts1] = useState<Models.Efficiency.ChartBar>({
    chartType: '',
    yData: [],
    seriesData: [],
    time: '',
    growth_rate: 0,
    period_number: 0,
  })
  const [charts2, setCharts2] = useState<Models.Efficiency.WorkChart>({
    growth_rate: 0,
    time: '',
    yData: [],
    seriesData: [],
    period_number: 0,
  })
  const [charts3, setCharts3] = useState<Models.Efficiency.ChartPie>()
  const [charts5, setCharts5] = useState<Models.Efficiency.ChartSpline>()
  const [projectViewIds, setProjectViewIds] = useState<number[] | []>([])
  const [iterateViewIds, setIterateViewIds] = useState<number[] | []>([])
  const [valueHeaderStr, setValueHeaderStr] = useState<string>('')
  const [viewDataList, setViewDataList] = useState<
    Array<Models.Efficiency.ViewItem>
  >([])
  // 'iteration''sprint' 'all'
  const [homeType, setHomeType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [viewTitle, setViewTitle] = useState('')
  const [workDataList, setWorkDataList] =
    useState<API.Sprint.GetStatisticsTotal.Result>({
      end_time: '',
      start_time: '',
      work: [],
      defect: [],
    })
  const [optionVal, setOptionVal] = useState<number>(0)
  const { isRefresh } = useSelector(store => store.user)
  const [defalutConfig, setDefalutConfig] =
    useState<Models.Efficiency.ViewItem>()
  const [valueId, setValueId] = useState(paramsData?.valueId || 0)
  const [viewValue, setViewValue] = useState(paramsData?.view?.value || 0)

  useEffect(() => {
    if (paramsData?.type && paramsData?.projectId) {
      setHomeType(paramsData.type)
      setProjectId(paramsData.projectId)
      getViewList({ project_id: paramsData.projectId, use_type: 3 })
    } else {
      setHomeType('all')
      setProjectId('')
      getViewList({ project_id: '', use_type: 3 })
    }
  }, [])
  useEffect(() => {
    isRefresh && init()
  }, [isRefresh])
  const init = () => {
    // 缺陷现状和任务现状
    getWorkList()
  }
  const getTimeOut = () => {
    // 新增工作top10对比
    getContrastNewWork('desc')
    // 完成率top10对比
    getCompletionRateChart('desc')
    // 阶段缺陷占比
    getDefectRatioChart('severity')
    // 集合图表
    getStatisticsOther()
  }
  useEffect(() => {
    isRefresh && init()
  }, [isRefresh])

  const updateViewList = async (parmas: API.Efficiency.ViewsList.Params) => {
    const res = await viewsList(parmas)
    setViewDataList(res)
    dispatch(setViewType(viewType))
  }
  // 获取已有视图
  const getViewList = async (parmas: API.Efficiency.ViewsList.Params) => {
    const res = await viewsList(parmas)
    setViewDataList(res)
    let filterVal: any = {}
    if (paramsData?.newType === 'other') {
      // 强制塞数据，默认视图修改它的配置
      filterVal = res.find(el => el.is_default === 1)
      filterVal.config = {
        end_time: paramsData.headerParmas.time.time[1],
        start_time: paramsData.headerParmas.time.time[0],
        user_ids: paramsData.headerParmas.users,
        period_time: paramsData.headerParmas.period_time,
        project_id: paramsData.headerParmas.projectIds,
        iterate_ids: paramsData.headerParmas.iterate_ids,
      }
    }
    // 分享回显取的配置
    else if (viewValue && valueId) {
      filterVal = res.find(el => el.id === Number(viewValue))
    } else if (viewValue && !valueId) {
      // 跳转详情,返回回来的回显
      filterVal = res.find(el => el.id === Number(viewValue))
      filterVal.config = {
        end_time: paramsData.headerParmas.time.time[1],
        start_time: paramsData.headerParmas.time.time[0],
        user_ids: paramsData.headerParmas.users,
        period_time: paramsData.headerParmas.period_time,
        project_id: paramsData.headerParmas.projectIds,
        iterate_ids: paramsData.headerParmas.iterate_ids,
      }
    }
    // 取默认视图配置
    else {
      filterVal = res.find(el => el.is_default === 1)
    }
    setOptionVal(filterVal?.id || 0)
    setViewTitle(filterVal?.name || '')
    setDefalutConfig(filterVal)
    dispatch(setViewType(filterVal?.type))
    setProjectViewIds(filterVal?.config.project_id || [])
    setIterateViewIds(filterVal?.config.iterate_ids || [])
    // 有视图数据才设置
    filterVal &&
      dispatch(
        setHeaderParmas({
          users: filterVal?.config.user_ids,
          projectIds: filterVal?.config.project_id || '',
          view: {
            title: filterVal?.name,
            value: filterVal?.id,
          },
          iterate_ids: filterVal?.config.iterate_ids,
          period_time: filterVal?.config?.period_time,
          time: {
            type:
              filterVal?.config.start_time === '' &&
              !filterVal?.config?.period_time
                ? 0
                : getDate(filterVal?.config?.period_time || ''),
            time:
              filterVal?.config.start_time == ''
                ? ''
                : [filterVal?.config?.start_time, filterVal?.config?.end_time],
          },
        }),
      )
  }
  // 创建和编辑视图的接口
  const onCreateView = async (val: string, type: string, key?: string) => {
    const res =
      type === 'add'
        ? await createViewList({
            use_type: 3,
            name: val,
            config: {
              iterate_ids: homeType === 'all' ? [] : headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time:
                headerParmas.time.type === 0
                  ? ''
                  : getDateStr(headerParmas.time.type)
                  ? getDateStr(headerParmas.time.type)
                  : 'one_month',
              start_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[0]
                  : '',
              end_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[1]
                  : '',
            },
            project_id: projectId,
          })
        : await viewsUpdate({
            id: Number(key),
            project_id: projectId,
            name: val,
            config: {
              iterate_ids: homeType === 'all' ? [] : headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time: getDateStr(headerParmas.time.type),
              start_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[0]
                  : '',
              end_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[1]
                  : '',
            },
          })
    if (res) {
      getMessage({ msg: t('common.saveSuccess'), type: 'success' })
      // 刷新视图的接口,不是跟新的name,不刷新回显的name
      if (type === 'add') {
        updateViewList({ project_id: projectId || '', use_type: 3 })
      } else {
        viewTitle === val && type === 'add'
          ? updateViewList({ project_id: projectId, use_type: 3 })
          : getViewList({ project_id: projectId || '', use_type: 3 })
      }
    } else {
      getMessage({
        msg: t('other.saveFailed'),
        type: 'error',
      })
    }
  }
  // 删除视图
  const onDelView = async (key: string) => {
    const res = await delView(Number(key))
    if (res) {
      getMessage({
        msg: t('common.deleteSuccess'),
        type: 'success',
      })
      // 刷新视图的接口
      getViewList({ project_id: projectId, use_type: 3 })
    } else {
      getMessage({
        msg: t('other.deleteFailed'),
        type: 'error',
      })
    }
  }
  // 设置默认视图
  const onSetDefaulut = async (id: number) => {
    const res = await defaultView(id)
    if (res) {
      getMessage({
        msg: t('other.setSuccess'),
        type: 'success',
      })
      // 刷新视图的接口
      updateViewList({ project_id: projectId, use_type: 3 })
    } else {
      getMessage({
        msg: t('other.setFailed'),
        type: 'error',
      })
    }
  }
  // 获取下拉框的值视图的
  const onGetOptionValue = (title: string, value: number, type: string) => {
    setViewTitle(title)
    setOptionVal(value)
    const filterVal: Models.Efficiency.ViewItem | undefined = viewDataList.find(
      el => el.id === value,
    )
    if (type) {
      setValueId(0)
      setViewValue(0)
      setProjectViewIds(filterVal?.config.project_id || [])
      setIterateViewIds(filterVal?.config.iterate_ids || [])
      setDefalutConfig(filterVal)
    }
  }
  // 缺陷现状和任务现状
  //  '周期时间：two_week,four_week,one_month,three_month,six_month',
  const getWorkList = async () => {
    setLoading(true)
    const res = await getStatisticsTotal({
      project_ids: headerParmas.projectIds
        ? headerParmas.projectIds?.join(',')
        : String(projectId),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[0] : '',

      end_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[1] : '',
      period_time:
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : !headerParmas.period_time
          ? ''
          : 'one_month',
    })
    getTimeOut()
    setWorkDataList(res)
    setLoading(false)
  }
  // 新增工作top10对比第一个图表
  const getContrastNewWork = async (str: string) => {
    const res = await contrastNewWork({
      project_ids: headerParmas.projectIds
        ? headerParmas.projectIds?.join(',')
        : String(projectId),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[0] : '',

      end_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[1] : '',
      period_time:
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : !headerParmas.period_time
          ? ''
          : 'one_month',
      sort: str,
    })
    setCharts1({
      growth_rate: res.growth_rate,
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.work_total),
      period_number: res.period_number,
    })
  }
  // 完成率top10对比 第4个图表
  const getCompletionRateChart = async (str: string) => {
    const res = await getCompletionRate({
      sort: str,
      project_ids: headerParmas.projectIds
        ? headerParmas.projectIds?.join(',')
        : String(projectId),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[0] : '',

      end_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[1] : '',
      period_time:
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : !headerParmas.period_time
          ? ''
          : 'one_month',
    })
    setCharts4({
      growth_rate: 0,
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.completion_rate),
    })
  }
  // 阶段缺陷占比第6个图表
  const getDefectRatioChart = async (str: string) => {
    const res = await getDefectRatio({
      project_ids: headerParmas.projectIds
        ? headerParmas.projectIds?.join(',')
        : String(projectId),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[0] : '',

      end_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[1] : '',
      period_time:
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : !headerParmas.period_time
          ? ''
          : 'one_month',
      dimension: str,
    })
    // 状态的颜色不同，ui换的
    setCharts6({
      color:
        str === 'status'
          ? ['#FA9746', '#43BA9A', '#6688FF']
          : ['#FF5C5E', '#FA9746', '#BBBDBF', '#6688FF', '#43BA9A', '#A176FB'],
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      seriesData: res.list.map(el => [el.name!, parseInt(el.ratio!, 10)]),
    })
  }
  // 2,3,5图表集合
  const getStatisticsOther = async () => {
    const res = await statisticsOther({
      project_ids: headerParmas.projectIds
        ? headerParmas.projectIds?.join(',')
        : String(projectId),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[0] : '',

      end_time:
        headerParmas?.time?.type === 0 ? headerParmas?.time?.time?.[1] : '',
      period_time:
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : !headerParmas.period_time
          ? ''
          : 'one_month',
    })
    const time = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    setCharts2({
      growth_rate: res.work_completion_period.growth_rate,
      time: `${res.work_completion_period.start_time} ~ ${res.work_completion_period.end_time}`,
      yData: res.work_completion_period.list.map((el, i) =>
        el.is_current
          ? t('other.current')
          : t('other.cycle', { count: time[i] as any }),
      ) as any,
      period_number: res.work_completion_period.period_number,
      seriesData: res.work_completion_period.list.map(el => el.completed),
    })
    setCharts3({
      time: `${res.risk_stock.start_time} ~ ${res.risk_stock.end_time}`,
      total: res.risk_stock.total,
      seriesData: res.risk_stock.list.map(el => [
        el.name,
        parseInt(el.ratio, 10),
      ]),
    })
    setCharts5({
      time: `${res.defect_trend.start_time} ~ ${res.defect_trend.end_time}`,
      yData: res.defect_trend.not_fixed.map(el => el.date),
      fixed_rate: res.defect_trend.fixed_rate,
      new_total: res.defect_trend.new_total,
      fixed_total: res.defect_trend.fixed_total,
      seriesData: [
        {
          name: t('performance.toBeFixed'),
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.not_fixed.map(el => parseInt(el.number, 10)),
        },
        {
          name: t('performance.repairing'),
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.fixing.map(el => parseInt(el.number, 10)),
        },
        {
          name: t('performance.completed'),
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.fixed.map(el => parseInt(el.number, 10)),
        },
      ],
    })
  }
  // 编辑视图走缓存的参数
  const editViews = async () => {
    const res = await viewsUpdate({
      id: headerParmas.view.value,
      project_id: projectId,
      name: headerParmas.view.title,
      status: 1,
      config: {
        iterate_ids: headerParmas.iterate_ids,
        project_id: headerParmas.projectIds,
        user_ids: headerParmas.users,
        period_time: getDateStr(headerParmas.time.type),
        start_time:
          headerParmas.time.type === 0 ? headerParmas.time.time?.[0] : '',
        end_time:
          headerParmas.time.type === 0 ? headerParmas.time.time?.[1] : '',
      },
    })
    if (res) {
      getMessage({ msg: t('common.saveSuccess'), type: 'success' })
      // 刷新视图的接口
      updateViewList({ project_id: projectId, use_type: 3 })
      dispatch(setSave(false))
    } else {
      getMessage({
        msg: t('other.saveFailed'),
        type: 'error',
      })
    }
  }
  useEffect(() => {
    if (headerParmas.view.value === 0) {
      return
    }
    // 监听对象第一次会走两次接口 转成字符窜判断
    setValueHeaderStr(JSON.stringify(headerParmas))
    if (headerParmas.time.type === 0 && !headerParmas.time.time) {
      return
    }
    if (
      !headerParmas.period_time &&
      headerParmas.time.type === 0 &&
      !headerParmas.time.time[0] &&
      headerParmas.iterate_ids?.length === 0
    ) {
      dispatch(
        setHeaderParmas({
          period_time: 'one_month',
        }),
      )
      return
    }

    valueHeaderStr !== JSON.stringify(headerParmas) && init()
  }, [headerParmas])

  useEffect(() => {
    setValueId(paramsData?.valueId)
    setViewValue(paramsData?.view?.value)
    if (paramsData?.type && paramsData?.projectId) {
      setHomeType(paramsData.type)
      setProjectId(paramsData.projectId)
      getViewList({ project_id: paramsData.projectId, use_type: 3 })
    } else {
      setHomeType('all')
      setProjectId('')
      getViewList({ project_id: '', use_type: 3 })
    }
  }, [])
  const saveOnchange = (e: any) => {
    setOptionVal(e)
    const filterVal: Models.Efficiency.ViewItem | undefined = viewDataList.find(
      el => el.id === e,
    )
    setDefalutConfig(filterVal)
    dispatch(
      setHeaderParmas({
        view: {
          title: filterVal?.name,
          value: e,
        },
        users: filterVal?.config.user_ids,
        projectIds: filterVal?.config.project_id,
        iterate_ids: filterVal?.config.iterate_ids,
        period_time: filterVal?.config.period_time,
        time: {
          type:
            filterVal?.config.period_time === ''
              ? 0
              : getDate(filterVal?.config?.period_time || ''),
          time:
            filterVal?.config.period_time === ''
              ? // eslint-disable-next-line no-undefined
                [filterVal?.config?.start_time, filterVal?.config?.end_time]
              : // eslint-disable-next-line no-undefined
                '',
        },
      }),
    )
  }
  return (
    <div
      style={{
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <Spin
        spinning={loading}
        indicator={<NewLoadingTransition />}
        size="large"
      >
        {/* 头部组件 */}
        <Header
          projectId={projectId}
          homeType={homeType || 'all'}
          defalutConfig={defalutConfig?.config}
          viewDataList={viewDataList}
          onCreateView={onCreateView}
          projectViewIds={projectViewIds}
          iterateViewIds={iterateViewIds}
          onDelView={onDelView}
          onChange={onGetOptionValue}
          onSetDefaulut={onSetDefaulut}
          onEdit={editViews}
          value={optionVal}
        />
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#F8F8FA',
          }}
        >
          <WorkingStatus
            newType={paramsData?.newType}
            projectId={projectId}
            viewType={viewType}
            homeType={homeType}
            data={workDataList?.work || []}
            title={
              homeType === 'all'
                ? t('performance.presentSituation')
                : t('performance.presentSituation1')
            }
            time={`${workDataList?.start_time} ~ ${workDataList.end_time}`}
            num={1}
          />
          <div style={{ margin: '12px 0' }}>
            <WorkingStatus
              viewType={viewType}
              num={2}
              projectId={projectId}
              homeType={homeType}
              data={workDataList?.defect || []}
              title={t('performance.qPresentSituation')}
              time={`${workDataList?.start_time} ~ ${workDataList?.end_time}`}
            />
          </div>
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%', paddingBottom: '24px' }}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  backgroundColor: '#F8F8FA',
                  borderRadius: '6px',
                }}
              >
                <HightChartMainBar
                  title={
                    homeType === 'all'
                      ? t('performance.title1')
                      : t('performance.title01')
                  }
                  titleType
                  height={396}
                  chart={charts1}
                  onChange={(val: any) => getContrastNewWork(val)}
                  projectId={projectId}
                  viewType={viewType}
                  homeType={homeType}
                  data={workDataList?.work || []}
                  time={`${workDataList?.start_time} ~ ${workDataList.end_time}`}
                  num={1}
                />
                <HightChartMainLine
                  projectId={projectId}
                  chart={charts2}
                  title={
                    homeType === 'all'
                      ? t('performance.title2')
                      : t('performance.title02')
                  }
                  height={396}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  backgroundColor: '#F8F8FA',
                  borderRadius: '6px',
                }}
              >
                <HightChartMainPie
                  height={352}
                  chart={charts3}
                  titleType={false}
                  title={
                    homeType === 'all'
                      ? t('performance.title3')
                      : t('performance.title03')
                  }
                />
                {/* 柱状图 */}
                <HightChartMainBar
                  titleType={false}
                  chart={charts4}
                  height={352}
                  title={
                    homeType === 'all'
                      ? t('performance.title4')
                      : t('performance.title04')
                  }
                  onChange={(val: string) => {
                    getCompletionRateChart(val)
                  }}
                  projectId={projectId}
                  viewType={viewType}
                  homeType={homeType}
                  data={workDataList?.work || []}
                  time={`${workDataList?.start_time} ~ ${workDataList.end_time}`}
                  num={1}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  backgroundColor: '#F8F8FA',
                  borderRadius: '6px',
                }}
              >
                <HightChartMainSpline
                  title={t('performance.title5')}
                  chart={charts5}
                  height={396}
                />
                <HightChartMainPie
                  height={396}
                  chart={charts6}
                  titleType
                  title={t('performance.home9')}
                  onChange={item => getDefectRatioChart(item.key)}
                />
              </div>
            </div>
          </div>
          {/* 保存提示操作 */}
          {save && viewType !== 2 ? (
            <DialogMain>
              <DialogHeader>
                <Space size={14}>
                  <CommonIconFont
                    type="Warning"
                    size={20}
                    color="var(--function-warning)"
                  />
                  <span>{t('performance.save1Msg')}</span>
                </Space>
                <CommonIconFont
                  onClick={() => dispatch(setSave(false))}
                  type="close"
                  size={20}
                  color="var(--neutral-n2)"
                />
              </DialogHeader>
              <TextColor>{t('performance.save2Msg')}</TextColor>
              <div style={{ margin: '8px 0 0 32px' }}>
                <SelectMain
                  onChange={e => {
                    saveOnchange(e)
                  }}
                  placeholder={t('common.pleaseSelect')}
                  allowClear={false}
                  value={optionVal}
                  list={viewDataList?.map(el => ({
                    name: el.name,
                    key: Number(el.key),
                  }))}
                />
              </div>
              <Footer>
                <Space size={6}>
                  <span
                    style={{
                      color: 'var(--auxiliary-text-t2-d1)',
                      cursor: 'pointer',
                    }}
                    onClick={() => dispatch(setSave(false))}
                  >
                    {t('performance.nosave')}
                  </span>
                </Space>
                <Space size={20}>
                  <CommonButton
                    type="light"
                    onClick={() => {
                      setIsVisible(true)
                      dispatch(setSave(false))
                    }}
                  >
                    {t('performance.save1')}
                  </CommonButton>
                  <CommonButton type="primary" onClick={() => editViews()}>
                    {t('performance.save')}
                  </CommonButton>
                </Space>
              </Footer>
            </DialogMain>
          ) : null}
        </div>

        {/* 新建和编辑视图 1*/}
        <ViewDialog
          name=""
          titleType={{ title: t('performance.saveView'), type: 'add' }}
          onConfirm={async (value, type) => {
            try {
              await onCreateView(value, type, '')
              setIsVisible(false)
            } catch (error) {
              //
            }
          }}
          onClose={() => setIsVisible(false)}
          isVisible={isVisible}
        />
      </Spin>
    </div>
  )
}
export default Home
