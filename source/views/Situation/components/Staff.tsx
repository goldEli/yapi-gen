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

const Staff = (props: any) => {
  const [t] = useTranslation()
  const { data } = props
  return (
    <ChartsWrap>
      <div className={titleCss}>员工概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total ?? 0}</span>
            <span className={title2Css}>公司成员</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.boyCount ?? 0}</span>
            <span className={title2Css}>男</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.girlCount ?? 0}</span>
            <span className={title2Css}>女</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>职位人数分布</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Staff
