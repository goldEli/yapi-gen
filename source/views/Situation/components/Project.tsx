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

// eslint-disable-next-line consistent-return
const DemoColumn = (props: any) => {
  const { data: res } = props
  const config = {
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
        alias: '销售额',
      },
    },
  }
  if (res) {
    return <Column {...config} />
  }
  return null
}

const Project = (props: any) => {
  const { data } = props

  return (
    <ChartsWrap>
      <div className={titleCss}>项目概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total}</span>
            <span className={title2Css}>公司项目</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.open_count}</span>
            <span className={title2Css}>开启项目</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.end_count}</span>
            <span className={title2Css}>结束项目</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.private_count}</span>
            <span className={title2Css}>私有项目</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.public_count}</span>
            <span className={title2Css}>公开项目</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>项目进度分布</div>
      <HightChartsWrap>
        <DemoColumn data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Project
