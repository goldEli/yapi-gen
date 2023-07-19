// 员工概况

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
    data: res,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'top',
      // 配置样式
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
          },
        },
      },
    },
    color: ['#6688FF'],
    columnStyle: {
      radius: [6, 6, 0, 0],
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
        {/* <TextBlueWrap> */}
        <ChartsItem>
          <span className={title1Css1}>{data?.total ?? 0}</span>
          <span className={title2Css}>{t('situation.companyStaff')}</span>
        </ChartsItem>
        {/* </TextBlueWrap> */}
        {/* <HomeWrap> */}
        <ChartsItem2 />
        <ChartsItem>
          <span className={title1Css}>{data?.boyCount ?? 0}</span>
          <span className={title2Css}>{t('common.male')}</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>{data?.girlCount ?? 0}</span>
          <span className={title2Css}>{t('common.female')}</span>
        </ChartsItem>
        {/* </HomeWrap> */}
      </TextWrap>
      <div className={chartsTitle}>{t('situation.jobProgress')}</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Staff
