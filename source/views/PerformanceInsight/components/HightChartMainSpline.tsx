import { Space } from 'antd'
import Highcharts from 'highcharts'
import { Col1, HightChartsWrap, Time, TitleCss } from '../Header/Style'
import {
  Bor,
  BorderRow,
  HighchartsReactWrap,
  Radius,
  RightRow,
  Row,
} from './style'

const HightChartMainSpline = (props: {
  height: number
  title: string
  chart: Models.Efficiency.ChartSpline | undefined
}) => {
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
      categories: props.chart?.yData,
      labels: {
        rotation: -30,
        style: {
          color: '#646566',
          fontSize: '12px',
        },
      },
    },
    yAxis: {
      allowDecimals: false,
      tickColor: '#ECEDEF',
      gridLineColor: '#ECEDEF',
      gridLineDashStyle: 'longdash',
      borderRadius: 6,
      lineWidth: 1,
      tickWidth: 1,
      title: {
        text: ' (个) ',
        rotation: 0,
        align: 'high',
        offset: 37,
        y: 4,
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
    scrollbar: {
      enabled: true,
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
        '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:{series.color}"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">{series.name}：{point.y}%</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    series: props.chart?.seriesData,
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
                <Time>修复率： {props.chart?.fixed_rate}%</Time>
                <Time>缺陷新增： {props.chart?.new_total}</Time>
                <Time>修复： {props.chart?.fixed_total}</Time>
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
// 曲线图
export default HightChartMainSpline
