import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Highcharts from 'highcharts'
import { Col, HightChartsWrap, Time, TitleCss, Text } from '../Header/Style'
import { CharTitle, HighchartsReactWrap, RightRow } from './style'

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
export default HightChartMainBar