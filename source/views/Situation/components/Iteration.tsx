// 概况中的迭代模块

import { Column } from '@ant-design/plots'
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

const DemoColumn = (props: any) => {
  const { data: res } = props
  const config = {
    seriesField: 'type',
    color: ['#5ad8a6', '#5b8ff9', '#f6bd16', '#75cbed', '#657798'],
    data: res,
    xField: 'type',
    yField: 'sales',
    appendPadding: 20,
    legend: {
      itemHeight: 20,
    },
    label: {
      position: 'top',
      style: {
        fill: '#000',
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  }
  if (res) {
    return <Column {...(config as any)} />
  }
  return null
}

const Iteration = (props: any) => {
  const [t] = useTranslation()
  const { data } = props

  return (
    <ChartsWrap>
      <div className={titleCss}>{t('common.iterateSurvey')}</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total ?? 0}</span>
            <span className={title2Css}>{t('common.createIterate')}</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.open_count ?? 0}</span>
            <span className={title2Css}>{t('situation.openIterate')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>1000</span>
            <span className={title2Css}>完成迭代</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.end_count ?? 0}</span>
            <span className={title2Css}>{t('situation.stopIterate')}</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>

      <div className={chartsTitle}>{t('situation.iterateProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Iteration
