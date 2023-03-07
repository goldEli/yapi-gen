// 员工概况

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

const Staff = (props: any) => {
  const [t] = useTranslation()
  const { data } = props
  return (
    <ChartsWrap>
      <div className={titleCss}>{t('situation.staffSurvey')}</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css1}>{data?.total ?? 0}</span>
            <span className={title2Css}>{t('situation.companyStaff')}</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.boyCount ?? 0}</span>
            <span className={title2Css}>{t('common.male')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.girlCount ?? 0}</span>
            <span className={title2Css}>{t('common.female')}</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>{t('situation.jobProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Staff
