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
  LoadingMore,
} from '../style'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import {
  getRecentProject,
  getRecentStory,
  getReportViewLogList,
} from '@/services/project'
import moment from 'moment'

interface GroupItemsProps {
  row: any
  onClickTask(item: any): void
  onClickProject(item: any): void
  onClickReport(item: any): void
  tabActive: number
  onChangeData(list: any, key: string): void
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
                  <span className="name">{i?.user?.name}</span>
                  <span className="sub">
                    {i.project ? '项目' : '个人'}日报 {i?.project?.name ?? ''}
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
  const [page, setPage] = useState(1)
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive2 = useRef<HTMLDivElement>(null)
  const [dataList, setDataList] = useState<any>({})
  const { isRefresh, userInfo } = useSelector(store => store.user)
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

  // 获取汇报列表
  const getReportData = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const result = await getReportViewLogList({
      page,
      pagesize: 15,
    }).finally(() => {
      setIsSpinning(false)
    })
    setDataList(result.data)
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
    setDataList(result.data)
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
    setDataList(result.data)
  }

  //   获取数据
  const getData = () => {
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
        break
      default:
        // 跳转项目
        break
    }
  }

  const fetchMoreData = () => {
    console.log('xxxxxxxxx')
  }

  // 任务-点击跳转详情
  const onClickTask = async (item: any) => {
    //
  }

  // 项目-点击跳转详情
  const onClickProject = async (item: any) => {
    //
  }

  // 日报-点击跳转详情
  const onClickReport = async (item: any) => {
    //
  }

  // 更多数据合并
  const onChangeData = (list: any, key: string) => {
    //
  }

  useEffect(() => {
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

  return (
    <QuickPopover local={language}>
      <HeaderWrap>
        <TabsWrap ref={tabBox}>
          {tabs.map((i: any, index) => (
            <TabsWrapItem
              onClick={() => setTabActive(index)}
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
              dataList.list ? Object.values(dataList.list).flat(2).length : 0
            }
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
          >
            {dataList.list &&
              Object.keys(dataList.list)?.map((k: any) => (
                <ItemWrap key={k}>
                  <TimeName>{k}</TimeName>
                  <GroupItems
                    row={dataList.list[k]}
                    onClickTask={onClickTask}
                    onClickProject={onClickProject}
                    onClickReport={onClickReport}
                    tabActive={tabActive}
                    onChangeData={onChangeData}
                  />
                </ItemWrap>
              ))}
          </InfiniteScroll>
        </ContentWrap>
      </Spin>
      <Border />
      <Footer onClick={onFooterClick}>
        {tabActive === 0 ? '查看所有日报' : '查看所有项目'}
      </Footer>
    </QuickPopover>
  )
}

export default Recently
