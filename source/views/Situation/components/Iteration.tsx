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

const DemoColumn = (props: any) => {
  const { data: res } = props
  const config = {
    seriesField: 'type',
    color: ['#5ad8a6', '#5b8ff9', '#f6bd16', '#75cbed', '#657798'],
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

const Iteration = (props: any) => {
  const { data } = props

  return (
    <ChartsWrap>
      <div className={titleCss}>迭代概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total ?? 0}</span>
            <span className={title2Css}>创建迭代</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.open_count ?? 0}</span>
            <span className={title2Css}>开启迭代</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.end_count ?? 0}</span>
            <span className={title2Css}>关闭迭代</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>

      <div className={chartsTitle}>迭代进度分布</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Iteration
