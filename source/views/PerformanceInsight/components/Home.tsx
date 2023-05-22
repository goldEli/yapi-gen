/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import { Dropdown, Menu, Space } from 'antd'
import Header from '../Header'
import Highcharts from 'highcharts'
import { setSave } from '@store/performanceInsight'
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
  HightChartsWrap,
} from '../Header/Style'
import {
  HighchartsReactWrap,
  CharTitle,
  Bor,
  Radius,
  BorderRow,
  Row,
  DialogMain,
  DialogHeader,
  TextColor,
  Footer,
} from './style'
import {
  MoreWrap2,
  Myd,
} from '@/components/CommonProjectComponent/CommonMember/style'
import IconFont from '@/components/IconFont'
import { useState } from 'react'
import SelectMain from '../Header/components/SelectMain'
import CommonButton from '@/components/CommonButton'
import { useSelector } from '@store/index'
import ViewDialog from '../Header/components/ViewDialog'
interface Props {
  title: string
  time: string
  type: string
  data: Array<{ num: number; icon: string; type: string }>
}
const WorkingStatus = (props: Props) => {
  return (
    <>
      <Col>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        <Text size={'12px'} onClick={() => 123}>
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
        {props.data.map(el => (
          <LotBox key={el.num}>
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
                  <span>{el.num}</span>
                  <span>项</span>
                </TextNum>
                <Text
                  size={'12px'}
                  color={'var(--neutral-n2)'}
                  onClick={() => 123}
                >
                  <Space size={4}>
                    <span>{el.type}</span>
                    <CommonIconFont
                      type={'right'}
                      size={12}
                      color="var(--neutral-n2)"
                    />
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
interface PropsMoreDropdown {
  data: Array<{ label: string; key: number }>
  onClickMenu: (value: { label: string; key: number }) => void
  defaultValue: { label: string; key: number }
}
const MoreDropdown = (props: PropsMoreDropdown) => {
  const [isVisible, setIsVisible] = useState(false)
  const menu = () => {
    const menuItems: any = []
    props.data?.forEach((i: { label: string; key: number }, idx: number) => {
      menuItems.push({
        key: idx,
        label: (
          <Myd
            active={i.key === props.defaultValue.key}
            onClick={() => props.onClickMenu(i)}
          >
            {i.label}
            {i.key === props.defaultValue.key && (
              <IconFont
                style={{ fontSize: 16, margin: '1px 0px 0px 15px' }}
                type="check"
              />
            )}
          </Myd>
        ),
      })
    })
    return <Menu items={menuItems} />
  }

  return (
    <Dropdown
      key={isVisible ? isVisible.toString() : null}
      visible={isVisible}
      overlay={menu}
      trigger={['hover']}
      placement="bottomRight"
      getPopupContainer={node => node}
      onVisibleChange={setIsVisible}
    >
      <MoreWrap2
        style={{
          padding: '0 8px',
        }}
      >
        <div
          style={{
            marginRight: '4px',
          }}
          className="job"
        >
          {props.defaultValue.label}
        </div>
        <span className="job1">
          <IconFont style={{ fontSize: 14 }} type="down" />
        </span>
      </MoreWrap2>
    </Dropdown>
  )
}
// 图表位置柱状图
const HightChartMainBar = (props: {
  numType: boolean
  titleType: boolean
  height: number
  title: string
  time: string
  onChange: (val: boolean) => void
}) => {
  // 图表位置柱状图
  const options = {
    credits: {
      enabled: false,
      type: 'column',
    },
    chart: {
      type: 'column',
      height: props.titleType ? 330 : 310,
    },
    title: {
      style: {
        display: 'none',
      },
    },
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      minorGridLineColor: '#D5D6D9',
      tickColor: '#D5D6D9',
      tickWidth: 1,
      lineColor: '#D5D6D9',
      labels: {
        rotation: -30,
        style: {
          color: '#646566',
          fontSize: '12px',
        },
      },
      style: {
        color: '#646566',
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: [
      {
        tickColor: '#ECEDEF',
        gridLineColor: '#ECEDEF',
        gridLineDashStyle: 'longdash',
        borderRadius: 6,
        min: 0,
        max: 100,
        title: {
          text: false,
        },
        labels: {
          style: {
            color: '#646566',
            fontSize: '12px',
          },
        },
      },
    ],
    tooltip: {
      backgroundColor: '#fff',
      background: '#fff',
      shadow: true,
      borderColor: '#fff',
      borderRadius: 6,
      headerFormat:
        '<div style="width:140px;background:#fff;height:76px;padding:16px"><div style="background:#fff;font-size:12px;margin-bottom:4px;font-family: SiYuanMedium;">{point.key}</div><div>',
      pointFormat:
        '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:#43BA9A;"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}项</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    colors: ['#43BA9A '],
    series: [
      {
        borderRadius: 4,
        data: [
          29.9, 71.5, 10.4, 1.2, 14.0, 16.0, 15.6, 48.5, 21.4, 14.1, 5.6, 5.4,
        ],
      },
    ],
  }
  return (
    <div style={{ width: '49%' }}>
      <Col style={{ padding: '0 24px', marginBottom: '16px' }}>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        <Text
          size={'14px'}
          color={'var(--neutral-n2)'}
          onClick={() => props.onChange(!props.numType)}
        >
          <Space size={4}>
            <CommonIconFont type={'sort'} size={14} color="var(--neutral-n2)" />
            <span>{props.numType ? '由高到低' : '由低到高'}</span>
          </Space>
        </Text>
      </Col>
      <div style={{ width: '100%' }}>
        <HightChartsWrap height={props.height}>
          {props.titleType ? (
            <CharTitle>
              <span>统计周期</span>
              <span className="day">14天</span>
              <CommonIconFont
                type={'down-left'}
                size={16}
                color="var(--function-error)"
              />
              <span className="time">较前14天 -10%</span>
            </CharTitle>
          ) : null}

          <div>
            <HighchartsReactWrap
              width={400}
              highcharts={Highcharts}
              options={options}
            />
          </div>
        </HightChartsWrap>
      </div>
    </div>
  )
}
// 图表折线图
const HightChartMainLine = (props: {
  height: number
  title: string
  time: string
}) => {
  // 折线图
  const options = {
    chart: {
      type: 'line',
      height: 330,
    },
    colors: ['#F6BD16'],
    credits: {
      enabled: false,
    },
    title: {
      style: {
        display: 'none',
      },
    },
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      labels: {
        rotation: -30,
      },
      style: {
        color: '#646566',
        fontSize: '12px',
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: false,
      },
      style: {
        color: '#646566',
        fontSize: '12px',
      },
    },
    tooltip: {
      backgroundColor: '#fff',
      background: '#fff',
      shadow: true,
      borderColor: '#fff',
      borderRadius: 6,
      headerFormat:
        '<div style="minWidth:140px;background:#fff;height:76px;padding:16px"><div style="background:#fff;font-size:12px;margin-bottom:4px;font-family: SiYuanMedium;">{point.key}</div><div>',
      pointFormat:
        '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:#F6BD16;"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作完成项：{point.y}项</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    series: [
      {
        data: [
          29.9, 71.5, 11.4, 12.2, 14.0, 16.0, 13.6, 18.5, 21.4, 14.1, 5.6, 54.4,
        ],
      },
    ],
  }
  return (
    <div style={{ width: '49%' }}>
      <Col style={{ padding: '0 24px', marginBottom: '16px' }}>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
      </Col>
      <div style={{ width: '100%' }}>
        <HightChartsWrap height={props.height}>
          <CharTitle>
            <span>统计周期</span>
            <span className="day">14天</span>
            <CommonIconFont
              type={'down-left'}
              size={16}
              color="var(--function-error)"
            />
            <span className="time">较前14天 -10%</span>
          </CharTitle>
          <div>
            <HighchartsReactWrap
              width={400}
              highcharts={Highcharts}
              options={options}
            />
          </div>
        </HightChartsWrap>
      </div>
    </div>
  )
}
// 饼图
const HightChartMainPie = (props: {
  height: number
  titleType: boolean
  title: string
  time?: string
}) => {
  const options: any = {
    credits: {
      enabled: false,
      spacing: [40, 0, 40, 0],
    },
    title: {
      floating: true,
      text: props.titleType ? '' : '13 项',
      align: 'center',
      verticalAlign: 'middle',
      y: 30,
      x: -90,
      style: {
        fontSize: 20,
      },
    },
    chart: {
      height: 290,
      labelLine: {
        show: false,
      },
    },
    legend: {
      data: ['私有云', '数据中心', '造价通', '供应商', '造价通1', '供应商1'],
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'center',
      borderWidth: 0,
      y: 45,
      itemMarginBottom: 16,
      useHTML: true,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    labelFormatter: function () {
      // const event: any = this
      // return `<div style='fontSize: 14px;color:#646566;display:flex; width: 204px;height:26px;lineHeight:14px;paddingBottom:2px;whiteSpace: nowrap; overflow: hidden; textOverflow: ellipsis'>${event?.name}: ${event.y}%</div>`
    },
    tooltip: {
      backgroundColor: '#fff',
      background: '#fff',
      shadow: true,
      borderColor: '#fff',
      borderRadius: 6,
      headerFormat:
        '<div style="background:#fff;minWidth:108;height:76px;padding:16px"><div style="background:#fff;font-size:12px;margin-bottom:4px;font-family: SiYuanMedium;">{point.key}</div><div>',
      pointFormat:
        '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:{point.color}"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}项</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    colors: ['#4267ED', '#6688FF', '#9CB0F8', '#CED7F8', '#E3E9FA '],
    series: [
      {
        type: 'pie',
        size: '90%',
        name: 'Browser share',
        innerSize: '80%',
        center: ['35%', '55%'],
        data: [
          ['私有云', 25],
          ['数据中心', 60],
          ['造价通', 30],
        ],
      },
    ],
  }
  const [defaultValue, setDefaultValue] = useState<{
    label: string
    key: number
  }>({ label: '按优先级', key: 1 })
  const onClickMenu = async (item: { label: string; key: number }) => {
    console.log(item, 'oo')
    setDefaultValue(item)
  }
  return (
    <div style={{ width: '49%' }}>
      <Col style={{ padding: '0 24px', marginBottom: '16px' }}>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        {props.titleType && (
          <MoreDropdown
            onClickMenu={(value: { label: string; key: number }) =>
              onClickMenu(value)
            }
            data={[
              { label: '按严重程度', key: 0 },
              { label: '按优先级', key: 1 },
              { label: '按状态', key: 2 },
            ]}
            defaultValue={defaultValue}
          />
        )}
      </Col>
      <HightChartsWrap height={props.height}>
        <HighchartsReactWrap
          width={400}
          highcharts={Highcharts}
          options={options}
        />
      </HightChartsWrap>
    </div>
  )
}
const HightChartMainSpline = (props: {
  height: number
  title: string
  time: string
}) => {
  // 曲线图
  const options = {
    colors: ['#F6BD16', '#6688FF', '#43BA9A'],
    chart: {
      height: 300,
      type: 'spline',
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      minorGridLineColor: '#D5D6D9',
      tickColor: '#D5D6D9',
      tickWidth: 1,
      lineColor: '#D5D6D9',
      categories: [
        '03-01',
        '03-02',
        '03-03',
        '03-04',
        '03-05',
        '03-06',
        '03-07',
        '03-08',
        '03-09',
        '03-10',
        '03-11',
        '03-12',
      ],
    },
    yAxis: {
      tickColor: '#ECEDEF',
      gridLineColor: '#ECEDEF',
      gridLineDashStyle: 'longdash',
      borderRadius: 6,
      title: {
        text: '',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
      series: {
        marker: {
          radius: 3,
          symbol: 'circle',
        },
      },
    },
    tooltip: {
      backgroundColor: '#fff',
      background: '#fff',
      shadow: true,
      borderColor: '#fff',
      borderRadius: 6,
      headerFormat:
        '<div style="background:#fff;minWidth:136px"><div style="background:#fff;font-size:12px;margin-bottom:4px;font-family: SiYuanMedium;">{point.key}</div><div>',
      pointFormat:
        '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:{series.color}"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">{series.name}：{point.y}</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    series: [
      {
        name: '创建需求',
        data: [0, 69, 116, 306, 365, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: '进行中',
        data: [0, 1, 2, 19, 38, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: '已结束',
        data: [0, 1, 3, 13, 16, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  }
  return (
    <div style={{ width: '49%' }}>
      <Col style={{ padding: '0 24px', marginBottom: '16px' }}>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
      </Col>
      <div style={{ width: '100%' }}>
        <HightChartsWrap height={props.height}>
          <Row style={{ marginBottom: '32px' }}>
            <Row>
              <Space size={16}>
                <BorderRow>
                  <BorderRow>
                    <Bor color="#F6BD16" />
                    <Radius color="#F6BD16 " />
                    <Bor color="#F6BD16" />
                  </BorderRow>
                  <span className="text">待修复</span>
                </BorderRow>
                <BorderRow>
                  <BorderRow>
                    <Bor color="#6688FF" />
                    <Radius color="#6688FF" />
                    <Bor color="#6688FF" />
                  </BorderRow>
                  <span className="text">修复中</span>
                </BorderRow>
                <BorderRow>
                  <BorderRow>
                    <Bor color="#43BA9A" />
                    <Radius color="#43BA9A" />
                    <Bor color="#43BA9A" />
                  </BorderRow>
                  <span className="text">已完成</span>
                </BorderRow>
              </Space>
            </Row>
            <div>
              <Space size={12}>
                <Time>修复率： 60%</Time>
                <Time>缺陷新增： 60</Time>
                <Time>修复： 60</Time>
              </Space>
            </div>
          </Row>
          <div>
            <HighchartsReactWrap
              width={400}
              highcharts={Highcharts}
              options={options}
            />
          </div>
        </HightChartsWrap>
      </div>
    </div>
  )
}
// 效能洞察的主页
const Home = () => {
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const { save } = useSelector(store => store.performanceInsight)
  return (
    <div
      style={{
        overflowY: 'auto',
        height: 'calc(100% - 24px)',
        position: 'relative',
      }}
    >
      <Header />
      <WorkingStatus
        data={[
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
        ]}
        title={'工作项现状'}
        time={'2023-03-01 ~ 2023-03-14'}
        type="Progress"
      />
      <div style={{ margin: '32px 0' }}>
        <WorkingStatus
          data={[{ num: 40, type: '缺陷修复露', icon: 'right' }]}
          title={'缺陷现状'}
          time={'2023-03-01 ~ 2023-03-14'}
          type="Defect"
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
              title="阶段新增工作Top10"
              titleType={true}
              height={396}
              numType={false}
              time={'2012-010'}
              onChange={val => console.log('c')}
            />
            <HightChartMainLine
              title="工作周期对比"
              time="2023-03-01 ~ 2023-03-14"
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
              titleType={false}
              title="阶段存量风险"
            />
            <HightChartMainBar
              titleType={false}
              height={352}
              numType={false}
              title={'阶段完成率Top10'}
              time={'2012-010'}
              onChange={val => console.log('c')}
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
              time="2023-03-01 ~ 2023-03-14"
              height={396}
            />
            <HightChartMainPie
              height={396}
              titleType={true}
              title="阶段缺陷占比"
              time="2023-03-01 ~ 2023-03-14"
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
              onChange={e => console.log(e)}
              placeholder="请选择"
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
          </div>
          <Footer>
            <Space size={6}>
              <span
                style={{
                  color: 'var(--auxiliary-text-t2-d1)',
                  cursor: 'pointer',
                }}
              >
                不保存
              </span>
            </Space>
            <Space size={16}>
              <CommonButton type="light" onClick={() => setIsVisible(true)}>
                另存为
              </CommonButton>
              <CommonButton type="primary" onClick={() => 123}>
                保存
              </CommonButton>
            </Space>
          </Footer>
        </DialogMain>
      )}
      {/* 新建和编辑视图 1*/}
      <ViewDialog
        name={''}
        title={'另存为视图'}
        onConfirm={() => {
          console.log(123)
        }}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
    </div>
  )
}
export default Home
