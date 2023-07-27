// 需求概况

/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {
  ChartsItem,
  ChartsItem2,
  ChartsItem333,
  chartsTitle,
  ChartsWrap,
  HightChartsWrap,
  HomeWrap,
  TextBlueWrap,
  TextWrap,
  title1Css,
  title1Css1,
  title2Css,
  titleCss,
} from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'

const Need = (props: any) => {
  const [t] = useTranslation()
  const { data } = props

  const options = {
    colors: ['var(--primary-d2)', '#F6BD16', '#43BA9A'],
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
        t('situation.January'),
        t('situation.February'),
        t('situation.March'),
        t('situation.April'),
        t('situation.May'),
        t('situation.June'),
        t('situation.July'),
        t('situation.August'),
        t('situation.September'),
        t('situation.October'),
        t('situation.November'),
        t('situation.December'),
      ],
    },
    yAxis: {
      gridLineDashStyle: 'Dash',
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
  // console.log(data?.chartsData, 'data11?.chartsData')
  return (
    <ChartsWrap>
      <div className={titleCss}>{t('work_item_summary')}</div>
      <TextWrap>
        {/* <TextBlueWrap> */}
        <ChartsItem333>
          <span className={title1Css1}>{data?.total ?? 0}</span>
          <span className={title2Css}>{t('create_work_item')}</span>
        </ChartsItem333>
        {/* </TextBlueWrap> */}
        {/* <HomeWrap> */}
        <ChartsItem2 />
        <ChartsItem333>
          <span className={title1Css}>{data?.planningTotal ?? 0}</span>
          <span className={title2Css}>{t('situation.notStarted')}</span>
        </ChartsItem333>
        <ChartsItem333>
          <span className={title1Css}>{data?.ongoingTotal ?? 0}</span>
          <span className={title2Css}>{t('situation.ongoing')}</span>
        </ChartsItem333>
        <ChartsItem333>
          <span className={title1Css}>{data?.endTotal ?? 0}</span>
          <span className={title2Css}>{t('situation.end')}</span>
        </ChartsItem333>
        {/* </HomeWrap> */}
      </TextWrap>
      <div className={chartsTitle}>{t('work_item_accumulated_chart')}</div>
      <HightChartsWrap style={{ height: '300px' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Need
