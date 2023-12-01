/* eslint-disable react/jsx-max-depth */
/* eslint-disable complexity */
/* eslint-disable max-len */
// 他的模块-他的概况

import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { css } from '@emotion/css'
import {
  ChartsItem,
  ChartsItem1,
  HiddenText,
  SecondTitle,
} from '@/components/StyleCommon'
import { Select, Timeline } from 'antd'
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
import FullScreenContainer from '@/views/KanBanBoard/FullScreenContainer'
import { setFullScreen } from '@store/kanBan'
import { useFullScreenHandle } from 'react-full-screen'
import ScreenMinHover from '@/components/ScreenMinHover'
import LineAnimation from '@/views/Layout/Mine/components/LineAnimation'

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  color: var(--neutral-n3);
  &:hover {
    color: rgba(40, 119, 255, 1);
  }
`
const titleWrap = css`
  display: flex;
  justify-content: space-between;
  justify-content: center;
  align-items: center;
  margin-right: 24px;
`
const timeChoose = css`
  margin: 0 8px;
`
const titleNumberCss = css`
  color: var(--neutral-n1-d1);
  font-size: 24px;
  font-family: SiYuanMedium;
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
export const FullScreenDiv = styled.div<{ isScreen: boolean }>`
  height: ${props => (props.isScreen ? '100vh' : '')};
  background: white;
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
  flex: 8;
`
const Center = styled.div`
  display: flex;
  gap: 32px;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const CenterRight = styled.div`
  border-radius: 6px 6px 6px 6px;
  box-sizing: border-box;
  padding: 24px;
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  margin-top: 16px;
`
const InnerWrap = styled.div`
  min-height: 88px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 6px;
  align-items: center;
`
const TimeLineWrap = styled.div`
  border-radius: 6px;
  box-sizing: border-box;
  height: 400px;
`
const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--neutral-n2);
`
const GatteWrap = styled.div`
  background: var(--neutral-white-d2);
  box-sizing: border-box;
  margin: 0 16px;
  border-radius: 6px;
`
const Content = styled.div`
  padding: 16px;
  background: var(--neutral-n8);
  border-radius: 6px;
`
const Profile = () => {
  const handle = useFullScreenHandle()
  const dispatch = useDispatch()
  const asyncSetTtile = useSetTitle()
  const [t, i18n] = useTranslation()
  const { fullScreen } = useSelector(store => store.kanBan)
  const fullScreenvisible = useSelector(
    store => store.project.addWorkItemModal.visible,
  )
  const [data, setData] = useState<any>({})
  const [nowYear, setNowYear] = useState<any>('2023')
  const [chartData, setChartData] = useState<any>([])
  const [nowYearOptions, setNowYearOptions] = useState<any>()
  const [gatteData, setGatteData] = useState<any>([])
  const [lineData, setLineData] = useState<any>([])
  const [monthIndex, setMonthIndex] = useState<any>(moment().month())
  const [pageObj, setPageObj] = useState({ page: 1, size: 30 })
  const [total, setTotal] = useState<number>(0)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { projectInfo } = useSelector(store => store.project)

  asyncSetTtile(
    `${t('title.a3')}【${mainInfo.name}】${
      projectInfo.name ? `-【 ${projectInfo.name}】` : ''
    } `,
  )

  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { isMember, userId, id } = paramsData

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
        url = 'ProjectDetail/Demand'
        break
      case 2:
        params.specialType = 2
        url = 'ProjectDetail/Defect'
        break
      case 10:
        params.specialType = 1
        url = 'ProjectDetail/Affair'
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
    <div
      style={{
        overflow: 'auto',
        height: isMember ? 'calc(100vh - 117px)' : 'calc(100vh - 56px)',
        background: 'var(--neutral-white-d1)',
      }}
    >
      <Head>
        <InnerWrap>
          <ChartsItem1 background="rgba(102,136,255,0.08)">
            <span className={titleNumberCss}>{data?.project_count}</span>
            <span className={titleTextCss}>{t('mine.totalProject')}</span>
          </ChartsItem1>
          <ChartsItem1 background="rgba(250,151,70,0.08)">
            <span className={titleNumberCss}>{data?.story_count}</span>
            <span className={titleTextCss}>{t('accumulated_work_items')}</span>
          </ChartsItem1>
          <div
            style={{
              width: '1px',
              height: '56px',
              background: 'var(--neutral-n6-d1)',
            }}
          ></div>
          <ChartsItem>
            <span className={titleNumberCss3}>{data?.abeyance_count}</span>
            <span className={titleTextCss}>{t('todo_work_items')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={titleNumberCss3}>{data?.finish_count}</span>
            <span className={titleTextCss}>{t('completed_work_items')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={titleNumberCss3}>{data?.create_count}</span>
            <span className={titleTextCss}>{t('my_created_work_items2')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={titleNumberCss3}>{data?.copy_me_count}</span>
            <span className={titleTextCss}>{t('cc_to_me_work_items2')}</span>
          </ChartsItem>
          <ChartsItem>
            <span className={titleNumberCss3}>{data?.approving_count}</span>
            <span className={titleTextCss}>
              {t('pending_approval_work_items')}
            </span>
          </ChartsItem>
        </InnerWrap>
      </Head>
      <div style={{ padding: '0 24px' }}>
        <Content>
          <Center>
            <Box>
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
                  options={nowYearOptions?.map((i: any) => ({
                    value: i.value,
                    label: i.name,
                  }))}
                />
              </div>
              <CenterRight>
                <LineAnimation data={chartData} />
              </CenterRight>
            </Box>
            <Box>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 32,
                }}
              >
                <SecondTitle>{t('newlyAdd.hisFeed')}</SecondTitle>
              </div>
              <CenterRight>
                {lineData.length < 1 ? (
                  <NoData />
                ) : (
                  <TimeLineWrap>
                    <Timeline
                      style={{
                        overflowY: 'scroll',
                        height: '400px',
                        overflowX: 'hidden',
                        padding: '10px 10px 0 0',
                      }}
                    >
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
                                {item?.projectName ?? '--'}
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
                                  {item?.name ?? '--'}
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
            </Box>
          </Center>
          <FullScreenContainer isScreen={fullScreen}>
            <div
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <SecondTitle>
                {t('dateDistributionOfCompletedWorkItems')}
              </SecondTitle>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
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
                <ScreenMinHover
                  label={fullScreen ? t('exit_full_screen') : t('full_screen')}
                  icon={fullScreen ? 'fewer-screen' : 'full-screen'}
                  onClick={() =>
                    fullScreen ? handle.enter() : dispatch(setFullScreen(true))
                  }
                />
              </div>
            </div>
            <FullScreenDiv isScreen={fullScreen}>
              <GatteWrap>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: fullScreen ? 'calc(100vh - 68px)' : '',
                  }}
                >
                  {gatteData.length >= 1 && (
                    <Mygante
                      data={gatteData}
                      minHeight={fullScreen ? '89vh' : 380}
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
        </Content>
      </div>
    </div>
  )
}

export default Profile
