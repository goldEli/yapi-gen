/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
import { Skeleton, Spin, Tooltip } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import {
  HeaderWrap,
  QuickPopover,
  TabsWrap,
  TabsWrapItem,
  ActiveTab,
  Border,
  Footer,
  ContentWrap,
  TaskItem,
  StatusBox,
  SpinWrap,
  TimeName,
  ItemWrap,
  ProjectItem,
  ProjectTypeBox,
  ReportItem,
} from '../style'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  getRecentProject,
  getRecentStory,
  getReportViewLogList,
} from '@/services/project'
import moment from 'moment'
import _ from 'lodash'
import { encryptPhp } from '@/tools/cryptoPhp'
import { saveViewReportDetailDrawer } from '@store/workReport/workReport.thunk'
import { setDemandInfo } from '@store/demand'
import { setFlawInfo } from '@store/flaw'
import { setAffairsInfo } from '@store/affairs'

interface GroupItemsProps {
  row: any
  onClickTask(item: any): void
  onClickProject(item: any): void
  onClickReport(item: any): void
  tabActive: number
}

const GroupItems = (props: GroupItemsProps) => {
  const { row, onClickTask, onClickProject, onClickReport, tabActive } = props
  const [t] = useTranslation()
  const { language } = useSelector(store => store.global)

  return (
    <>
      {row?.map((i: any) => (
        <div key={i.id}>
          {tabActive === 2 && (
            <TaskItem>
              <div className="left" onClick={() => onClickTask(i)}>
                <img
                  className="icon"
                  src={i.actionable?.project_category?.attachment?.path}
                />
                <div className="info">
                  <span className="name">{i.actionable?.name}</span>
                  <span className="sub">{i.actionable?.project?.name}</span>
                </div>
              </div>
              <StatusBox
                style={{
                  background:
                    i.actionable?.category_status?.is_start === 1 &&
                    i.actionable?.category_status?.is_end === 2
                      ? 'var(--primary-d2)'
                      : i.actionable?.category_status?.is_end === 1 &&
                        i.actionable?.category_status?.is_start === 2
                      ? 'var(--neutral-n7)'
                      : i.actionable?.category_status?.is_start === 2 &&
                        i.actionable?.category_status?.is_end === 2
                      ? 'var(--function-success)'
                      : '',
                  color:
                    i.actionable?.category_status?.is_start === 1 &&
                    i.actionable?.category_status?.is_end === 2
                      ? 'var(--neutral-n7)'
                      : i.actionable?.category_status?.is_end === 1 &&
                        i.actionable?.category_status?.is_start === 2
                      ? 'var(--neutral-n1-d1)'
                      : i.actionable?.category_status?.is_start === 2 &&
                        i.actionable?.category_status?.is_end === 2
                      ? 'var(--neutral-n7)'
                      : '',
                }}
              >
                <Tooltip title={i.actionable?.category_status?.status?.content}>
                  {i.actionable?.category_status?.status?.content}
                </Tooltip>
              </StatusBox>
            </TaskItem>
          )}
          {tabActive === 1 && (
            <ProjectItem
              key={i.id}
              local={language}
              style={{ alignItems: 'center' }}
            >
              <div
                className="left"
                onClick={() => onClickProject(i)}
                style={{ alignItems: 'center' }}
              >
                <img className="icon" src={i.actionable?.attachment?.path} />
                <div className="info">
                  <span className="name">{i.actionable?.name}</span>
                </div>
              </div>
              <ProjectTypeBox type={i.actionable?.project_type}>
                {i.actionable?.project_type === 1
                  ? t('iteration')
                  : t('sprint2')}
              </ProjectTypeBox>
            </ProjectItem>
          )}
          {tabActive === 0 && (
            <ReportItem key={i.id}>
              <div className="left" onClick={() => onClickReport(i)}>
                <CommonUserAvatar avatar={i?.user?.avatar} size="large" />
                <div className="info">
                  <span className="name">{i?.user?.name || '--'}</span>
                  <span className="sub">
                    {i.type === 3 ? t('container.project') : t('personal')}
                    {t('daily')} 【{i?.project?.name ?? '--'}】
                  </span>
                </div>
              </div>
              <div className="right">{moment(i?.date).format('MM-DD')}</div>
            </ReportItem>
          )}
        </div>
      ))}
    </>
  )
}

interface RecentlyProps {
  isVisible: boolean
  onClose(): void
}

const Recently = (props: RecentlyProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive2 = useRef<HTMLDivElement>(null)
  const [dataList, setDataList] = useState<any>({})
  const [dataList1, setDataList1] = useState<any>({})
  const [dataList2, setDataList2] = useState<any>({})
  const { isRefresh } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)

  //   加载状态
  const [isSpinning, setIsSpinning] = useState(false)
  //   当前选中的是那个tab
  const [tabActive, setTabActive] = useState(0)

  //   tab列表
  const tabs = [
    {
      label: t('daily'),
    },
    {
      label: t('container.project'),
    },
    {
      label: t('task'),
    },
  ]

  const addMore = (oldData: any, newData: any) => {
    Object.keys(newData).forEach((i: string) => {
      if (Object.keys(oldData).includes(i)) {
        const temp = [...oldData[i], ...newData[i]]
        oldData[i] = temp
      } else {
        oldData[i] = newData[i]
      }
    })
  }

  // 获取汇报列表
  const getReportData = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const result = await getReportViewLogList({
      page,
      pagesize: 15,
    }).finally(() => {
      setIsSpinning(false)
    })
    if (isInit) {
      setDataList(result.data)
    } else {
      const oldData = _.cloneDeep(dataList.list)
      const newData = _.cloneDeep(result.data.list)
      addMore(oldData, newData)
      setDataList({
        pager: result.data.pager,
        list: oldData,
      })
    }
  }

  // 获取项目列表
  const getProjectData = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const result = await getRecentProject({
      page,
      pagesize: 15,
    }).finally(() => {
      setIsSpinning(false)
    })
    if (isInit) {
      setDataList1(result.data)
    } else {
      const oldData = _.cloneDeep(dataList1.list)
      const newData = _.cloneDeep(result.data.list)
      addMore(oldData, newData)
      setDataList1({
        pager: result.data.pager,
        list: oldData,
      })
    }
  }

  // 获取任务列表
  const getTaskData = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const result = await getRecentStory({
      page,
      pagesize: 15,
    }).finally(() => {
      setIsSpinning(false)
    })
    if (isInit) {
      setDataList2(result.data)
    } else {
      const oldData = _.cloneDeep(dataList2.list)
      const newData = _.cloneDeep(result.data.list)
      addMore(oldData, newData)
      setDataList2({
        pager: result.data.pager,
        list: oldData,
      })
    }
  }

  //   获取数据
  const getData = () => {
    setDataList({})
    setDataList1({})
    setDataList2({})
    switch (tabActive) {
      case 2:
        getTaskData(true, 1)
        break
      case 1:
        getProjectData(true, 1)
        break
      case 0:
        getReportData(true, 1)
        break
      default:
        break
    }
  }

  //   点击底部跳转
  const onFooterClick = () => {
    props.onClose()
    switch (tabActive) {
      case 0:
        // 跳转日报
        navigate('/Mine/Profile')
        break
      default:
        // 跳转项目
        navigate('/Project')
        break
    }
  }

  const fetchMoreData = () => {
    const pages = page + 1
    setPage(pages)
    switch (tabActive) {
      case 2:
        getTaskData(false, pages)
        break
      case 1:
        getProjectData(false, pages)
        break
      case 0:
        getReportData(false, pages)
        break
    }
  }

  // 任务-点击跳转详情
  const onClickTask = async (row: any) => {
    props.onClose()
    const params = encryptPhp(
      JSON.stringify({
        id: row?.actionable.project_id,
        type: row?.actionable.project_type === 2 ? 'sprint' : 'iteration',
        isOpenScreenDetail: true,
        detailId: row?.actionable?.id,
        specialType:
          row?.actionable.project_type === 2
            ? 1
            : row?.actionable.project_type === 1 && row?.actionable.is_bug === 1
            ? 2
            : 3,
      }),
    )

    navigate(
      `${
        row.defaultHomeMenu
          ? row.defaultHomeMenu
          : `/ProjectDetail/${
              row?.actionable.project_type === 2
                ? 'Affair'
                : row?.actionable.is_bug === 2
                ? 'Demand'
                : 'Defect'
            }`
      }?data=${params}`,
    )
  }

  // 项目-点击跳转详情
  const onClickProject = async (row: any) => {
    props.onClose()
    const params = encryptPhp(
      JSON.stringify({
        id: row?.actionable.id,
        type: row?.actionable.project_type === 2 ? 'sprint' : 'iteration',
      }),
    )

    navigate(
      `${
        row.defaultHomeMenu
          ? row.defaultHomeMenu
          : `/ProjectDetail/${
              row?.actionable.project_type === 2 ? 'Affair' : 'Demand'
            }`
      }?data=${params}`,
    )
  }

  // 日报-点击跳转详情
  const onClickReport = async (item: any) => {
    props.onClose()
    navigate('/Report/Review/List/1')
    dispatch(
      saveViewReportDetailDrawer({
        visible: true,
        id: item.report_user_id,
        type: item.type,
      }),
    )
  }

  // 计算时间显示
  const onComputedTime = (time: string) => {
    if (moment(time).isSame(moment().startOf('day'), 'day')) {
      return t('today')
    } else if (
      moment(time).isSame(moment().subtract(1, 'days').startOf('day'), 'day')
    ) {
      return t('yesterday')
    }
    return time
  }

  // 点击tab切换
  const onChangeTabActive = (index: number) => {
    if (index === tabActive) return
    setTabActive(index)
  }

  useEffect(() => {
    setPage(1)
    props.isVisible && getData()
  }, [props.isVisible, tabActive])

  useEffect(() => {
    if (!props.isVisible) {
      return
    }
    for (let i = 0; i < 3; i++) {
      tabBox.current?.children[i].addEventListener('click', e => {
        if (tabActive2.current) {
          tabActive2.current.style.left = `${
            (tabBox.current?.children[i] as HTMLDivElement).offsetLeft
          }px`
          tabActive2.current.style.width = `${tabBox.current?.children[i].clientWidth}px`
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!tabBox.current) {
      return
    }
    const index = tabs.findIndex((i: any, index2) => index2 === tabActive)

    tabActive2.current!.style.left = `${
      (tabBox.current?.children[index] as HTMLDivElement).offsetLeft === 0
        ? 2
        : (tabBox.current?.children[index] as HTMLDivElement).offsetLeft
    }px`
    tabActive2.current!.style.width = `${
      tabBox.current?.children[index].clientWidth === 0
        ? 60
        : tabBox.current?.children[index].clientWidth
    }px`
  }, [tabActive, isRefresh])

  useEffect(() => {
    if (props.isVisible) {
      setTabActive(0)
      setDataList({})
    }
    setTimeout(() => {
      if (tabActive2.current && props.isVisible) {
        tabActive2.current.style.left = `${
          (tabBox.current?.children[0] as HTMLDivElement).offsetLeft
        }px`
        tabActive2.current.style.width = `${tabBox.current?.children[0].clientWidth}px`
      }
    }, 500)
  }, [props.isVisible, isRefresh])

  const hasMore = useMemo(() => {
    if (!dataList.list) {
      return false
    }
    const allTask = Object.values(dataList.list).flat(2)
    if (allTask.length < dataList.pager.total) {
      return true
    }
    return false
  }, [dataList])

  const hasMore1 = useMemo(() => {
    if (!dataList1.list) {
      return false
    }
    const allTask = Object.values(dataList1.list).flat(2)
    if (allTask.length < dataList1.pager.total) {
      return true
    }
    return false
  }, [dataList1])

  const hasMore2 = useMemo(() => {
    if (!dataList2.list) {
      return false
    }
    const allTask = Object.values(dataList2.list).flat(2)
    if (allTask.length < dataList2.pager.total) {
      return true
    }
    return false
  }, [dataList2])

  // 1是数据，2是更多
  const onComputedTab = (type: number) => {
    let result: any
    if (tabActive === 1) {
      result = type === 1 ? dataList1?.list : hasMore1
    } else if (tabActive === 2) {
      result = type === 1 ? dataList2?.list : hasMore2
    } else {
      result = type === 1 ? dataList?.list : hasMore
    }
    return result
  }

  return (
    <QuickPopover local={language}>
      <HeaderWrap>
        <TabsWrap ref={tabBox}>
          {tabs.map((i: any, index) => (
            <TabsWrapItem
              onClick={() => onChangeTabActive(index)}
              active={tabActive === index}
              key={i.label}
            >
              {i.label}
            </TabsWrapItem>
          ))}
          <ActiveTab ref={tabActive2} />
        </TabsWrap>
      </HeaderWrap>
      <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <ContentWrap id="scrollableDiv">
          <InfiniteScroll
            dataLength={
              onComputedTab(1)
                ? Object.values(onComputedTab(1)).flat(2).length
                : 0
            }
            next={fetchMoreData}
            hasMore={onComputedTab(2)}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
          >
            {onComputedTab(1) &&
              Object.keys(onComputedTab(1))?.map((k: any) => (
                <ItemWrap key={k}>
                  <TimeName>{onComputedTime(k)}</TimeName>
                  <GroupItems
                    row={onComputedTab(1)?.[k]}
                    onClickTask={onClickTask}
                    onClickProject={onClickProject}
                    onClickReport={onClickReport}
                    tabActive={tabActive}
                  />
                </ItemWrap>
              ))}
          </InfiniteScroll>
          {(JSON.stringify(onComputedTab(1)) === '{}' ||
            onComputedTab(1)?.length <= 0) && <NoData />}
        </ContentWrap>
      </Spin>
      <Border />
      <Footer onClick={onFooterClick}>
        {tabActive === 0 ? t('viewAllReport') : t('viewAllProject')}
      </Footer>
    </QuickPopover>
  )
}

export default Recently
