/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { useModel } from '@/models'
import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import {
  ChartsItem,
  HiddenText,
  PaginationWrap,
  SecondTitle,
} from '@/components/StyleCommon'
import { Timeline, message, Pagination, Tooltip } from 'antd'
import Gantt from '@/components/Gantt'
import PermissionWrap from '@/components/PermissionWrap'
import moment from 'moment'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { openDetail } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'

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
  flex: 8;
`
const Center = styled.div`
  display: flex;
  flex: 7;
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
  overflow-x: hidden;
  height: 300px;
`
const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #646566;
`
const GatteWrap = styled.div`
  background: white;
  box-sizing: border-box;
  margin: 0 16px;
  border-radius: 6px;
`
const Profile = () => {
  const [t, i18n] = useTranslation()
  const {
    getMineChartsList,
    getUserFeedList,
    getMineGatte,
    isUpdateCreate,
    setIsUpdateCreate,
  } = useModel('mine')
  const { userInfo } = useModel('user')
  const { colorList } = useModel('project')
  const [data, setData] = useState<any>({})
  const [gatteData, setGatteData] = useState<any>([])
  const [lineData, setLineData] = useState<any>([])
  const [monthIndex, setMonthIndex] = useState<any>(moment().month())
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(20)
  const [total, setTotal] = useState<number>()
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const changeMonth = async () => {
    const res2 = await getMineGatte({
      startTime: moment()
        .startOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment()
        .endOf('month')
        .month(monthIndex)
        .format('YYYY-MM-DD 23:59:59'),
      page,
      pagesize,
    })

    setGatteData(
      res2.list?.map((k: any) => ({
        id: k.id,
        demandText: k.text,
        text: `<div style="display: flex; align-items: center">
          <span style="height: 20px; line-height: 20px; font-size:12px; padding: 2px 8px; border-radius: 10px; color: ${
            k.categoryColor
          }; background: ${
          colorList?.filter((i: any) => i.key === k.categoryColor)[0]?.bgColor
        }">${k.categoryName}</span>
          <span style="display:inline-block; width: 100px ;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;margin-left: 8px">${
            k.text
          }</span>
        </div>`,
        start_date: k.start_date,
        end_date: k.end_date,
        statusName: `<span style="display: inline-block;white-space: nowrap;text-overflow: ellipsis;max-width: 110px;overflow: hidden; height: 20px; line-height: 16px; font-size:12px; padding: 2px 8px; border-radius: 6px; color: ${k.statusColor}; border: 1px solid ${k.statusColor}">${k.statusName}</span>`,
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
    const res1 = await getUserFeedList({
      limit: '',
    })

    setLineData(res1.data)
    setIsUpdateCreate(false)
  }

  const init = async () => {
    const res = await getMineChartsList()

    setData(res)
    getFeedList()
  }

  useEffect(() => {
    getFeedList()
  }, [isUpdateCreate])

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

    return i18n.language === 'zh'
      ? `${newDate[0]}年${newDate[1]}月`
      : `${newDate[0]} - ${newDate[1]}`
  }, [monthIndex])

  const onToDetail = (item: any) => {
    if (item.feedable.deleted_at || item.feedable.project.deleted_at) {
      message.warning(t('common.demandDeleteEd'))
      return
    }

    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.feedable.project_id,
        demandId: item.feedable_id,
      }),
    )

    openDetail(`/Detail/Demand?data=${params}`)
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
  if (!loadingState) {
    return <Loading />
  }
  return (
    <PermissionWrap
      auth="b/user/overview"
      permission={userInfo?.company_permissions}
    >
      <StyledWrap>
        <Head>
          <div>
            <SecondTitle>{t('mine.basicSurvey')}</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstP}</span>
                <span className={titleTextCss}>{t('mine.totalProject')}</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstN}</span>
                <span className={titleTextCss}>{t('mine.totalDemand')}</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.firstD}</span>
                <span className={titleTextCss}>{t('mine.totalIterate')}</span>
              </ChartsItem>
            </InnerWrap>
          </div>
          <div>
            <SecondTitle> {t('mine.backLog')}</SecondTitle>
            <InnerWrap>
              <ChartsItem style={{ width: '20%' }}>
                <span className={titleNumberCss3}>{data?.secondAll}</span>
                <span className={titleTextCss}>{t('mine.total')}</span>
              </ChartsItem>
              <ChartsItem style={{ width: '20%' }}>
                <span className={titleNumberCss3}>{data?.secondNoFinish}</span>
                <span className={titleTextCss}>{t('mine.needDeal')}</span>
              </ChartsItem>
              <ChartsItem style={{ width: '20%' }}>
                <span className={titleNumberCss2}>{data?.secondTimeOut}</span>
                <span className={titleTextCss}>{t('mine.overdue')}</span>
              </ChartsItem>
              <ChartsItem style={{ width: '20%' }}>
                <span className={titleNumberCss}>{data?.secondFinish}</span>
                <span className={titleTextCss}>{t('mine.finishOn')}</span>
              </ChartsItem>
              <ChartsItem style={{ width: '20%' }}>
                <span className={titleNumberCss2}>{data?.secondOutFinish}</span>
                <span className={titleTextCss}>{t('mine.finishOver')}</span>
              </ChartsItem>
            </InnerWrap>
          </div>
        </Head>
        <Center>
          <CenterRight>
            <SecondTitle>{t('mine.mineNews')}</SecondTitle>
            {lineData.length < 1 ? (
              <NoData />
            ) : (
              <TimeLineWrap>
                <Timeline>
                  {lineData.map((item: any) => (
                    <Timeline.Item key={item.id}>
                      <LineItem>
                        <span>{item.created_at}</span>
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
                            {item.feedable?.project.name}
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
                                color: 'rgba(40, 119, 255, 1)',
                                cursor: 'pointer',
                              }}
                            >
                              {item.feedable?.name}
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
        <div style={{ padding: '28px 24px 0' }}>
          <SecondTitle>{t('mine.demandGatt')}</SecondTitle>
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
        {gatteData.length >= 1 && <Mygante data={gatteData} minHeight={380} />}
        {gatteData.length < 1 && (
          <div style={{ height: 'calc(100vh - 508px)' }}>
            <NoData />
          </div>
        )}
      </GatteWrap>

      {gatteData.length >= 1 && (
        <PaginationWrap>
          <Pagination
            defaultCurrent={1}
            current={page}
            pageSize={pagesize}
            showSizeChanger
            showQuickJumper
            total={total}
            showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      )}
    </PermissionWrap>
  )
}

export default Profile
