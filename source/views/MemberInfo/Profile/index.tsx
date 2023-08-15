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
  getPUserInfoOverviewFeed,
  getUserGantt,
  getUserInfoOverviewFeed,
  getUserInfoOverviewStatistics,
} from '@/services/memberInfo'
import PaginationBox from '@/components/TablePagination'
import { getMessage } from '@/components/Message'
import { getHisProjectCharts } from '@/services/mine'
import LineAnimation from '@/views/Mine/components/LineAnimation'
import { BBQdiv, FullScreenDiv } from '@/views/Mine/Profile'
import CommonIconFont from '@/components/CommonIconFont'
import FullScreenContainer from '@/views/KanBanBoard/FullScreenContainer'
import { setFullScreen } from '@store/kanBan'
import { useFullScreenHandle } from 'react-full-screen'
import ScreenMinHover from '@/components/ScreenMinHover'

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
  color: var(--neutral-n1-d1);
  font-size: 24px;
  font-family: SiYuanMedium;
`
const titleNumberCss2 = css`
  color: rgba(250, 151, 70, 1);
  font-size: 24px;
`
const titleNumberCss3 = css`
  color: var(--primary-d1);
  font-size: 24px;
  font-family: SiYuanMedium;
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
            ? t('to_do')
            : k?.is_end === 1 && k?.is_start === 2
            ? t('common.finished')
            : k?.is_start === 2 && k?.is_end === 2
            ? t('situation.ongoing')
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
    const res = isMember
      ? await getMemberInfoOverviewStatistics({
          targetId: userId,
          projectId: id,
        })
      : await getUserInfoOverviewStatistics({ targetId: userId })

    setData(res)

    const res2 = isMember
      ? await getPUserInfoOverviewFeed({
          targetId: userId,
          projectId: id,
        })
      : await getUserInfoOverviewFeed({
          limit: '',
          targetId: userId,
        })

    setLineData(res2)
  }

  useEffect(() => {
    init()
    changeMonth()
  }, [monthIndex, pageObj, fullScreen])

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
    if (item.deletedTime || item.projectDeletedTime) {
      getMessage({ msg: t('common.demandDeleteEd'), type: 'warning' })
      return
    }

    let params: any = {
      id: item.projectId,
      detailId: item.feedableId,
      isOpenScreenDetail: true,
    }
    let url

    switch (item.resource_type) {
      case 1:
        params.specialType = 3
        url = 'ProjectManagement/Demand'
        break
      case 2:
        params.specialType = 2
        url = 'ProjectManagement/Defect'
        break
      case 10:
        params.specialType = 1
        url = 'SprintProjectManagement/Affair'
        break
      default:
        break
    }
    if (params.specialType) {
      const resultParams = encryptPhp(JSON.stringify(params))
      window.open(
        `${window.origin}${
          import.meta.env.__URL_HASH__
        }${url}?data=${resultParams}}`,
      )
    }
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
      year: nowYear + '',
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
    <div style={{ overflow: 'auto', height: 'calc(100vh - 133px)' }}>
      <Wrap>
        <div>
          <Head>
            <div>
              <InnerWrap>
                <ChartsItem>
                  <span className={titleNumberCss}>{data?.project_count}</span>
                  <span className={titleTextCss}>{t('mine.totalProject')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss}>{data?.story_count}</span>
                  <span className={titleTextCss}>
                    {t('accumulated_work_items')}
                  </span>
                </ChartsItem>
                <div
                  style={{
                    width: '0px',
                    borderLeft: '1px solid var(--neutral-n6-d1)',
                  }}
                ></div>
                <ChartsItem>
                  <span className={titleNumberCss3}>
                    {data?.abeyance_count}
                  </span>
                  <span className={titleTextCss}>{t('todo_work_items')}</span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.finish_count}</span>
                  <span className={titleTextCss}>
                    {t('completed_work_items')}
                  </span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.create_count}</span>
                  <span className={titleTextCss}>
                    {t('my_created_work_items2')}
                  </span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>{data?.copy_me_count}</span>
                  <span className={titleTextCss}>
                    {t('cc_to_me_work_items2')}
                  </span>
                </ChartsItem>
                <ChartsItem>
                  <span className={titleNumberCss3}>
                    {data?.approving_count}
                  </span>
                  <span className={titleTextCss}>
                    {t('pending_approval_work_items')}
                  </span>
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
                <SecondTitle>{t('work_item_receiving_processing')}</SecondTitle>
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
                  <ScreenMinHover
                    label={
                      fullScreen ? t('exit_full_screen') : t('full_screen')
                    }
                    icon={fullScreen ? 'fewer-screen' : 'full-screen'}
                    onClick={() =>
                      fullScreen
                        ? handle.enter()
                        : dispatch(setFullScreen(true))
                    }
                  />
                  {/* <BBQdiv
                    onClick={() =>
                      fullScreen
                        ? handle.enter()
                        : dispatch(setFullScreen(true))
                    }
                    style={{
                      // width: '98px',
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
                    <span style={{ marginLeft: '10px' }}>
                      {fullScreen ? t('exit_full_screen') : t('full_screen')}
                    </span>
                  </BBQdiv> */}
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: fullScreen ? '90vh' : '',
                }}
              >
                {gatteData.length >= 1 && (
                  <Mygante
                    data={gatteData}
                    minHeight={fullScreen ? '85vh' : 380}
                  />
                )}
                {gatteData.length < 1 && (
                  <div style={{ height: 'calc(100vh - 508px)' }}>
                    <NoData />
                  </div>
                )}
                {gatteData.length >= 1 && (
                  <PaginationBox
                    total={total}
                    currentPage={pageObj.page}
                    pageSize={pageObj.size}
                    onChange={onChangePage}
                  />
                )}
              </div>
            </GatteWrap>
          </FullScreenDiv>
        </FullScreenContainer>
      </Wrap>
      {/* )} */}
    </div>
  )
}

export default Profile
