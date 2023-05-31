/* eslint-disable @typescript-eslint/no-unused-vars */
// 我的模块-我的概况

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { ChartsItem, HiddenText, SecondTitle } from '@/components/StyleCommon'
import { Select, Timeline, message } from 'antd'
import Gantt from '@/components/Gantt'
import moment from 'moment'
import IconFont from '@/components/IconFont'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import { encryptPhp } from '@/tools/cryptoPhp'
import { OmitText } from '@star-yun/ui'
import useSetTitle from '@/hooks/useSetTitle'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateCreate } from '@store/mine'
import {
  getMineChartsList,
  getMineGatte,
  getProjectCharts,
  getUserFeedList,
} from '@/services/mine'
import PaginationBox from '@/components/TablePagination'
import { useNavigate } from 'react-router-dom'
import { getMessage } from '@/components/Message'
import LineAnimation from '../components/LineAnimation'
import CommonIconFont from '@/components/CommonIconFont'

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

  display: flex;
  gap: 17px;
`
const FullScreenDiv = styled.div<{ isScreen: boolean }>`
  ${props =>
    props.isScreen
      ? `
  position: fixed;
width: 100vw;
height: 100vh;
background: white;
left: 0;
top: 0;
z-index: 999999999999999;
`
      : ''}
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
  padding: 0 24px;
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
  display: flex;
  justify-content: space-around;
  box-sizing: border-box;
  padding: 26px 24px 26px 24px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.06);
`

const TimeLineWrap = styled.div`
  border-radius: 6px;
  box-sizing: border-box;
  padding: 10px 0 10px 10px;
  margin-top: 16px;
  /* overflow-y: scroll; */
  /* overflow-x: hidden; */
  height: 320px;
  padding-top: 25px;
  padding-left: 16px;
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
const Profile = () => {
  const asyncSetTtile = useSetTitle()
  const [t, i18n] = useTranslation()
  asyncSetTtile(t('title.a9'))

  const dispatch = useDispatch()

  const { isUpdateCreate } = useSelector(store => store.mine)
  const [data, setData] = useState<any>({})
  const [isScreen, setIsScreen] = useState<boolean>(false)
  const [nowYear, setNowYear] = useState<any>(2023)
  const [chartData, setChartData] = useState<any>([])
  const [nowYearOptions, setNowYearOptions] = useState<any>()
  const [gatteData, setGatteData] = useState<any>([])
  const [lineData, setLineData] = useState<any>([])
  const [monthIndex, setMonthIndex] = useState<any>(moment().month())
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [total, setTotal] = useState<number>(0)
  const navigate = useNavigate()
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
      page: pageObj.page,
      pagesize: pageObj.size,
    })

    setGatteData(
      // eslint-disable-next-line complexity
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
    const res1 = await getUserFeedList({
      limit: '',
    })

    setLineData(res1.data)
    dispatch(setIsUpdateCreate(false))
  }

  const init = async () => {
    const res = await getMineChartsList()
    setData(res)
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
    const res = await getProjectCharts(nowYear)

    setNowYearOptions(res.data.years)

    console.log(trans(res.data.list), '---')

    setChartData(trans(res.data.list))
  }

  useEffect(() => {
    getFeedList()
  }, [isUpdateCreate])

  useEffect(() => {
    getYearList()
  }, [nowYear])

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
    if (item.feedable.deleted_at || item.feedable.project.deleted_at) {
      getMessage({ msg: t('common.demandDeleteEd'), type: 'warning' })
      return
    }

    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.feedable.project_id,
        demandId: item.feedable_id,
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
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
    setNowYear(value)
  }
  if (!loadingState) {
    return <Loading />
  }
  return (
    <>
      <div>
        <Head>
          <div>
            {/* <SecondTitle>{t('mine.basicSurvey')}</SecondTitle> */}
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
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.secondAll}</span>
                <span className={titleTextCss}>{t('mine.total')}</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss3}>{data?.secondNoFinish}</span>
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
                <span className={titleNumberCss2}>{data?.secondOutFinish}</span>
                <span className={titleTextCss}>{t('mine.finishOver')}</span>
              </ChartsItem>
            </InnerWrap>
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
            <SecondTitle>{t('mine.mineNews')}</SecondTitle>
            {lineData.length < 1 ? (
              <NoData />
            ) : (
              <TimeLineWrap>
                <Timeline
                  style={{
                    overflowY: 'scroll',
                    height: '367px',
                    overflowX: 'hidden',
                    padding: '10px 10px 0 0',
                  }}
                >
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
                                color: 'var(--primary-d1)',
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
      </div>
      <FullScreenDiv isScreen={isScreen}>
        <GatteWrap>
          <div style={{ padding: '28px 24px 0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <SecondTitle>{t('mine.demandGatt')}</SecondTitle>
              <div
                onClick={() => setIsScreen(!isScreen)}
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
                  type={isScreen ? 'fewer-screen' : 'full-screen'}
                />
                <span>{isScreen ? '退出全屏' : '全屏'}</span>
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
            <Mygante data={gatteData} minHeight={380} />
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
            pageSize={pageObj.size}
            currentPage={pageObj.page}
            onChange={onChangePage}
          />
        )}
      </FullScreenDiv>
    </>
  )
}

export default Profile
