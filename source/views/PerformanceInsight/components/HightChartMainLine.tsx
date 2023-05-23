import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Highcharts from 'highcharts'
import { Col, HightChartsWrap, RightRow, Time, TitleCss } from '../Header/Style'
import { CharTitle, HighchartsReactWrap } from './style'

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
              type={'up-right'}
              size={16}
              color="var(--function-success)"
            />
            <span className="time">环比 +10%</span>
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
