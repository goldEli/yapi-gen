/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { useModel } from '@/models'
import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import {
  ChartsItem,
  PaginationWrap,
  SecondTitle,
} from '@/components/StyleCommon'
import { Timeline, message, Pagination } from 'antd'
import Gatte from './components/Gatte'
import PermissionWrap from '@/components/PermissionWrap'
import moment from 'moment'
import IconFont from '@/components/IconFont'

// eslint-disable-next-line @typescript-eslint/naming-convention

const Mygante = styled(Gatte)`
  .highcharts-tick {
    stroke: rgba(235, 237, 240, 1);
  }
  .highcharts-axis-line {
    stroke: rgba(235, 237, 240, 1);
  }
  .highcharts-axis-title {
    width: 100px !important;
  }
`
const hov = css`
  &:hover {
    color: rgba(40, 119, 255, 1);
  }
`
const titleWrap = css`
  display: flex;
  justify-content: space-between;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`
const timeChoose = css`
  margin: 0 8px;
`
const titleNumberCss = css`
  color: rgba(67, 186, 154, 1);
  font-size: 24px;
`
const titleNumberCss2 = css`
  color: rgba(250, 151, 70, 1);
  font-size: 24px;
`
const titleNumberCss3 = css`
  color: rgba(40, 119, 255, 1);
  font-size: 24px;
`
const titleTextCss = css`
  color: rgba(100, 101, 102, 1);
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
  /* width: 360px; */
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
  const [monthIndex, setMonthIndex] = useState<any>(moment().month())
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const navigate = useNavigate()

  const changeMonth = async () => {
    const res2 = await getMineGatte({
      startTime: moment()
        .startOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD'),
      endTime: moment().endOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD'),
      page,
      pagesize,
    })

    setGatteData(res2.list)
    setTotal(res2.pager.total)
  }
  const init = async () => {
    const res = await getMineChartsList()

    setData(res)
    const res1 = await getUserFeedList({
      limit: '',
    })

    setLineData(res1.data)
  }

  useEffect(() => {
    init()
    changeMonth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthIndex, page, pagesize])

  const forMateMonth = useMemo(() => {
    const newDate = moment()
      .startOf('month')
      .month(monthIndex)
      .format('YYYY-MM-DD')
      .split('-')

    return ` ${newDate[0]}年${newDate[1]}月`
  }, [monthIndex])

  const onToDetail = (item: any) => {
    if (item.feedable.deleted_at || item.feedable.project.deleted_at) {
      message.warning('该需求已被删除！')
      return
    }

    navigate(
      `/Detail/Demand?type=info&id=${item.feedable.project_id}&demandId=${item.feedable_id}`,
    )
  }
  const nextMonth = async () => {
    setMonthIndex(monthIndex - 1)
  }
  const prevMonth = async () => {
    setMonthIndex(monthIndex + 1)
  }
  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  return (
    <PermissionWrap
      auth="b/user/overview"
      permission={userInfo?.company_permissions}
    >
      <StyledWrap>
        <Head>
          <HeadLeft>
            <SecondTitle>基本概况</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstP}</span>
                <span className={titleTextCss}>累计参与项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstN}</span>
                <span className={titleTextCss}>累计参与需求</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstD}</span>
                <span className={titleTextCss}>累计参与迭代</span>
              </ChartsItem>
            </InnerWrap>
          </HeadLeft>
          <HeadRight>
            <SecondTitle>待办事项</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.secondAll}</span>
                <span className={titleTextCss}>总计</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.secondNoFinish}</span>
                <span className={titleTextCss}>待办</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss2}>{data?.secondTimeOut}</span>
                <span className={titleTextCss}>逾期</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>{data?.secondFinish}</span>
                <span className={titleTextCss}>按时完成</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss2}>{data?.secondOutFinish}</span>
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
                      <span>{item.content}</span>
                    </LineItem>
                    <LineItem>
                      <span>{item.feedable?.project.name}</span>
                      <span
                        onClick={() => onToDetail(item)}
                        style={{
                          color: 'rgba(40, 119, 255, 1)',
                          cursor: 'pointer',
                        }}
                      >
                        {item.feedable?.name}
                      </span>
                    </LineItem>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TimeLineWrap>
          </CenterRight>
        </Center>
      </StyledWrap>
      <GatteWrap>
        <div>
          <SecondTitle>需求甘特图</SecondTitle>
          <div className={titleWrap}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span onClick={nextMonth}>
                <IconFont
                  className={hov}
                  type="left
              "
                  style={{ fontSize: 15, cursor: 'pointer' }}
                />
              </span>

              <span className={timeChoose}>{forMateMonth}</span>
              <span onClick={prevMonth}>
                <IconFont
                  className={hov}
                  type="right
              "
                  style={{ fontSize: 15, cursor: 'pointer' }}
                />
              </span>
            </div>
          </div>
        </div>
        {gatteData.length >= 1 && <Mygante data={gatteData} />}
        {gatteData.length < 1 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            暂无数据
          </div>
        )}
        <PaginationWrap>
          <Pagination
            defaultCurrent={1}
            current={page}
            showSizeChanger
            hideOnSinglePage
            showQuickJumper
            total={total}
            showTotal={newTotal => `Total ${newTotal} items`}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      </GatteWrap>
    </PermissionWrap>
  )
}

export default Profile
