// 项目概况

import { Column } from '@ant-design/plots'
import {
  ChartsItem,
  ChartsItem2,
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
    color: ['#5b8ff9', '#5ad8a6', '#f6bd16', '#75cbed', '#657798'],
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
            lineDash: [4],
            strokeOpacity: 0.1,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            cursor: 'pointer',
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

const Project = (props: any) => {
  const [t] = useTranslation()
  const { data } = props

  return (
    <ChartsWrap>
      <div className={titleCss}>{t('situation.projectSurvey')}</div>
      <TextWrap>
        {/* <TextBlueWrap> */}
        <ChartsItem>
          <span className={title1Css1}>{data?.total ?? 0}</span>
          <span className={title2Css}>{t('situation.companyProject')}</span>
        </ChartsItem>
        {/* </TextBlueWrap> */}
        {/* <HomeWrap> */}
        <ChartsItem2 />
        <ChartsItem>
          <span className={title1Css}>{data?.sprint_team_count ?? 0}</span>
          <span className={title2Css}>{t('other.affairs_team')}</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>{data?.sprint_company_count ?? 0}</span>
          <span className={title2Css}>{t('other.affairs_public')}</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>{data?.iterate_team_count ?? 0}</span>
          <span className={title2Css}>{t('other.iteration_team')}</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>{data?.iterate_company_count ?? 0}</span>
          <span className={title2Css}>{t('other.iteration_public')}</span>
        </ChartsItem>
        {/* </HomeWrap> */}
      </TextWrap>
      <div className={chartsTitle}>{t('situation.companyProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Project
