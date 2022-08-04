/* eslint-disable complexity */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import styled from '@emotion/styled'
import { Progress } from 'antd'
import { Line, Column } from '@ant-design/plots'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

const DemoLine = (props: { data: any }) => {
  const [t] = useTranslation()
  let arr: any[] = []
  props.data?.date?.forEach((element: any, index: number) => {
    const items = [
      {
        date: element,
        value: props.data.actual_last_count[index],
        category: '实际剩余',
      },
      {
        date: element,
        value: props.data.predict_last_count[index],
        category: '预计剩余',
      },
    ]
    arr = [...arr, ...items]
  })
  const config = {
    data: arr,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v: any) =>
          String(v).replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
  }
  return <Line {...config} />
}

const DemoColumn = (props: { data: any }) => {
  const config = {
    data: props.data,
    xField: 'type',
    yField: 'count',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  }
  return <Column {...config} />
}

const IterationInfo = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const iterateId = searchParams.get('iterateId')
  const { iterateInfo, getIterateStatistics } = useModel('iterate')
  const [chartData, setChartData] = useState<any>({})

  const getData = async () => {
    const result = await getIterateStatistics({ projectId, id: iterateId })
    setChartData(result)
  }

  useEffect(() => {
    getData()
  }, [])

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
                percent={Math.trunc(
                  iterateInfo?.finishCount / iterateInfo?.storyCount * 100,
                )}
                strokeWidth={16}
              />
              <div style={{ marginTop: 16, color: '#646566', fontSize: 14 }}>
                {iterateInfo.startTime || '--'}-{iterateInfo.endTime || '--'}
              </div>
            </SurveyBox>
            <SurveyBox style={{ alignItems: 'flex-start' }}>
              <span style={{ color: '#000', fontSize: 14 }}>需求</span>
              <span style={{ color: '#000', fontSize: 28, marginTop: 12 }}>
                {`${iterateInfo?.finishCount || '--'} / ${
                  iterateInfo?.storyCount || '--'
                }`}
              </span>
            </SurveyBox>
          </SurveyContent>
        </SurveyWrap>
        <SurveyWrap>
          <Title>迭代目标</Title>
          <TargetWrap dangerouslySetInnerHTML={{ __html: iterateInfo.info }} />
        </SurveyWrap>
      </TopWrap>
      <BottomWrap>
        <DiagramWrap>
          <Title>燃尽图</Title>
          <ChartWrap>
            <DemoLine data={chartData?.burnDownChart || {}} />
          </ChartWrap>
        </DiagramWrap>
        <StatusWrap>
          <Title>状态分布</Title>
          <ChartWrap>
            <DemoColumn data={chartData?.storyStatusChart || []} />
          </ChartWrap>
        </StatusWrap>
      </BottomWrap>
    </div>
  )
}

export default IterationInfo
