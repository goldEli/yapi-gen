/* eslint-disable react/jsx-max-depth */
/* eslint-disable complexity */
/* eslint-disable max-len */
// 他的模块-他的概况

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */

import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { css } from '@emotion/css'
import { ChartsItem, HiddenText, SecondTitle } from '@/components/StyleCommon'
import { Select, Timeline, message } from 'antd'
import Gantt from '@/components/Gantt'
import moment from 'moment'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import {
  getMemberGantt,
  getMemberInfoOverviewStatistics,
  getUserGantt,
  getUserInfoOverviewFeed,
  getUserInfoOverviewStatistics,
} from '@/services/memberInfo'
import PaginationBox from '@/components/TablePagination'
import { getMessage } from '@/components/Message'
import { getHisProjectCharts } from '@/services/mine'
import LineAnimation from '@/views/Mine/components/LineAnimation'
import { FullScreenDiv } from '@/views/Mine/Profile'
import CommonIconFont from '@/components/CommonIconFont'
import FullScreenContainer from '@/views/KanBanBoard/FullScreenContainer'
import { setFullScreen } from '@store/kanBan'
import { useFullScreenHandle } from 'react-full-screen'

// eslint-disable-next-line @typescript-eslint/naming-convention

const Wrap = styled.div`
  padding: 0 24px;
  height: calc(100vh - 128px);
  /* overflow: scroll; */
`

const Mygante = styled(Gantt)`
  min-width: 1000px;
  .highcharts-tick {
    stroke: red;
  }
  .highcharts-axis-line {
    stroke: red;
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
  color: var(--primary-d1);
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
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  flex: 8;
`
const Center = styled.div`
  /* padding: 0 24px; */
  display: flex;
  gap: 24px;
  flex: 7;
`

const CenterRight = styled.div`
  box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.06);
  border-radius: 6px 6px 6px 6px;
  box-sizing: border-box;
  padding: 24px;
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
`
const InnerWrap = styled.div`
  margin-top: 16px;
  min-height: 88px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  /* border: 1px solid rgba(235, 237, 240, 1); */
  box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 16px 24px 16px 24px;
  border-radius: 6px;
  text-align: center;
`

const TimeLineWrap = styled.div`
  box-sizing: border-box;
  padding: 10px 10px;
  margin-top: 10px;
  overflow-y: scroll;
  height: 380px;
  overflow-x: hidden;
`
const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--neutral-n2);
  position: relative;
`
const GatteWrap = styled.div`
  background: white;
  box-sizing: border-box;
  margin: 0 16px;
  border-radius: 6px;
`

const HasIdWrap = styled.div({
  overflow: 'auto',
  padding: '0px 16px 0 24px',
})

const HeadWrap = styled.div({
  paddingBottom: '0px',

  background: 'white',
  borderRadius: 6,
  marginBottom: 16,
})

const TotalWrap = styled.div({
  height: 88,
  borderRadius: 6,
  boxShadow: '0px 0px 7px 1px rgba(0,0,0,0.06)',
  // border: '1px solid var(--neutral-n6-d1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
})

const Profile = () => {
  const handle = useFullScreenHandle()
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  const [t, i18n] = useTranslation()
  const [nowYearOptions, setNowYearOptions] = useState<any>()
  const [nowYear, setNowYear] = useState<any>(2023)
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { fullScreen } = useSelector(store => store.kanBan)
  const { userInfo } = useSelector(store => store.user)
  const [isScreen, setIsScreen] = useState<boolean>(false)
  const { projectInfo, colorList } = useSelector(store => store.project)
  const [chartData, setChartData] = useState<any>([])
  const [data, setData] = useState<any>({})
  const [gatteData, setGatteData] = useState<any>([])
  const [lineData, setLineData] = useState<any>([])
  const [monthIndex, setMonthIndex] = useState<any>(moment().month())
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [total, setTotal] = useState<number>(0)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const paramsData = getParamsData(searchParams)
  const { isMember, userId, id } = paramsData
  asyncSetTtile(
    `${t('title.a3')}【${mainInfo.name}】${
      projectInfo.name ? `-【 ${projectInfo.name}】` : ''
    } `,
  )
  const changeMonth = async () => {
    const params: any = {
      startTime: moment()
        .startOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment()
        .endOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD 23:59:59'),
      page: pageObj.page,
      pagesize: pageObj.size,
      targetId: userId,
    }
    if (isMember) {
      params.projectId = id
    }
    const res2 = isMember
      ? await getMemberGantt(params)
      : await getUserGantt(params)

    setGatteData(
      res2.list?.map((k: any) => ({
        id: k.id,
        demandText: k.text,
        text: `<div style="display: flex; align-items: center;padding-left: 16px">
        <img style="height: 18px;width: 18px ;border-radius: 4px;" src="${k.category_attachment}">
                 <span style="display:inline-block; width: 100px ;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;margin-left: 8px">${k.text}</span>
        </div>`,
        start_date: k.start_date,
        end_date: k.end_date,
        statusName: `<span style="display: inline-block;text-align: center;
        line-height: 20px;width:50px; white-space: nowrap;text-overflow: ellipsis;max-width: 110px;overflow: hidden; height: 20px; font-size:12px; border-radius: 6px; color: ${
          k?.is_start === 1 && k?.is_end === 2
            ? 'var(--neutral-n7)'
            : k?.is_end === 1 && k?.is_start === 2
            ? 'var(--neutral-n1-d1)'
            : k?.is_start === 2 && k?.is_end === 2
            ? 'var(--neutral-n7)'
            : 0
        }; background-color:${
          k?.is_start === 1 && k?.is_end === 2
            ? 'var(--auxiliary-b1)'
            : k?.is_end === 1 && k?.is_start === 2
            ? 'var(--neutral-n7)'
            : k?.is_start === 2 && k?.is_end === 2
            ? 'var(--function-success)'
            : 0
        };">${
          k?.is_start === 1 && k?.is_end === 2
            ? '待办'
            : k?.is_end === 1 && k?.is_start === 2
            ? '已完成'
            : k?.is_start === 2 && k?.is_end === 2
            ? '进行中'
            : 0
        }</span>`,
        statusTitle: k.statusName,
        parent: k.parent,
        render: k.render,
        statusColor: k.statusColor,
      })),
    )
    await setTotal(res2.pager.total)
    setLoadingState(true)
  }

  const getFeedList = async () => {
    const res1 = await getUserInfoOverviewFeed({
      limit: '',
      targetId: userId,
    })
    setLineData(res1)
  }

  const init = async () => {
    // const res = isMember
    //   ? await getMemberInfoOverviewStatistics({
    //       targetId: userId,
    //       projectId: id,
    //     })
    //   :
    const res = await getUserInfoOverviewStatistics({ targetId: userId })

    setData(res)
    if (!isMember) {
      getFeedList()
    }
  }

  useEffect(() => {
    init()
    changeMonth()
  }, [monthIndex, pageObj])

  const forMateMonth = useMemo(() => {
    const newDate = moment()
      .startOf('month')
      .month(monthIndex)
      .format('YYYY-MM-DD')
      .split('-')

    return i18n.language === 'zh'
      ? `${newDate[0]}年${newDate[1]}月`
      : `${newDate[0]} - ${newDate[1]}`
  }, [monthIndex])

  const onToDetail = (item: any) => {
    if (item?.isPublic !== 1 && !item.isUserMember) {
      getMessage({ msg: t('common.notCheckInfo'), type: 'warning' })
      return
    }

    if (item.deletedTime || item.projectDeletedTime) {
      getMessage({ msg: t('common.demandDeleteEd'), type: 'warning' })
      return
    }

    const params = encryptPhp(
      JSON.stringify({
        id: item.projectId,
        demandId: item.feedableId,
      }),
    )

    navigate(`/ProjectManagement/DemandDetail?data=${params}`)
  }
  const nextMonth = async () => {
    setMonthIndex(monthIndex - 1)
  }
  const prevMonth = async () => {
    setMonthIndex(monthIndex + 1)
  }
  const onChangePage = (page: any, size: number) => {
    setPageObj({ page, size })
  }

  const handleChange = (value: string) => {
    setNowYear(value)
  }
  const changeName = (key: any) => {
    let name: any
    switch (key) {
      case 'new':
        name = t('originalArray.new')
        break
      case 'completed':
        name = t('originalArray.completed')
        break
      case 'create':
        name = t('originalArray.create')
        break
      case 'verify':
        name = t('originalArray.verify')
        break

      default:
        break
    }
    return name
  }
  const trans = (originalData: any) => {
    return originalData.flatMap(({ year, month, data }: any) =>
      Object.entries(data).map(([name, gdp]) => ({
        name: changeName(name),
        year: month,
        gdp,
      })),
    )
  }
  const getYearList = async () => {
    const res = await getHisProjectCharts({
      year: nowYear,
      user_id: userId,
    })

    setNowYearOptions(res.data.years)

    setChartData(trans(res.data.list))
  }

  useEffect(() => {
    getYearList()
  }, [nowYear])

  if (!loadingState) {
    return <Loading />
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {/* {isMember ? (
        <>
          <HasIdWrap>
            <HeadWrap>
              <SecondTitle
                style={{ marginBottom: 16, display: 'inline-block' }}
              >
                {t('newlyAdd.hisSurvey')}
              </SecondTitle>
              <TotalWrap>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.secondAll}</span>
                  <span className={titleTextCss}>{t('mine.total')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>
                    {data?.secondNoFinish}
                  </span>
                  <span className={titleTextCss}>{t('mine.needDeal')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss2}>{data?.secondTimeOut}</span>
                  <span className={titleTextCss}>{t('mine.overdue')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss}>{data?.secondFinish}</span>
                  <span className={titleTextCss}>{t('mine.finishOn')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss2}>
                    {data?.secondOutFinish}
                  </span>
                  <span className={titleTextCss}>{t('mine.finishOver')}</span>
                </ChartsItem>
              </TotalWrap>
            </HeadWrap>
            <GatteWrap style={{ margin: 0 }}>
              <div>
                <SecondTitle>{t('newlyAdd.hisGantt')}</SecondTitle>
                <div className={titleWrap}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span onClick={nextMonth}>
                      <IconFont
                        className={hov}
                        type="left"
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
              {gatteData.length >= 1 && (
                <Mygante
                  data={gatteData}
                  height="calc(100vh - 430px)"
                  minHeight={300}
                />
              )}
              {gatteData.length < 1 && (
                <div style={{ height: 'calc(100vh - 372px)' }}>
                  <NoData />
                </div>
              )}
            </GatteWrap>
          </HasIdWrap>
          {gatteData.length >= 1 && (
            <PaginationBox
              total={total}
              currentPage={pageObj.page}
              pageSize={pageObj.size}
              onChange={onChangePage}
            />
          )}
        </>
      ) : ( */}
      <Wrap>
        <div>
          <Head>
            <div>
              <InnerWrap>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.project_count}</span>
                  <span className={titleTextCss}>{t('mine.totalProject')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss}>{data?.story_count}</span>
                  <span className={titleTextCss}>累计参与工作项</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>
                    {data?.abeyance_count}
                  </span>
                  <span className={titleTextCss}>待办工作项</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.finish_count}</span>
                  <span className={titleTextCss}>已办工作项</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.create_count}</span>
                  <span className={titleTextCss}>我创建的工作项</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.copy_me_count}</span>
                  <span className={titleTextCss}>抄送我的工作项</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss2}>
                    {data?.approving_count}
                  </span>
                  <span className={titleTextCss}>待审核的工作项</span>
                </ChartsItem>
              </InnerWrap>
            </div>
            <div>
              {/* <SecondTitle>{t('newlyAdd.hisNotFinish')}</SecondTitle> */}
            </div>
          </Head>
          <Center>
            <CenterRight>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <SecondTitle>工作项接收处理情况</SecondTitle>
                <Select
                  onChange={handleChange}
                  defaultValue={nowYear}
                  style={{ width: 120 }}
                  options={nowYearOptions}
                />
              </div>

              <LineAnimation data={chartData} />
            </CenterRight>
            <CenterRight>
              <SecondTitle>{t('newlyAdd.hisFeed')}</SecondTitle>
              {lineData.length < 1 ? (
                <NoData />
              ) : (
                <TimeLineWrap>
                  <Timeline>
                    {lineData.map((item: any) => (
                      <Timeline.Item key={item.id}>
                        <LineItem>
                          <span>{item.createTime}</span>
                          <span>{item.content}</span>
                        </LineItem>
                        <LineItem>
                          <HiddenText>
                            <OmitText
                              width={200}
                              tipProps={{
                                getPopupContainer: node => node,
                              }}
                            >
                              {item.projectName}
                            </OmitText>
                          </HiddenText>
                          <HiddenText>
                            <OmitText
                              width={300}
                              tipProps={{
                                getPopupContainer: node => node,
                              }}
                            >
                              <span
                                onClick={() => onToDetail(item)}
                                style={{
                                  color: 'var(--primary-d1)',
                                  cursor: 'pointer',
                                }}
                              >
                                {item.name}
                              </span>
                            </OmitText>
                          </HiddenText>
                        </LineItem>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </TimeLineWrap>
              )}
            </CenterRight>
          </Center>
        </div>
        <FullScreenContainer>
          <FullScreenDiv isScreen={fullScreen}>
            <GatteWrap>
              <div style={{ padding: '28px 0px 0' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <SecondTitle>{t('mine.demandGatt')}</SecondTitle>
                  <div
                    onClick={() =>
                      fullScreen
                        ? handle.enter()
                        : dispatch(setFullScreen(true))
                    }
                    style={{
                      width: '98px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <CommonIconFont
                      type={fullScreen ? 'fewer-screen' : 'full-screen'}
                    />
                    <span>{fullScreen ? '退出全屏' : '全屏'}</span>
                  </div>
                </div>
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
              {gatteData.length >= 1 && (
                <Mygante data={gatteData} height={380} />
              )}
              {gatteData.length < 1 && (
                <div style={{ height: 'calc(100vh - 508px)' }}>
                  <NoData />
                </div>
              )}
            </GatteWrap>
            {gatteData.length >= 1 && (
              <PaginationBox
                total={total}
                currentPage={pageObj.page}
                pageSize={pageObj.size}
                onChange={onChangePage}
              />
            )}
          </FullScreenDiv>
        </FullScreenContainer>
      </Wrap>
      {/* )} */}
    </>
  )
}

export default Profile
