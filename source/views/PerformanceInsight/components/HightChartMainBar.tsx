import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Highcharts from 'highcharts'
import { useTranslation } from 'react-i18next'
import { HightChartsWrap, Time, TitleCss, Text, Col1 } from '../Header/Style'
import { CharTitle, HighchartsReactWrap, RightRow } from './style'

// 图表位置柱状图
const HightChartMainBar = (props: {
  titleType: boolean
  height: number
  title: string
  chart: Models.Efficiency.ChartBar
  onChange: (val: string) => void
}) => {
  const [t] = useTranslation()
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
    plotOptions: {
      column: {
        borderWidth: 0,
        maxPointWidth: 30,
        pointWidth: 24,
      },
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
      categories: props.chart?.yData,
    },
    yAxis: [
      {
        tickColor: '#ECEDEF',
        gridLineColor: '#ECEDEF',
        gridLineDashStyle: 'longdash',
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
          formatter: function () {
            // eslint-disable-next-line
            const _this: any = this
            return props.titleType ? _this.value : _this.value + '%'
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
      pointFormat: props.titleType
        ? '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:#43BA9A;"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}项</span></div>'
        : '<span style="display:inline-block;width:8px;height:8px;borderRadius:50%;background:#43BA9A;"></span><span style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}%</span></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    colors: ['#43BA9A'],
    series: [
      {
        innerWidth: 1,
        outerWidth: 10,
        borderRadius: 4,
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
        <Text
          size={'14px'}
          color={'var(--neutral-n2)'}
          onClick={() =>
            props.onChange(props.chart?.chartType === 'asc' ? 'desc' : 'asc')
          }
        >
          <Space size={4}>
            <CommonIconFont type={'sort'} size={14} />
            <span>
              {props.chart?.chartType === 'desc'
                ? t('performance.sort1')
                : t('performance.sort2')}
            </span>
          </Space>
        </Text>
      </Col1>
      <div style={{ width: '100%' }}>
        <HightChartsWrap height={props.height}>
          {props.titleType ? (
            <CharTitle>
              <span>{t('performance.statisticalPeriod')}</span>
              <span className="day">{props.chart?.period_number}天</span>
              <CommonIconFont
                type={'down-left'}
                size={16}
                color="var(--function-error)"
              />
              <span className="time">
                {t('performance.daysBefore')}
                {props.chart.growth_rate > 0
                  ? `+${props.chart?.growth_rate}`
                  : props.chart?.growth_rate}
                %
              </span>
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
