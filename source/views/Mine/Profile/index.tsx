/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { useModel } from '@/models'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { ChartsItem, SecondTitle } from '@/components/StyleCommon'
import { Line } from '@ant-design/plots'
import { Timeline, DatePicker } from 'antd'
import Gatte from './components/Gatte'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools/index'

// eslint-disable-next-line @typescript-eslint/naming-convention
const { RangePicker } = DatePicker

const titleNumberCss = css`
  color: rgba(67, 186, 154, 1);
  font-size: 24px;
`
const titleNumberCss2 = css`
  color: rgba(250, 151, 70, 1);
  font-size: 24px;
`
const titleNumberCss3 = css`
  color: rgba(67, 186, 154, 1);
  font-size: 24px;
`
const titleTextCss = css`
  color: rgba(40, 119, 255, 1);
  font-size: 12px;
`
const StyledWrap = styled.div`
  height: 400px;
  padding: 16px;
  display: flex;
  gap: 17px;
`
const Head = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  flex: 1;
`
const HeadLeft = styled.div`
  /* flex: 2; */
`
const HeadRight = styled.div`
  /* flex: 3; */
`
const Center = styled.div`
  display: flex;
  flex: 2;
`

const CenterRight = styled.div`
  box-sizing: border-box;
  padding: 24px;
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
`
const InnerWrap = styled.div`
  margin-top: 16px;
  height: 88px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 16px 24px 16px 24px;
  border-radius: 6px;
`

const TimeLineWrap = styled.div`
  box-sizing: border-box;
  padding: 10px 10px;
  margin-top: 10px;
  overflow-y: scroll;

  height: 300px;
`
const LineItem = styled.div`
  width: 360px;
  display: flex;
  justify-content: space-between;
`
const GatteWrap = styled.div`
  background: #f5f7fa;
  box-sizing: border-box;
  padding: 0 16px;
`
const Profile = () => {
  const { getMineChartsList, getUserFeedList, getMineGatte } = useModel('mine')
  const { userInfo } = useModel('user')
  const [data, setData] = useState<any>({})
  const [gatteData, setGatteData] = useState<any>([])
  const [lineData, setLineData] = useState<any>([])
  const init = async () => {
    const res = await getMineChartsList()

    setData(res)
    const res1 = await getUserFeedList({
      limit: '',
      page: 1,
      pagesize: 10,
    })

    setLineData(res1.data)
  }
  const onChange = async (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    const res = await getMineGatte({
      startTime: dateString[0],
      endTime: dateString[1],

      // startTime: '2022-07-01 00:00:00',
      // endTime: '2022-07-31 23:59:59',
    })
    setGatteData(res)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <PermissionWrap
      auth={getIsPermission(userInfo?.company_permissions, 'b/user/overview')}
    >
      <StyledWrap>
        <Head>
          <HeadLeft>
            <SecondTitle>基本概况</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.firstP}</span>
                <span className={titleTextCss}>累计参与项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.firstN}</span>
                <span className={titleTextCss}>累计参与需求</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.firstD}</span>
                <span className={titleTextCss}>累计参与迭代</span>
              </ChartsItem>
            </InnerWrap>
          </HeadLeft>
          <HeadRight>
            <SecondTitle>待办事项</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondAll}</span>
                <span className={titleTextCss}>总计</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondNoFinish}</span>
                <span className={titleTextCss}>待办</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondTimeOut}</span>
                <span className={titleTextCss}>逾期</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondFinish}</span>
                <span className={titleTextCss}>按时完成</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondOutFinish}</span>
                <span className={titleTextCss}>逾期完成</span>
              </ChartsItem>
            </InnerWrap>
          </HeadRight>
        </Head>
        <Center>
          <CenterRight>
            <SecondTitle>我的动态</SecondTitle>
            <TimeLineWrap>
              <Timeline>
                {lineData.map((item: any) => (
                  <Timeline.Item key={item.id}>
                    <LineItem>
                      <span>{item.created_at}</span>
                      <span style={{ color: 'rgba(40, 119, 255, 1)' }}>
                        {item.content}
                      </span>
                    </LineItem>
                    <LineItem>
                      <span>{item.feedable?.project.name}</span>
                      <span>{item.feedable?.name}</span>
                    </LineItem>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TimeLineWrap>
          </CenterRight>
        </Center>
      </StyledWrap>
      <GatteWrap>
        <SecondTitle>需求甘特图</SecondTitle>
        <RangePicker format="YYYY-MM-DD" onChange={onChange} />
        <Gatte data={gatteData} />
      </GatteWrap>
    </PermissionWrap>
  )
}

export default Profile
