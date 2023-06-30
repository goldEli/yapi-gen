import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Highcharts from 'highcharts'
import {
  Col,
  Col1,
  HightChartsWrap,
  RightRow,
  Time,
  TitleCss,
} from '../Header/Style'
import { CharTitle, HighchartsReactWrap } from './style'

// 图表折线图
const HightChartMainLine = (props: {
  height: number
  title: string
  projectId: number
  chart: Models.Efficiency.WorkChart
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
      categories: props.chart?.yData,
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
        data: props.chart?.seriesData,
      },
    ],
  }
  return (
    <div style={{ width: '49%' }}>
      <Col1>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.chart?.time}</Time>
          </Space>
        </RightRow>
      </Col1>
      <div style={{ width: '100%' }}>
        <HightChartsWrap height={props.height}>
          <CharTitle>
            <span>统计周期</span>
            <span className="day">{props.chart.period_number}</span>
            <CommonIconFont
              type={'up-right'}
              size={16}
              color="var(--function-success)"
            />
            <span className="time">
              环比{' '}
              {props.chart.growth_rate > 0
                ? `+${props.chart?.growth_rate}`
                : props.chart?.growth_rate}
              %
            </span>
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
export default HightChartMainLine
