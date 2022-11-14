/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import styled from '@emotion/styled'
import { Progress, Spin } from 'antd'
import { Line, Column } from '@ant-design/plots'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { computedAccuracy, getParamsData } from '@/tools'
import { TextWrapEditor } from '@/components/StyleCommon'

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
  lineHeight: '16px',
  color: '#323233',
  fontWeight: 'bold',
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

const TargetWrap = styled(TextWrapEditor)({
  marginTop: 22,
  height: 200,
  overflow: 'auto',
  color: '#646566',
  fontSize: 14,
  paddingRight: 20,
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

const Wrap = styled.div({
  overflow: 'auto',
  height: 'calc(100% - 50px)',
  padding: '0 16px',
  '.ant-spin-nested-loading, .ant-spin-container': {
    height: 'auto!important',
  },
})

const DemoLine = (props: { data: any }) => {
  const [t] = useTranslation()
  let arr: any[] = []
  props.data?.date?.forEach((element: any, index: number) => {
    const items = [
      {
        date: element,
        value: props.data.actual_last_count[index],
        category: t('project.actualSurplus'),
      },
      {
        date: element,
        value: props.data.predict_last_count[index],
        category: t('project.estimatedSurplus'),
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
    seriesField: 'type',
    data: props.data,
    color: ['#5b8ff9', '#5ad8a6', '#f6bd16', '#75cbed', '#657798'],
    xField: 'type',
    yField: 'count',
    legend: {
      itemHeight: 20,
    },
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
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const { iterateInfo, getIterateStatistics } = useModel('iterate')
  const [chartData, setChartData] = useState<any>({})
  const [isSpinning, setIsSpinning] = useState(false)

  const getData = async () => {
    setIsSpinning(true)
    const result = await getIterateStatistics({ projectId, id: iterateId })
    setChartData(result)
    setIsSpinning(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Wrap>
      <Spin spinning={isSpinning}>
        <TopWrap>
          <SurveyWrap>
            <Title>{t('container.survey')}</Title>
            <SurveyContent>
              <SurveyBox>
                <Progress
                  strokeColor="#43BA9A"
                  width={125}
                  type="circle"
                  format={percent => (percent === 100 ? '100%' : `${percent}%`)}
                  percent={computedAccuracy(
                    Math.trunc(
                      iterateInfo?.finishCount / iterateInfo?.storyCount,
                    ),
                    100,
                  )}
                  strokeWidth={12}
                />
                <div style={{ marginTop: 16, color: '#646566', fontSize: 14 }}>
                  {iterateInfo.startTime || '--'}-{iterateInfo.endTime || '--'}
                </div>
              </SurveyBox>
              <SurveyBox style={{ alignItems: 'flex-start' }}>
                <span style={{ color: '#000', fontSize: 14 }}>
                  {t('common.demand')}
                </span>
                <span style={{ color: '#000', fontSize: 28, marginTop: 12 }}>
                  {`${iterateInfo?.finishCount || 0} / ${
                    iterateInfo?.storyCount || 0
                  }`}
                </span>
              </SurveyBox>
            </SurveyContent>
          </SurveyWrap>
          <SurveyWrap style={{ paddingRight: 4 }}>
            <Title>{t('project.iterateTarget')}</Title>
            {iterateInfo?.info ? (
              <TargetWrap
                dangerouslySetInnerHTML={{ __html: iterateInfo.info }}
              />
            ) : (
              <NoData />
            )}
          </SurveyWrap>
        </TopWrap>
        <BottomWrap>
          <DiagramWrap>
            <Title>{t('project.burnoutDiagram')}</Title>
            <ChartWrap>
              <DemoLine data={chartData?.burnDownChart || {}} />
            </ChartWrap>
          </DiagramWrap>
          <StatusWrap>
            <Title>{t('project.statusDistribution')} </Title>
            <ChartWrap>
              <DemoColumn data={chartData?.storyStatusChart || []} />
            </ChartWrap>
          </StatusWrap>
        </BottomWrap>
      </Spin>
    </Wrap>
  )
}

export default IterationInfo
