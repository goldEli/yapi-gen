/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Header from '../Header'
import { setHeaderParmas, setSave } from '@store/performanceInsight'
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
        <Text size={'12px'} onClick={() => onClick()}>
          <Space size={4}>
            <span>查看明细</span>
            <CommonIconFont
              type={'right'}
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
                <Text
                  size={'12px'}
                  color={'var(--neutral-n2)'}
                  onClick={() => 123}
                >
                  <Space size={4}>
                    <span>{el.name}</span>
                    <CommonIconFont type={'right'} size={12} />
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
  const { save, headerParmas } = useSelector(store => store.performanceInsight)
  const [projectId, setProjectId] = useState(0)
  const [charts6, setCharts6] = useState<Models.Efficiency.ChartPie>()
  const [charts4, setCharts4] = useState<Models.Efficiency.ChartBar>()
  const [charts1, setCharts1] = useState<Models.Efficiency.ChartBar>()
  const [charts2, setCharts2] = useState<Models.Efficiency.WorkChart>()
  const [charts3, setCharts3] = useState<Models.Efficiency.ChartPie>()
  const [charts5, setCharts5] = useState<Models.Efficiency.ChartSpline>()
  const [viewDataList, setViewDataList] = useState<
    Array<Models.Efficiency.ViewItem>
  >([])
  // 'iteration''sprint' 'all'
  const [homeType, setHomeType] = useState('all')
  const [workDataList, setWorkDataList] =
    useState<API.Sprint.GetStatisticsTotal.Result>()
  const [optionVal, setOptionVal] = useState<number>(0)
  const [defalutConfig, setDefalutConfig] =
    useState<Models.Efficiency.ConfigItem>()
  useEffect(() => {
    console.log(paramsData, 'paramsData')
    if (paramsData) {
      setHomeType(paramsData.type)
      setProjectId(paramsData.projectId)
    } else {
      setHomeType('all')
      setProjectId(0)
    }
    // 缺陷现状和工作项现状
    getWorkList()
    // 新增工作top10对比
    getContrastNewWork('desc')
    // 完成率top10对比
    getCompletionRateChart('desc')
    //阶段缺陷占比
    getDefectRatioChart('severity')
    // 集合图表
    getStatisticsOther()
    // 视图列表
    getViewList({ project_id: '1', use_type: 3 })
  }, [])
  const getViewList = async (parmas: API.Efficiency.ViewsList.Params) => {
    const res = await viewsList(parmas)
    setViewDataList(res)
    let filterVal: Models.Efficiency.ViewItem | undefined = res.find(
      el => el.is_default === 1,
    )
    setOptionVal(filterVal?.id || 0)
    setDefalutConfig(filterVal?.config)
    dispatch(
      setHeaderParmas({
        users: filterVal?.config.user_ids,
        projectIds: filterVal?.config.project_id,
        view: {
          title: filterVal?.name,
          value: filterVal?.id,
        },
        iterate_ids: filterVal?.config.iterate_ids,
        time: {
          type:
            filterVal?.config.period_time === ''
              ? 0
              : getDate(filterVal?.config?.period_time || ''),
          time:
            filterVal?.config.period_time === ''
              ? 0
              : getDate(filterVal?.config?.period_time || ''),
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
              iterate_ids: headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time: getDateStr(headerParmas.time.type),
              start_time:
                headerParmas.time.type == 0 ? headerParmas.time.time[0] : '',
              end_time:
                headerParmas.time.type == 0 ? headerParmas.time.time[1] : '',
            },
            project_id: 18,
          })
        : await viewsUpdate({
            id: Number(key),
            project_id: 1,
            name: val,
            config: {
              iterate_ids: headerParmas.iterate_ids,
              project_id: headerParmas.projectIds,
              user_ids: headerParmas.users,
              period_time: getDateStr(headerParmas.time.type),
              start_time:
                headerParmas.time.type == 0 ? headerParmas.time.time[0] : '',
              end_time:
                headerParmas.time.type == 0 ? headerParmas.time.time[1] : '',
            },
          })
    // // 刷新视图的接口
    // getViewList({ project_id: '1', use_type: 3 })
  }
  // 删除视图
  const onDelView = async (key: string) => {
    // const res = await delView(Number(key))
    // // 刷新视图的接口
    // getViewList({ project_id: '1', use_type: 3 })
  }
  // 设置默认视图
  const onSetDefaulut = async (id: number) => {
    const res = await defaultView(id)
  }
  // 获取下拉框的值视图的
  const onGetOptionValue = (title: string, value: number) => {
    setOptionVal(value)
    let filterVal: Models.Efficiency.ViewItem | undefined = viewDataList.find(
      el => el.id === value,
    )
    setDefalutConfig(filterVal?.config)
    dispatch(
      setHeaderParmas({
        users: headerParmas.users,
        projectIds: headerParmas.projectIds,
        time: headerParmas.time,
        iterate_ids: headerParmas.iterate_ids,
        view: {
          title,
          value,
        },
      }),
    )
  }
  // 缺陷现状和工作项现状
  const getWorkList = async () => {
    let res = await getStatisticsTotal({
      project_ids: [1, 2],
      iterate_ids: [12, 23],
      user_ids: [1, 23, 44],
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
      period_time:
        '周期时间：two_week,four_week,one_month,three_month,six_month',
    })
    setWorkDataList(res)
  }
  // 新增工作top10对比第一个图表
  const getContrastNewWork = async (str: string) => {
    const res = await contrastNewWork({
      project_ids: '1,2',
      iterate_ids: '12,23',
      user_ids: '12,23,707',
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
      sort: str,
    })
    setCharts1({
      time: res.start_time + ' ~ ' + res.end_time,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.work_total),
    })
  }
  // 完成率top10对比 第4个图表
  const getCompletionRateChart = async (str: string) => {
    let res = await getCompletionRate({
      project_ids: '1,2',
      iterate_ids: '12,23',
      user_ids: '12,23,707',
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
      sort: str,
    })
    setCharts4({
      time: res.start_time + ' ~ ' + res.end_time,
      chartType: str,
      yData: res.list.map(el => el.user_name),
      seriesData: res.list.map(el => el.work_total),
    })
  }
  // 阶段缺陷占比第6个图表
  const getDefectRatioChart = async (str: string) => {
    const res = await getDefectRatio({
      project_ids: '1,2',
      iterate_ids: '12,23',
      user_ids: '12,23,707',
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
      dimension: str,
    })
    setCharts6({
      time: res.start_time + ' ~ ' + res.end_time,
      chartType: str,
      seriesData: res.list.map(el => [el.name, parseInt(el.ratio, 10)]),
    })
  }
  // 2,3,5图表集合
  const getStatisticsOther = async () => {
    const res = await statisticsOther({
      project_ids: '1,2',
      iterate_ids: '12,23',
      user_ids: '12,23,707',
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
    })
    setCharts2({
      time:
        res.work_completion_period.start_time +
        ' ~ ' +
        res.work_completion_period.end_time,
      yData: res.work_completion_period.list.map(el => el.start_time),
      seriesData: res.work_completion_period.list.map(el => el.completed),
    })
    setCharts3({
      time: res.risk_stock.start_time + ' ~ ' + res.risk_stock.end_time,
      total: res.risk_stock.total,
      seriesData: res.risk_stock.list.map(el => [
        el.name,
        parseInt(el.ratio, 10),
      ]),
    })
    setCharts5({
      time: res.defect_trend.start_time + ' ~ ' + res.defect_trend.end_time,
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
    console.log(headerParmas, '我是最后的灿灿')
    await viewsUpdate({
      id: headerParmas.view.value,
      project_id: 1,
      name: headerParmas.view.title,
      status: 1,
      config: {
        iterate_ids: headerParmas.iterate_ids,
        project_id: headerParmas.projectIds,
        user_ids: headerParmas.users,
        period_time: getDateStr(headerParmas.time.type),
        start_time:
          headerParmas.time.type == 0 ? headerParmas.time.time[0] : '',
        end_time: headerParmas.time.type == 0 ? headerParmas.time.time[1] : '',
      },
    })
  }
  return (
    <div
      style={{
        overflowY: 'auto',
        height: 'calc(100% - 24px)',
        position: 'relative',
      }}
    >
      {/*头部组件 */}
      <Header
        projectId={projectId}
        homeType={homeType}
        defalutConfig={defalutConfig}
        viewDataList={viewDataList}
        onCreateView={onCreateView}
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
        time={'2023-03-01 ~ 2023-03-14'}
        num={1}
      />
      <div style={{ margin: '32px 0' }}>
        <WorkingStatus
          num={2}
          projectId={projectId}
          homeType={homeType}
          data={workDataList?.defect || []}
          title={'缺陷现状'}
          time={'2023-03-01 ~ 2023-03-14'}
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
              titleType={true}
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
                getCompletionRateChart(val), console.log(val, 'bal')
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
              titleType={true}
              title="阶段缺陷占比"
              onChange={item => getDefectRatioChart(item.key)}
            />
          </div>
        </div>
      </div>
      {/* 保存提示操作 */}
      {save && (
        <DialogMain>
          <DialogHeader>
            <Space size={14}>
              <CommonIconFont
                type={'Warning'}
                size={20}
                color="var(--function-warning)"
              />
              <span>检测到此视图有未保存的更改</span>
            </Space>
            <CommonIconFont
              onClick={() => dispatch(setSave(false))}
              type={'close'}
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
              <CommonButton type="light" onClick={() => setIsVisible(true)}>
                另存为
              </CommonButton>
              <CommonButton type="primary" onClick={() => editViews()}>
                保存
              </CommonButton>
            </Space>
          </Footer>
        </DialogMain>
      )}
      {/* 新建和编辑视图 1*/}
      <ViewDialog
        name={''}
        titleType={{ title: '另存为视图', type: 'add' }}
        onConfirm={(value, type) => {
          onCreateView(value, type, '')
        }}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
    </div>
  )
}
export default Home
