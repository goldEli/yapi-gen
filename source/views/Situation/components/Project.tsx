/* eslint-disable complexity */
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

// eslint-disable-next-line consistent-return
const DemoColumn = (props: any) => {
  const [t] = useTranslation()
  const { data: res } = props
  const config = {
    seriesField: 'type',
    color: ['#5b8ff9', '#5ad8a6', '#f6bd16', '#75cbed', '#657798'],
    data: res,
    xField: 'type',
    yField: 'sales',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '数量',
      },
    },
  }
  if (res) {
    return <Column {...config} />
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
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total ?? 0}</span>
            <span className={title2Css}>{t('situation.companyProject')}</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.open_count ?? 0}</span>
            <span className={title2Css}>{t('situation.openProject')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.end_count ?? 0}</span>
            <span className={title2Css}>{t('situation.stopProject')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.private_count ?? 0}</span>
            <span className={title2Css}>{t('common.privateProject')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.public_count ?? 0}</span>
            <span className={title2Css}>{t('common.publicProject')}</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>{t('situation.companyProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Project
