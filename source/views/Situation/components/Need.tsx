/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {
  ChartsItem,
  chartsTitle,
  ChartsWrap,
  HightChartsWrap,
  HomeWrap,
  TextBlueWrap,
  TextWrap,
  title1Css,
  title2Css,
  titleCss,
} from '@/components/StyleCommon'

const Need = (props: any) => {
  const { data } = props

  const options = {
    chart: {
      height: 350,
      type: 'line',
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
    xAxis: {
      categories: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
    },
    yAxis: {
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
    },
    series: data?.chartsData,
  }

  return (
    <ChartsWrap>
      <div className={titleCss}>需求概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total}</span>
            <span className={title2Css}>创建需求</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.planningTotal}</span>
            <span className={title2Css}>未开始</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.ongoingTotal}</span>
            <span className={title2Css}>进行中</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.endTotal}</span>
            <span className={title2Css}>已结束</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>需求累计图</div>
      <HightChartsWrap style={{ height: '300px' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Need
