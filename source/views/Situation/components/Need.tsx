// 需求概况

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
import { useTranslation } from 'react-i18next'

const Need = (props: any) => {
  const [t] = useTranslation()
  const { data } = props

  const options = {
    colors: ['#2877FF', '#F6BD16', '#43BA9A'],
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
      <div className={titleCss}>{t('situation.demandSurvey')}</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total ?? 0}</span>
            <span className={title2Css}>{t('common.createDemand')}</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.planningTotal ?? 0}</span>
            <span className={title2Css}>{t('situation.notStarted')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.ongoingTotal ?? 0}</span>
            <span className={title2Css}>{t('situation.ongoing')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.endTotal ?? 0}</span>
            <span className={title2Css}>{t('situation.end')}</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>{t('situation.demandDiagram')}</div>
      <HightChartsWrap style={{ height: '300px' }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Need
