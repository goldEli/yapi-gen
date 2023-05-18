import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Header from '../Header'
import Highcharts from 'highcharts'
import {
  Col,
  RightRow,
  Time,
  TitleCss,
  Text,
  DataWrap,
  LotBox,
  TextNum,
  LotBoxRow,
  LotIcon,
  HightChartsWrap,
} from '../Header/Style'
import { HighchartsReactWrap, CharTitle } from './style'
interface Props {
  title: string
  time: string
  type: string
  data: Array<{ num: number; icon: string; type: string }>
}
const WorkingStatus = (props: Props) => {
  return (
    <>
      <Col>
        <RightRow>
          <Space size={12}>
            <TitleCss>{props.title}</TitleCss>
            <Time>{props.time}</Time>
          </Space>
        </RightRow>
        <Text size={'12px'} onClick={() => 123}>
          <Space size={4}>
            <span>查看明细</span>
            <CommonIconFont
              type={'right'}
              size={14}
              color="var(--auxiliary-text-t2-d2)"
            />
          </Space>
        </Text>
      </Col>
      <DataWrap>
        {props.data.map(el => (
          <LotBox key={el.num}>
            <LotBoxRow>
              <LotIcon>
                <CommonIconFont
                  type={el.icon}
                  size={16}
                  color="var(--auxiliary-text-t2-d2)"
                />
              </LotIcon>
              <div>
                <TextNum>
                  <span>{el.num}</span>
                  <span>项</span>
                </TextNum>
                <Text
                  size={'12px'}
                  color={'var(--neutral-n2)'}
                  onClick={() => 123}
                >
                  <Space size={4}>
                    <span>{el.type}</span>
                    <CommonIconFont
                      type={'right'}
                      size={12}
                      color="var(--neutral-n2)"
                    />
                  </Space>
                </Text>
              </div>
            </LotBoxRow>
          </LotBox>
        ))}
      </DataWrap>
    </>
  )
}
// 图表位置柱状图
const HightChartMain = () => {
  // 折线图
  const options1 = {
    chart: {
      type: 'spline',
    },
    credits: {
      enabled: false,
    },
    title: {
      style: {
        display: 'none',
      },
    },
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      labels: {
        rotation: -30,
      },
      style: {
        display: 'none',
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: false,
      },
    },
    colors: ['#F6BD16'],
    series: [
      {
        data: [
          29.9, 71.5, 11.4, 12.2, 14.0, 16.0, 13.6, 18.5, 21.4, 14.1, 5.6, 54.4,
        ],
      },
    ],
  }
  // 图表位置柱状图
  const options = {
    credits: {
      enabled: false,
    },
    title: {
      style: {
        display: 'none',
      },
    },
    accessibility: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      labels: {
        rotation: -30,
      },
      style: {
        display: 'none',
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      width: 20,
      borderRadius: 6,
      min: 0,
      max: 100,
      title: {
        text: false,
      },
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
      },
    },
    tooltip: {
      borderColor: '#fff',
      shadow: false,
      headerFormat:
        '<div style="width:120px;background:#fff;height:76px;padding:16px"><div style="background:#fff;font-size:12px;font-family: SiYuanMedium;">{point.key}</div>',
      pointFormat:
        '<div style="marginTop:4px;background:#fff;display:flex;alignItems:center;"><div style="width:8px;height:8px;borderRadius:50%;background:#43BA9A;"></div><div style="marginLeft:8px;fontSize:12px,color:#646566">工作项：{point.y}项</div></div>',
      footerFormat: '</div>',
      shared: true,
      useHTML: true,
    },
    colors: ['#43BA9A '],
    series: [
      {
        borderRadius: 4,
        data: [
          29.9, 71.5, 10.4, 1.2, 14.0, 16.0, 15.6, 48.5, 21.4, 14.1, 5.6, 5.4,
        ],
      },
    ],
  }
  return (
    <HightChartsWrap>
      <CharTitle>
        <span>统计周期</span>
        <span className="day">14天</span>
        <CommonIconFont
          type={'down-left'}
          size={16}
          color="var(--function-error)"
        />
        <span className="time">较前14天 -10%</span>
      </CharTitle>
      <div>
        <HighchartsReactWrap
          width={400}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </HightChartsWrap>
  )
}
// 图表位置柱状图

const Home = () => {
  return (
    <div style={{ overflowY: 'auto', height: 'calc(100% - 100px)' }}>
      <Header />
      <WorkingStatus
        data={[
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
          { num: 120, type: '待修复', icon: 'right' },
        ]}
        title={'工作项现状'}
        time={'2023-03-01 ~ 2023-03-14'}
        type="Progress"
      />
      <div style={{ margin: '32px 0' }}>
        <WorkingStatus
          data={[{ num: 40, type: '缺陷修复露', icon: 'right' }]}
          title={'缺陷现状'}
          time={'2023-03-01 ~ 2023-03-14'}
          type="Defect"
        />
      </div>
      <div style={{ display: 'flex', padding: '0 24px' }}>
        <div>
          <Col>
            <RightRow>
              <Space size={12}>
                <TitleCss>阶段新增工作Top10</TitleCss>
                <Time>2023-03-01 ~ 2023-03-14</Time>
              </Space>
            </RightRow>
            <Text size={'14px'} color={'var(--neutral-n2)'} onClick={() => 123}>
              <Space size={4}>
                <CommonIconFont
                  type={'sort'}
                  size={14}
                  color="var(--neutral-n2)"
                />
                <span>由高到低</span>
              </Space>
            </Text>
          </Col>
          <HightChartMain />
        </div>
      </div>
    </div>
  )
}
export default Home
