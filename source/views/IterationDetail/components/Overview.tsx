/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { getIterateStatistics } from '@/services/iterate'
import { getIdByUrl, getProjectIdByUrl } from '@/tools'
import { useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BottomWrap,
  ChartWrap,
  DiagramWrap,
  OverviewTitle,
  OverviewWrap,
  StatusWrap,
  SurveyBox,
  SurveyContent,
  SurveyWrap,
  TargetWrap,
  TopWrap,
} from '../style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { Progress, Spin } from 'antd'
import { Editor } from '@xyfe/uikit'
import NoData from '@/components/NoData'
import { Column, Line } from '@ant-design/plots'

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

interface OverviewProps {
  activeKey: string
}

const Overview = (props: OverviewProps) => {
  const [t] = useTranslation()
  const { iterateInfo } = useSelector(store => store.iterate)
  const [chartData, setChartData] = useState<any>({})
  const [isSpinning, setIsSpinning] = useState(false)

  const getData = async () => {
    setIsSpinning(true)
    const result = await getIterateStatistics({
      projectId: getProjectIdByUrl(),
      id: getIdByUrl('iterateId'),
    })
    setChartData(result)
    setIsSpinning(false)
  }

  useEffect(() => {
    if (props.activeKey === '1') {
      getData()
    }
  }, [props.activeKey])

  return (
    <OverviewWrap>
      <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <TopWrap>
          <SurveyWrap style={{ width: 486 }}>
            <OverviewTitle>{t('container.survey')}</OverviewTitle>
            <SurveyContent>
              <SurveyBox>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
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
            <OverviewTitle>{t('project.iterateTarget')}</OverviewTitle>
            {iterateInfo?.info ? (
              <TargetWrap>
                <Editor
                  color="transparent"
                  value={iterateInfo.info || '--'}
                  getSuggestions={() => []}
                  readonly
                />
              </TargetWrap>
            ) : (
              <NoData />
            )}
          </SurveyWrap>
        </TopWrap>
        <BottomWrap>
          <DiagramWrap>
            <OverviewTitle>{t('project.burnoutDiagram')}</OverviewTitle>
            <ChartWrap>
              <DemoLine data={chartData?.burnDownChart || {}} />
            </ChartWrap>
          </DiagramWrap>
          <StatusWrap>
            <OverviewTitle>{t('project.statusDistribution')} </OverviewTitle>
            <ChartWrap>
              <DemoColumn data={chartData?.storyStatusChart || []} />
            </ChartWrap>
          </StatusWrap>
        </BottomWrap>
      </Spin>
    </OverviewWrap>
  )
}

export default Overview
