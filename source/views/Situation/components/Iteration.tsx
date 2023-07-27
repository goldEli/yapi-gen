// 概况中的迭代模块

import { Column } from '@ant-design/plots'
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

const DemoColumn = (props: any) => {
  const { data: res } = props
  const config = {
    seriesField: 'type',
    color: ['#5ad8a6', '#5b8ff9', '#f6bd16', '#75cbed', '#657798'],
    data: res,
    columnStyle: {
      radius: [6, 6, 0, 0],
    },
    xField: 'type',
    yField: 'sales',
    appendPadding: 20,
    legend: {
      itemHeight: 20,
    },
    label: {
      position: 'top',
      style: {
        fill: 'var(--neutral-black)',
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: 'black',
            lineWidth: 1,
            lineDash: [4, 3],
            strokeOpacity: 0.1,
            shadowColor: 'black',
          },
        },
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
  // console.log(data?.chartsData, 'data?.chartsData')
  return (
    <ChartsWrap>
      <div className={titleCss}>{t('common.iterateSurvey')}</div>
      <TextWrap>
        {/* <TextBlueWrap> */}
        <ChartsItem333>
          <span className={title1Css1}>{data?.total ?? 0}</span>
          <span className={title2Css}>{t('common.createIterate')}</span>
        </ChartsItem333>
        {/* </TextBlueWrap> */}
        {/* <HomeWrap> */}
        <ChartsItem2 />
        <ChartsItem333>
          <span className={title1Css}>{data?.open_count ?? 0}</span>
          <span className={title2Css}>{t('situation.openIterate')}</span>
        </ChartsItem333>
        {/* <ChartsItem333>
          <span className={title1Css}>{data?.finish_count ?? 0}</span>
          <span className={title2Css}>{t('version2.finishIteration')}</span>
        </ChartsItem333> */}
        <ChartsItem333>
          <span className={title1Css}>{data?.end_count ?? 0}</span>
          <span className={title2Css}>{t('situation.stopIterate')}</span>
        </ChartsItem333>
        {/* </HomeWrap> */}
      </TextWrap>

      <div className={chartsTitle}>{t('situation.iterateProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Iteration
