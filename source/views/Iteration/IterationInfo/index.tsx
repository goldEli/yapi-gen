// 迭代详情

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import { Progress, Spin } from 'antd'
import { Line, Column } from '@ant-design/plots'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getParamsData } from '@/tools'
import { useSelector } from '@store/index'
import { getIterateStatistics } from '@/services/iterate'
import NewLoadingTransition from '@/components/NewLoadingTransition'

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
})

const Title = styled.div({
  fontSize: 14,
  lineHeight: '14px',
  color: 'var(--neutral-n1-d1)',
  fontFamily: 'SiYuanMedium',
  paddingLeft: 8,
  borderLeft: '3px solid var(--primary-d2)',
})

const SurveyContent = styled.div({
  width: '100%',
  height: 220,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'auto',
})

const SurveyBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  borderRadius: 6,
})

const TargetWrap = styled.div({
  marginTop: 22,
  height: 220,
  overflow: 'auto',
  color: 'var(--neutral-n2)',
  fontSize: 14,

  background: 'var(--neutral-n9)',
  padding: '16px',
  borderRadius: '4px',
})

const BottomWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 12,
})

const DiagramWrap = styled.div({
  width: '60%',
  height: 430,
  borderRadius: 6,
})

const StatusWrap = styled.div({
  width: '39.2%',
  height: 430,
  borderRadius: 6,
})

const ChartWrap = styled.div({
  height: 340,
  marginTop: 24,
  background: 'var(--neutral-n9)',
  borderRadius: '4px',
  padding: '16px',
})

const Wrap = styled.div({
  overflow: 'auto',
  height: 'calc(100% - 50px)',
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
  const { iterateInfo } = useSelector(store => store.iterate)
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
      <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <TopWrap>
          <SurveyWrap style={{ width: 486 }}>
            <Title
              style={{
                marginBottom: '22px',
              }}
            >
              {t('container.survey')}
            </Title>
            <SurveyContent>
              <SurveyBox
                style={{
                  width: '232px',
                  height: '220px',
                  background: 'rgba(67,186,154,0.05)',
                  padding: '30px',
                }}
              >
                <Progress
                  trailColor="var(--neutral-n6-d1)"
                  strokeColor="#43BA9A"
                  width={125}
                  type="circle"
                  format={percent =>
                    Number(percent) === 100 ? '100%' : `${percent}%`
                  }
                  percent={Math.trunc(
                    (iterateInfo.finishCount / iterateInfo.storyCount) * 100,
                  )}
                  strokeWidth={12}
                />
                <div
                  style={{
                    marginTop: 16,
                    color: 'var(--neutral-n2)',
                    fontSize: 14,
                  }}
                >
                  {iterateInfo.startTime || '--'}-{iterateInfo.endTime || '--'}
                </div>
              </SurveyBox>
              <SurveyBox
                style={{
                  width: '232px',
                  height: '220px',
                  background: 'rgba(250,151,70,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    color: 'var(--neutral-black)',
                    fontSize: 28,
                    marginTop: 40,
                  }}
                >
                  <span style={{ color: '#FA9746' }}>
                    {iterateInfo?.finishCount || 0}
                  </span>
                  <span>/{iterateInfo?.storyCount || 0}</span>
                </span>
                <span
                  style={{
                    color: 'var(--neutral-black)',
                    fontSize: 14,
                    marginTop: 54,
                  }}
                >
                  {t('common.demand')}
                </span>
              </SurveyBox>
            </SurveyContent>
          </SurveyWrap>
          <SurveyWrap style={{ width: 'calc(100% - 510px)' }}>
            <Title>{t('project.iterateTarget')}</Title>
            {iterateInfo?.info ? (
              <TargetWrap>
                <div
                  dangerouslySetInnerHTML={{ __html: iterateInfo.info || '--' }}
                />
              </TargetWrap>
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
