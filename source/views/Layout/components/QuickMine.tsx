/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
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
  CanClick,
  StatusBox,
  SpinWrap,
  TimeName,
  ItemWrap,
  LoadingMore,
} from '../style'
import {
  getMineFinishListHeader,
  getMineNoFinishListHeader,
  getVerifyUserListHeader,
} from '@/services/mine'
import EditExamine from '@/components/EditExamine'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import NoData from '@/components/NoData'
import { Skeleton } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setIsUpdateAddWorkItem } from '@store/project'

interface GroupItemsProps {
  row: any
  onOpenExamine(item: any): void
  onClickItem(item: any): void
  tabActive: number
}

const GroupItems = (props: GroupItemsProps) => {
  const { row, onOpenExamine, onClickItem, tabActive } = props
  const [t] = useTranslation()
  const [page, setPage] = useState(1)
  // 加载更多的loading
  const [moreLoading, setMoreLoading] = useState(false)

  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    // 调用更多接口
    setPage(page + 1)
    setMoreLoading(false)
  }

  useEffect(() => {
    setPage(1)
  }, [tabActive])

  return (
    <>
      {row?.map((i: any) => (
        <TaskItem key={i.id}>
          <div className="left" onClick={() => onClickItem(i)}>
            <img className="icon" src={i?.project_category?.attachment?.path} />
            <div className="info">
              <span className="name">{i?.name}</span>
              <span className="sub">{i?.project?.name}</span>
            </div>
          </div>
          {tabActive === 1 ? (
            <CanClick onClick={() => onOpenExamine(i)}>
              {t('newlyAdd.waitExamine')}
            </CanClick>
          ) : (
            <StatusBox
              style={{
                background:
                  i.category_status?.is_start === 1 &&
                  i.category_status?.is_end === 2
                    ? 'var(--primary-d2)'
                    : i.category_status?.is_end === 1 &&
                      i.category_status?.is_start === 2
                    ? 'var(--neutral-n7)'
                    : i.category_status?.is_start === 2 &&
                      i.category_status?.is_end === 2
                    ? 'var(--function-success)'
                    : '',
              }}
            >
              {i.category_status?.status?.content}
            </StatusBox>
          )}
        </TaskItem>
      ))}
      {page * 30 < row?.pager?.total && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading && (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          )}
          {t('loadMore')}
        </LoadingMore>
      )}
    </>
  )
}

interface QuickMineProps {
  isVisible: boolean
  onClose(): void
}

const QuickMine = (props: QuickMineProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive2 = useRef<HTMLDivElement>(null)
  const { isRefresh, userInfo } = useSelector(store => store.user)
  const { language } = useSelector(store => store.global)

  // 审核详情打开
  const [isExamineVisible, setIsExamineVisible] = useState(false)
  //   加载状态
  const [isSpinning, setIsSpinning] = useState(false)
  //   当前选中的是那个tab
  const [tabActive, setTabActive] = useState(0)
  // 审核列表
  const [dataList, setDataList] = useState<any>({})

  const [dataList1, setDataList1] = useState<any>({})
  const [dataList2, setDataList2] = useState<any>({})

  // 审核数据
  const [verifyInfo, setVerifyInfo] = useState<any>({})

  const [page, setPage] = useState(1)
  //   tab列表
  const tabs = [
    {
      label: t('mine.needDeal'),
    },
    {
      label: t('pendingReview'),
    },
    {
      label: t('have_done'),
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
  // 已办
  const onGetMineFinishList = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const res = await getMineFinishListHeader({
      page: page,
      pagesize: 15,
    })
    if (isInit) {
      setDataList2(res)
    } else {
      const oldData = _.cloneDeep(dataList2.list)
      const newData = _.cloneDeep(res.list)
      addMore(oldData, newData)
      setDataList2({
        pager: res.pager,
        list: oldData,
      })
    }
    setIsSpinning(false)
  }

  // 待办
  const onGetMineNoFinishList = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const res = await getMineNoFinishListHeader({
      page: page,
      pagesize: 15,
    })
    if (isInit) {
      setDataList(res)
    } else {
      const oldData = _.cloneDeep(dataList.list)
      const newData = _.cloneDeep(res.list)
      addMore(oldData, newData)
      setDataList({
        pager: res.pager,
        list: oldData,
      })
    }
    setIsSpinning(false)
  }

  // 获取待审核的列表
  const getVerifyList = async (isInit?: boolean, page?: number) => {
    setIsSpinning(true)
    const params = {
      page: page,
      pagesize: 15,
    }
    const res = await getVerifyUserListHeader(params)
    setIsSpinning(false)

    if (isInit) {
      setDataList1(res)
    } else {
      const oldData = _.cloneDeep(dataList1.list)
      const newData = _.cloneDeep(res.list)
      addMore(oldData, newData)
      setDataList1({
        pager: res.pager,
        list: oldData,
      })
    }
  }

  //   获取数据 tabActive 0 待办 1 待审核 2 已办理
  const getData = () => {
    setDataList({})
    setDataList1({})
    setDataList2({})
    switch (tabActive) {
      case 2:
        onGetMineFinishList(true, 1)
        break
      case 1:
        // 待审核
        getVerifyList(true, 1)
        break

      default:
        onGetMineNoFinishList(true, 1)
        break
    }
  }
  //  tabActive 0 待办 1 待审核 2 已办理
  const fetchMoreData = () => {
    const pages = page + 1
    setPage(pages)
    switch (tabActive) {
      case 2:
        onGetMineFinishList(false, pages)
        break
      case 1:
        getVerifyList(false, pages)
        break
      case 0:
        onGetMineNoFinishList(false, pages)
        break
    }
  }
  //   跳转到我的
  const onToMine = () => {
    props.onClose()
    navigate(
      `/Mine/${
        tabActive === 0 ? 'Carbon' : tabActive === 1 ? 'Examine' : 'Finished'
      }`,
    )
  }

  // 点击跳转详情
  const onClickItem = async (row: any) => {
    props.onClose()
    dispatch(setIsUpdateAddWorkItem(0))
    const params = encryptPhp(
      JSON.stringify({
        id: row.project_id,
        type: row.project_type === 2 ? 'sprint' : 'iteration',
        isOpenScreenDetail: true,
        detailId: row?.id,
        specialType:
          row.project_type === 2
            ? 1
            : row.project_type === 1 && row.is_bug === 1
            ? 2
            : 3,
      }),
    )

    setTimeout(() => {
      navigate(
        `${
          row.defaultHomeMenu
            ? row.defaultHomeMenu
            : `/ProjectDetail/${
                row.project_type === 2
                  ? 'Affair'
                  : row.is_bug === 2
                  ? 'Demand'
                  : 'Defect'
              }`
        }?data=${params}`,
      )
    }, 2)
  }

  // 点击打开审核弹窗
  const onOpenExamine = (item: any) => {
    props.onClose()
    setVerifyInfo(item)
    setIsExamineVisible(true)
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
    <>
      {isExamineVisible && (
        <EditExamine
          isVisible={isExamineVisible}
          onClose={() => {
            setIsExamineVisible(false)
            setVerifyInfo({})
          }}
          item={{
            projectId: verifyInfo?.project_id,
            storyVerifyId: verifyInfo?.story_verify_id,
            id: verifyInfo?.id,
            status: verifyInfo?.verify_status,
          }}
          isEdit
          onUpdate={() => getVerifyList(true, 1)}
        />
      )}
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
        <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
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
                      onOpenExamine={onOpenExamine}
                      onClickItem={onClickItem}
                      tabActive={tabActive}
                    />
                  </ItemWrap>
                ))}
            </InfiniteScroll>
            {(JSON.stringify(onComputedTab(1)) === '{}' ||
              onComputedTab(1)?.length <= 0) && <NoData />}
          </ContentWrap>
        </SpinWrap>

        <Border />
        <Footer onClick={onToMine}>{t('Check_out_my_work')}</Footer>
      </QuickPopover>
    </>
  )
}

export default QuickMine
