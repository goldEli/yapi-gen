/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import { Space, Spin } from 'antd'
import Header from '../Header'
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
  const { headerParmas, projectDataList } = useSelector(
    store => store.performanceInsight,
  )
  const navigate = useNavigate()
  const onClick = () => {
    const params = encryptPhp(
      JSON.stringify({
        data: props.data,
        projectId: props.projectId,
        type:
          props.num === 1
            ? `Progress_${props.homeType}`
            : `Defect_${props.homeType}`,
        homeType: props.homeType,
        title:
          props.num === 1 && props.homeType === 'all'
            ? '数据明细'
            : props.num === 1
            ? '工作进展对比'
            : '缺陷趋势分析',
        headerParmas,
        projectDataList,
        num: props.num,
      }),
    )
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
            <span>查看明细</span>
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
          <LotBox key={el.name} onClick={() => onClick()}>
            <LotBoxRow>
              <LotIcon>
                <CommonIconFont
                  type={el.icon}
                  size={16}
                  color="var(--auxiliary-text-t2-d2)"
                />
              </LotIcon>
              <div>
                <TextNum>
                  <span>{el.value}</span>
                  <span>{el.unit}</span>
                </TextNum>
                <Text size="12px" color="var(--neutral-n2)" onClick={() => 123}>
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
  const [projectId, setProjectId] = useState(0)
  const [charts6, setCharts6] = useState<Models.Efficiency.ChartPie>()
  const [charts4, setCharts4] = useState<Models.Efficiency.ChartBar>()
  const [charts1, setCharts1] = useState<Models.Efficiency.ChartBar>()
  const [charts2, setCharts2] = useState<Models.Efficiency.WorkChart>()
  const [charts3, setCharts3] = useState<Models.Efficiency.ChartPie>()
  const [charts5, setCharts5] = useState<Models.Efficiency.ChartSpline>()
  const [projectViewIds, setProjectViewIds] = useState<number[] | []>([])
  const [iterateViewIds, setIterateViewIds] = useState<number[] | []>([])
  const [viewDataList, setViewDataList] = useState<
    Array<Models.Efficiency.ViewItem>
  >([])
  // 'iteration''sprint' 'all'
  const [homeType, setHomeType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [viewTitle, setViewTitle] = useState('')
  const [workDataList, setWorkDataList] =
    useState<API.Sprint.GetStatisticsTotal.Result>()
  const [optionVal, setOptionVal] = useState<number>(0)
  const [defalutConfig, setDefalutConfig] =
    useState<Models.Efficiency.ViewItem>()
  useEffect(() => {
    if (paramsData) {
      setHomeType(paramsData.type)
      setProjectId(paramsData.projectId)
      getViewList({ project_id: paramsData.projectId, use_type: 3 })
    } else {
      setHomeType('all')
      setProjectId(0)
      getViewList({ project_id: 0, use_type: 3 })
    }
  }, [])
  const init = () => {
    // 缺陷现状和工作项现状
    getWorkList()
    // 新增工作top10对比
    getContrastNewWork('desc')
    // 完成率top10对比
    getCompletionRateChart('desc')
    // 阶段缺陷占比
    getDefectRatioChart('severity')
    // 集合图表
    getStatisticsOther()
  }
  const updateViewList = async (parmas: API.Efficiency.ViewsList.Params) => {
    const res = await viewsList(parmas)
    setViewDataList(res)
    dispatch(setViewType(viewType))
    setOptionVal(optionVal)
  }
  // 获取已有视图
  const getViewList = async (parmas: API.Efficiency.ViewsList.Params) => {
    const res = await viewsList(parmas)
    setViewDataList(res)
    const filterVal: Models.Efficiency.ViewItem | undefined = res.find(
      el => el.is_default === 1,
    )
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
          projectIds: filterVal?.config.project_id,
          view: {
            title: filterVal?.name,
            value: filterVal?.id,
          },
          iterate_ids: filterVal?.config.iterate_ids,
          period_time: filterVal?.config?.period_time,
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
                  undefined,
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
              iterate_ids:
                // eslint-disable-next-line no-undefined
                homeType === 'all' ? undefined : headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time: getDateStr(headerParmas.time.type),
              start_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[0]
                  : // eslint-disable-next-line no-undefined
                    undefined,
              end_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[1]
                  : // eslint-disable-next-line no-undefined
                    undefined,
            },
            project_id: projectId,
          })
        : await viewsUpdate({
            id: Number(key),
            project_id: projectId,
            name: val,
            config: {
              iterate_ids:
                // eslint-disable-next-line no-undefined
                homeType === 'all' ? undefined : headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time: getDateStr(headerParmas.time.type),
              start_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[0]
                  : // eslint-disable-next-line no-undefined
                    undefined,
              end_time:
                headerParmas.time.type === 0
                  ? headerParmas.time?.time?.[1]
                  : // eslint-disable-next-line no-undefined
                    undefined,
            },
          })
    if (res) {
      getMessage({
        msg: '保存成功',
        type: 'success',
      })
      // 刷新视图的接口,不是跟新的name,不刷新回显的name
      if (type === 'add') {
        updateViewList({ project_id: projectId, use_type: 3 })
      } else {
        viewTitle === val && type === 'add'
          ? updateViewList({ project_id: projectId, use_type: 3 })
          : getViewList({ project_id: projectId, use_type: 3 })
      }
    } else {
      getMessage({
        msg: '保存失败',
        type: 'error',
      })
    }
  }
  // 删除视图
  const onDelView = async (key: string) => {
    const res = await delView(Number(key))
    if (res) {
      getMessage({
        msg: '删除成功',
        type: 'success',
      })
      // 刷新视图的接口
      getViewList({ project_id: projectId, use_type: 3 })
    } else {
      getMessage({
        msg: '删除失败',
        type: 'error',
      })
    }
  }
  // 设置默认视图
  const onSetDefaulut = async (id: number) => {
    const res = await defaultView(id)
    if (res) {
      getMessage({
        msg: '设置成功',
        type: 'success',
      })
      // 刷新视图的接口
      getViewList({ project_id: projectId, use_type: 3 })
    } else {
      getMessage({
        msg: '设置失败',
        type: 'error',
      })
    }
  }
  // 获取下拉框的值视图的
  const onGetOptionValue = (title: string, value: number) => {
    setViewTitle(title)
    setOptionVal(value)
    const filterVal: Models.Efficiency.ViewItem | undefined = viewDataList.find(
      el => el.id === value,
    )
    setProjectViewIds(filterVal?.config.project_id || [])
    setIterateViewIds(filterVal?.config.iterate_ids || [])
    setDefalutConfig(filterVal)
  }
  // 缺陷现状和工作项现状
  //  '周期时间：two_week,four_week,one_month,three_month,six_month',
  const getWorkList = async () => {
    setLoading(true)
    const res = await getStatisticsTotal({
      project_id: projectId,
      project_ids: headerParmas.projectIds?.join(','),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[0]
          : // eslint-disable-next-line no-undefined
            undefined,

      end_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[1]
          : // eslint-disable-next-line no-undefined
            undefined,
      period_time:
        // eslint-disable-next-line no-undefined, no-negated-condition
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : headerParmas.iterate_ids?.length === 0 &&
            headerParmas.period_time === ''
          ? 'one_month'
          : '',
    })
    setWorkDataList(res)
    setLoading(false)
  }
  // 新增工作top10对比第一个图表
  const getContrastNewWork = async (str: string) => {
    const res = await contrastNewWork({
      project_id: projectId,
      project_ids: headerParmas.projectIds?.join(','),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[0]
          : // eslint-disable-next-line no-undefined
            undefined,

      end_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[1]
          : // eslint-disable-next-line no-undefined
            undefined,
      period_time:
        // eslint-disable-next-line no-undefined, no-negated-condition
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : headerParmas.iterate_ids?.length === 0 &&
            headerParmas.period_time === ''
          ? 'one_month'
          : '',
      sort: str,
    })
    setCharts1({
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.work_total),
    })
  }
  // 完成率top10对比 第4个图表
  const getCompletionRateChart = async (str: string) => {
    const res = await getCompletionRate({
      project_id: projectId,
      sort: str,
      project_ids: headerParmas.projectIds?.join(','),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[0]
          : // eslint-disable-next-line no-undefined
            undefined,

      end_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[1]
          : // eslint-disable-next-line no-undefined
            undefined,
      period_time:
        // eslint-disable-next-line no-undefined, no-negated-condition
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : headerParmas.iterate_ids?.length === 0 &&
            headerParmas.period_time === ''
          ? 'one_month'
          : '',
    })
    setCharts4({
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.work_total),
    })
  }
  // 阶段缺陷占比第6个图表
  const getDefectRatioChart = async (str: string) => {
    const res = await getDefectRatio({
      project_id: projectId,
      project_ids: headerParmas.projectIds?.join(','),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[0]
          : // eslint-disable-next-line no-undefined
            undefined,

      end_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[1]
          : // eslint-disable-next-line no-undefined
            undefined,
      period_time:
        // eslint-disable-next-line no-undefined, no-negated-condition
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : headerParmas.iterate_ids?.length === 0 &&
            headerParmas.period_time === ''
          ? 'one_month'
          : '',
      dimension: str,
    })
    setCharts6({
      time: `${res.start_time} ~ ${res.end_time}`,
      chartType: str,
      seriesData: res.list.map(el => [el.name!, parseInt(el.ratio!, 10)]),
    })
  }
  // 2,3,5图表集合
  const getStatisticsOther = async () => {
    const res = await statisticsOther({
      project_id: projectId,
      project_ids: headerParmas.projectIds?.join(','),
      iterate_ids: headerParmas.iterate_ids?.join(','),
      user_ids: headerParmas.users?.join(','),
      start_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[0]
          : // eslint-disable-next-line no-undefined
            undefined,

      end_time:
        headerParmas?.time?.type === 0
          ? headerParmas?.time?.time?.[1]
          : // eslint-disable-next-line no-undefined
            undefined,
      period_time:
        // eslint-disable-next-line no-undefined, no-negated-condition
        headerParmas?.time?.type !== 0
          ? headerParmas.period_time
          : headerParmas.iterate_ids?.length === 0 &&
            headerParmas.period_time === ''
          ? 'one_month'
          : '',
    })
    setCharts2({
      time: `${res.work_completion_period.start_time} ~ ${res.work_completion_period.end_time}`,
      yData: res.work_completion_period.list.map(el => el.start_time),
      seriesData: res.work_completion_period.list.map(el => el.completed),
    })
    setCharts3({
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
          name: '待修复',
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.not_fixed.map(el => parseInt(el.rate, 10)),
        },
        {
          name: '修复中',
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.fixing.map(el => parseInt(el.rate, 10)),
        },
        {
          name: '已完成',
          dataNum: res.defect_trend.fixed.map(el => el.number),
          data: res.defect_trend.fixed.map(el => parseInt(el.rate, 10)),
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
          headerParmas.time.type === 0
            ? headerParmas.time.time?.[0]
            : // eslint-disable-next-line no-undefined
              undefined,
        end_time:
          headerParmas.time.type === 0
            ? headerParmas.time.time?.[1]
            : // eslint-disable-next-line no-undefined
              undefined,
      },
    })
    if (res) {
      getMessage({
        msg: '保存成功',
        type: 'success',
      })
      // 刷新视图的接口
      updateViewList({ project_id: projectId, use_type: 3 })
      dispatch(setSave(false))
    } else {
      getMessage({
        msg: '保存失败',
        type: 'error',
      })
    }
  }

  useEffect(() => {
    // 统一监听参数变化，发起请求刷新页面
    if (
      !!headerParmas.time?.time &&
      !!headerParmas.period_time &&
      !headerParmas.iterate_ids &&
      !headerParmas.users &&
      !headerParmas.projectIds
    ) {
      return
    }
    if (headerParmas.time.type === 0 && !headerParmas.time.time) {
      return
    }
    if (!headerParmas.view.value) {
      return
    }
    init()
  }, [headerParmas])

  return (
    <div
      style={{
        overflowY: 'auto',
        height: 'calc(100% - 24px)',
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
        <WorkingStatus
          projectId={projectId}
          homeType={homeType}
          data={workDataList?.work || []}
          title={homeType === 'all' ? '现状' : '工作项现状'}
          time="2023-03-01 ~ 2023-03-14"
          num={1}
        />
        <div style={{ margin: '32px 0' }}>
          <WorkingStatus
            num={2}
            projectId={projectId}
            homeType={homeType}
            data={workDataList?.defect || []}
            title="缺陷现状"
            time="2023-03-01 ~ 2023-03-14"
          />
        </div>
        <div style={{ width: '100%', display: 'flex' }}>
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 24px',
              }}
            >
              <HightChartMainBar
                title={
                  homeType === 'all' ? '新增工作排行Top10' : '阶段新增工作Top10'
                }
                titleType
                height={396}
                chart={charts1}
                onChange={(val: any) => getContrastNewWork(val)}
              />
              <HightChartMainLine
                projectId={projectId}
                chart={charts2}
                title={homeType === 'all' ? '工作完成周期' : '工作周期对比'}
                height={396}
              />
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 24px',
              }}
            >
              <HightChartMainPie
                height={352}
                chart={charts3}
                titleType={false}
                title={homeType === 'all' ? '存量风险' : '阶段存量风险'}
              />
              {/* 柱状图 */}
              <HightChartMainBar
                titleType={false}
                chart={charts4}
                height={352}
                title={homeType === 'all' ? '完成率Top10' : '阶段完成率Top10'}
                onChange={(val: string) => {
                  getCompletionRateChart(val)
                }}
              />
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 24px',
              }}
            >
              <HightChartMainSpline
                title="缺陷趋势"
                chart={charts5}
                height={396}
              />
              <HightChartMainPie
                height={396}
                chart={charts6}
                titleType
                title="阶段缺陷占比"
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
                <span>检测到此视图有未保存的更改</span>
              </Space>
              <CommonIconFont
                onClick={() => dispatch(setSave(false))}
                type="close"
                size={16}
                color="var(--neutral-n2)"
              />
            </DialogHeader>
            <TextColor>单击“保存”按钮可以将更改保存在如下视图</TextColor>
            <div style={{ margin: '8px 0 0 32px' }}>
              <SelectMain
                onChange={e => {
                  setOptionVal(e)
                }}
                placeholder="请选择"
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
                  不保存
                </span>
              </Space>
              <Space size={16}>
                <CommonButton
                  type="light"
                  onClick={() => {
                    setIsVisible(true)
                    dispatch(setSave(false))
                  }}
                >
                  另存为
                </CommonButton>
                <CommonButton type="primary" onClick={() => editViews()}>
                  保存
                </CommonButton>
              </Space>
            </Footer>
          </DialogMain>
        ) : null}
        {/* 新建和编辑视图 1*/}
        <ViewDialog
          name=""
          titleType={{ title: '另存为视图', type: 'add' }}
          onConfirm={async (value, type) => {
            try {
              await onCreateView(value, type, '')
              setIsVisible(false)
            } catch (error) {
              console.log(error)
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
