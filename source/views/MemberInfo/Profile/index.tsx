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
import { Timeline, message } from 'antd'
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
import { useSelector } from '@store/index'
import {
  getMemberGantt,
  getMemberInfoOverviewStatistics,
  getUserGantt,
  getUserInfoOverviewFeed,
  getUserInfoOverviewStatistics,
} from '@/services/memberInfo'
import PaginationBox from '@/components/TablePagination'

// eslint-disable-next-line @typescript-eslint/naming-convention

const Wrap = styled.div`
  height: calc(100vh - 128px);
  overflow: scroll;
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
  display: flex;
  flex: 7;
`

const CenterRight = styled.div`
  box-sizing: border-box;
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
`
const InnerWrap = styled.div`
  margin-top: 16px;
  min-height: 88px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
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
  height: 300px;
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
  padding: '0px 16px 0 16px',
})

const HeadWrap = styled.div({
  padding: 24,
  paddingTop: 0,
  background: 'white',
  borderRadius: 6,
  marginBottom: 16,
})

const TotalWrap = styled.div({
  height: 88,
  borderRadius: 6,
  border: '1px solid var(--neutral-n6-d1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
})

const Profile = () => {
  const asyncSetTtile = useSetTitle()
  const [t, i18n] = useTranslation()
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo, colorList } = useSelector(store => store.project)
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
    const res = isMember
      ? await getMemberInfoOverviewStatistics({
          targetId: userId,
          projectId: id,
        })
      : await getUserInfoOverviewStatistics({ targetId: userId })
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
      message.warning(t('common.notCheckInfo'))
      return
    }

    if (item.deletedTime || item.projectDeletedTime) {
      message.warning(t('common.demandDeleteEd'))
      return
    }

    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.projectId,
        demandId: item.feedableId,
      }),
    )

    navigate(`/ProjectManagement/Demand?data=${params}`)
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
  if (!loadingState) {
    return <Loading />
  }
  return (
    <>
      {isMember ? (
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
              <div style={{ padding: '0px 24px 0' }}>
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
      ) : (
        <Wrap>
          <StyledWrap>
            <Head>
              <div>
                <SecondTitle>{t('newlyAdd.hisSurvey')}</SecondTitle>
                <InnerWrap>
                  <ChartsItem>
                    <span className={titleNumberCss3}>{data?.firstP}</span>
                    <span className={titleTextCss}>
                      {t('mine.totalProject')}
                    </span>
                  </ChartsItem>
                  <ChartsItem>
                    <span className={titleNumberCss3}>{data?.firstN}</span>
                    <span className={titleTextCss}>
                      {t('mine.totalDemand')}
                    </span>
                  </ChartsItem>
                  <ChartsItem>
                    <span className={titleNumberCss3}>{data?.firstD}</span>
                    <span className={titleTextCss}>
                      {t('mine.totalIterate')}
                    </span>
                  </ChartsItem>
                </InnerWrap>
              </div>
              <div>
                <SecondTitle>{t('newlyAdd.hisNotFinish')}</SecondTitle>
                <InnerWrap>
                  <ChartsItem style={{ width: '20%' }}>
                    <span className={titleNumberCss3}>{data?.secondAll}</span>
                    <span className={titleTextCss}>{t('mine.total')}</span>
                  </ChartsItem>
                  <ChartsItem style={{ width: '20%' }}>
                    <span className={titleNumberCss3}>
                      {data?.secondNoFinish}
                    </span>
                    <span className={titleTextCss}>{t('mine.needDeal')}</span>
                  </ChartsItem>
                  <ChartsItem style={{ width: '20%' }}>
                    <span className={titleNumberCss2}>
                      {data?.secondTimeOut}
                    </span>
                    <span className={titleTextCss}>{t('mine.overdue')}</span>
                  </ChartsItem>
                  <ChartsItem style={{ width: '20%' }}>
                    <span className={titleNumberCss}>{data?.secondFinish}</span>
                    <span className={titleTextCss}>{t('mine.finishOn')}</span>
                  </ChartsItem>
                  <ChartsItem style={{ width: '20%' }}>
                    <span className={titleNumberCss2}>
                      {data?.secondOutFinish}
                    </span>
                    <span className={titleTextCss}>{t('mine.finishOver')}</span>
                  </ChartsItem>
                </InnerWrap>
              </div>
            </Head>
            <Center>
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
          </StyledWrap>
          <GatteWrap>
            <div style={{ padding: '28px 0px 0' }}>
              <SecondTitle>{t('newlyAdd.hisGantt')}</SecondTitle>
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
            {gatteData.length >= 1 && <Mygante data={gatteData} height={380} />}
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
        </Wrap>
      )}
    </>
  )
}

export default Profile
