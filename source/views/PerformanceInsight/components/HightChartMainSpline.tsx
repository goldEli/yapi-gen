import { Space } from 'antd'
import Highcharts from 'highcharts'
import { Col, HightChartsWrap, Time, TitleCss } from '../Header/Style'
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
  time: string
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
// 曲线图
export default HightChartMainSpline
