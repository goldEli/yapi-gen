import styled from '@emotion/styled'
import { Progress } from 'antd'
import { Line, Column } from '@ant-design/plots'
import { useEffect, useState } from 'react'

const TopWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '16px 0',
})

const SurveyWrap = styled.div({
  height: 268,
  borderRadius: 6,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  width: '49.6%',
})

const Title = styled.div({
  fontSize: 16,
  lineHeight: '20px',
  color: '#323233',
  fontWeight: 400,
  paddingLeft: 8,
  borderLeft: '3px solid #2877FF',
})

const SurveyContent = styled.div({
  width: '100%',
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  overflow: 'auto',
})

const SurveyBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const TargetWrap = styled.div({
  marginTop: 22,
  height: 200,
  overflow: 'auto',
  color: '#646566',
  fontSize: 14,
})

const BottomWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const DiagramWrap = styled.div({
  width: '60%',
  height: 430,
  borderRadius: 6,
  background: 'white',
  padding: 24,
})

const StatusWrap = styled.div({
  width: '39.2%',
  height: 430,
  borderRadius: 6,
  background: 'white',
  padding: 24,
})

const ChartWrap = styled.div({
  height: 340,
  marginTop: 24,
})

const DemoLine = () => {
  const [data, setData] = useState([])

  useEffect(
    () => {
      asyncFetch()
    },
    [],
  )

  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
    )
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log(
          'fetch data failed',
          error,
        )
      })
  }
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {

        // 数值格式化为千分位
        formatter: (v: any) => String(v).replace(
          /\d{1,3}(?=(\d{3})+$)/g,
          s => `${s},`,
        ),
      },
    },
  }

  return <Line {...config} />
}

const DemoColumn = () => {
  const data = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ]
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
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
    minColumnWidth: 20,
    maxColumnWidth: 20,
  }
  return <Column {...config} />
}

export default () => {
  return (
    <div>
      <TopWrap>
        <SurveyWrap>
          <Title>概况</Title>
          <SurveyContent>
            <SurveyBox>
              <Progress
                strokeColor="#43BA9A"
                width={125}
                type="circle"
                percent={75}
                strokeWidth={16}
              />
              <div style={{ marginTop: 16,
                color: '#646566',
                fontSize: 14 }}>
                2022/06/17-2022/07/30
              </div>
            </SurveyBox>
            <SurveyBox style={{ alignItems: 'flex-start' }}>
              <span style={{ color: '#000',
                fontSize: 14 }}>需求</span>
              <span style={{ color: '#000',
                fontSize: 28,
                marginTop: 12 }}>
                25/36
              </span>
            </SurveyBox>
          </SurveyContent>
        </SurveyWrap>
        <SurveyWrap>
          <Title>迭代目标</Title>
          <TargetWrap>
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
            1.目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述目标描述
          </TargetWrap>
        </SurveyWrap>
      </TopWrap>
      <BottomWrap>
        <DiagramWrap>
          <Title>燃尽图</Title>
          <ChartWrap>
            <DemoLine />
          </ChartWrap>
        </DiagramWrap>
        <StatusWrap>
          <Title>状态分布</Title>
          <ChartWrap>
            <DemoColumn />
          </ChartWrap>
        </StatusWrap>
      </BottomWrap>
    </div>
  )
}
