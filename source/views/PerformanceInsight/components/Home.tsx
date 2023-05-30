/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import { Space } from 'antd'
import Header from '../Header'
import { setSave } from '@store/performanceInsight'
import { useDispatch } from 'react-redux'
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
} from '../Header/Style'
import { DialogMain, DialogHeader, TextColor, Footer } from './style'

import { useEffect, useState } from 'react'
import SelectMain from '../Header/components/SelectMain'
import CommonButton from '@/components/CommonButton'
import { useSelector } from '@store/index'
import ViewDialog from '../Header/components/ViewDialog'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
import HightChartMainBar from './HightChartMainBar'
import HightChartMainLine from './HightChartMainLine'
import HightChartMainPie from './HightChartMainPie'
import HightChartMainSpline from './HightChartMainSpline'
import { getStatisticsTotal } from '@/services/efficiency'

interface Props {
  title: string
  time: string
  data: Array<Model.Sprint.WorkListItem>
  homeType: string
  num: number
}
const WorkingStatus = (props: Props) => {
  const navigate = useNavigate()
  const onClick = () => {
    const params = encryptPhp(
      JSON.stringify({
        data: props.data,
        type:
          props.num === 1
            ? `Progress_${props.homeType}`
            : `Defect_${props.homeType}`,
        homeType: props.homeType,
        title:
          props.num === 1 && props.homeType === 'all'
            ? '数据明细'
            : props.num === 1
            ? '工作进展对比'
            : '缺陷趋势分析',
      }),
    )
    navigate(`/Report/ChildLevel?data=${params}`)
  }
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
          <Space size={4} onClick={() => onClick()}>
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
        {props.data?.map(el => (
          <LotBox key={el.name} onClick={() => onClick()}>
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
                  <span>{el.value}</span>
                  <span>{el.unit}</span>
                </TextNum>
                <Text
                  size={'12px'}
                  color={'var(--neutral-n2)'}
                  onClick={() => 123}
                >
                  <Space size={4}>
                    <span>{el.name}</span>
                    <CommonIconFont type={'right'} size={12} />
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
const Home = () => {
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const { save } = useSelector(store => store.performanceInsight)
  // 'iteration''sprint' 'all'
  const [homeType, setHomeType] = useState('all')
  const [workDataList, setWorkDataList] =
    useState<API.Sprint.GetStatisticsTotal.Result>()
  useEffect(() => {
    // 缺陷现状和工作项现状
    getWorkList()
  }, [])
  // 缺陷现状和工作项现状
  const getWorkList = async () => {
    let res = await getStatisticsTotal({
      project_ids: [1, 2],
      iterate_ids: [12, 23],
      user_ids: [1, 23, 44],
      start_time: '2023-05-30 00:00:00',
      end_time: '2023-05-30 00:00:00',
      period_time:
        '周期时间：two_week,four_week,one_month,three_month,six_month',
    })
    setWorkDataList(res)
  }
  return (
    <div
      style={{
        overflowY: 'auto',
        height: 'calc(100% - 24px)',
        position: 'relative',
      }}
    >
      <Header homeType={homeType} />
      <WorkingStatus
        homeType={homeType}
        data={workDataList?.work || []}
        title={homeType === 'all' ? '现状' : '工作项现状'}
        time={'2023-03-01 ~ 2023-03-14'}
        num={1}
      />
      <div style={{ margin: '32px 0' }}>
        <WorkingStatus
          num={2}
          homeType={homeType}
          data={workDataList?.defect || []}
          title={'缺陷现状'}
          time={'2023-03-01 ~ 2023-03-14'}
        />
      </div>
      <div style={{ width: '100%', display: 'flex' }}>
        <div style={{ width: '100%' }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 24px',
            }}
          >
            <HightChartMainBar
              title={
                homeType === 'all' ? '新增工作排行Top10' : '阶段新增工作Top10'
              }
              titleType={true}
              height={396}
              numType={false}
              time={'2012-010'}
              onChange={(val: any) => console.log('c', val)}
            />
            <HightChartMainLine
              title={homeType === 'all' ? '工作完成周期' : '工作周期对比'}
              time="2023-03-01 ~ 2023-03-14"
              height={396}
            />
          </div>
          <div
            style={{
              width: '100%',
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 24px',
            }}
          >
            <HightChartMainPie
              height={352}
              titleType={false}
              title={homeType === 'all' ? '存量风险' : '阶段存量风险'}
            />
            <HightChartMainBar
              titleType={false}
              height={352}
              numType={false}
              title={homeType === 'all' ? '完成率Top10' : '阶段完成率Top10'}
              time={'2012-010'}
              onChange={(val: any) => console.log('c')}
            />
          </div>
          <div
            style={{
              width: '100%',
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 24px',
            }}
          >
            <HightChartMainSpline
              title="缺陷趋势"
              time="2023-03-01 ~ 2023-03-14"
              height={396}
            />
            <HightChartMainPie
              height={396}
              titleType={true}
              title="阶段缺陷占比"
              time="2023-03-01 ~ 2023-03-14"
            />
          </div>
        </div>
      </div>
      {/* 保存提示操作 */}
      {save && (
        <DialogMain>
          <DialogHeader>
            <Space size={14}>
              <CommonIconFont
                type={'Warning'}
                size={20}
                color="var(--function-warning)"
              />
              <span>检测到此视图有未保存的更改</span>
            </Space>
            <CommonIconFont
              onClick={() => dispatch(setSave(false))}
              type={'close'}
              size={16}
              color="var(--neutral-n2)"
            />
          </DialogHeader>
          <TextColor>单击“保存”按钮可以将更改保存在如下视图</TextColor>
          <div style={{ margin: '8px 0 0 32px' }}>
            <SelectMain
              onChange={e => console.log(e)}
              placeholder="请选择"
              value={1}
              list={[
                {
                  name: '近7天',
                  key: 7,
                },
                {
                  name: '近15天',
                  key: 15,
                },
                {
                  name: '近1月',
                  key: 1,
                },
                {
                  name: '近3个月',
                  key: 3,
                },
                {
                  name: '自定义',
                  key: 0,
                },
              ]}
            />
          </div>
          <Footer>
            <Space size={6}>
              <span
                style={{
                  color: 'var(--auxiliary-text-t2-d1)',
                  cursor: 'pointer',
                }}
              >
                不保存
              </span>
            </Space>
            <Space size={16}>
              <CommonButton type="light" onClick={() => setIsVisible(true)}>
                另存为
              </CommonButton>
              <CommonButton type="primary" onClick={() => 123}>
                保存
              </CommonButton>
            </Space>
          </Footer>
        </DialogMain>
      )}
      {/* 新建和编辑视图 1*/}
      <ViewDialog
        name={''}
        title={'另存为视图'}
        onConfirm={() => {
          console.log(123)
        }}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
    </div>
  )
}
export default Home
