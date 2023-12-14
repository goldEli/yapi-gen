import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  AssignTaskWrap,
  CanClick,
  ItemWrap,
  LoadingMore,
  SpinWrap,
  StatusBox,
  TaskItem,
  TimeName,
} from './style'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { Skeleton, Tooltip } from 'antd'
import NoData from '@/components/NoData'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { encryptPhp } from '@/tools/cryptoPhp'
import moment from 'moment'
import { getRecentStory } from '@/services/project'
import { setIsUpdateAddWorkItem } from '@store/project'
const GroupItems = (props: any) => {
  const { row, onOpenExamine, onClickItem, tabActive } = props
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  // 加载更多的loading
  const [moreLoading, setMoreLoading] = useState(false)
  const [t] = useTranslation()
  // 点击加载更多
  const onLoadingMore = async () => {
    setMoreLoading(true)
    // 调用更多接口
    setPage(page + 1)
    setMoreLoading(false)
  }
  // 任务-点击跳转详情
  const onClickTask = async (row: any) => {
    // props.onClose()
    // dispatch(setIsUpdateAddWorkItem(0))
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

    setTimeout(() => {
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
    }, 2)
  }

  return (
    <>
      {row?.map((i: any) => (
        <TaskItem key={i.id}>
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
            }}
          >
            <Tooltip title={i.actionable?.category_status?.status?.content}>
              {i.actionable?.category_status?.status?.content}
            </Tooltip>
          </StatusBox>
        </TaskItem>
      ))}
      {page * 30 < row?.pager?.total && (
        <LoadingMore onClick={onLoadingMore}>
          {moreLoading ? (
            <img
              width={16}
              style={{ marginRight: 4 }}
              src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/shareLoading.gif"
            />
          ) : null}
          {t('loadMore')}
        </LoadingMore>
      )}
    </>
  )
}

const ReviewTask = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [dataList, setDataList] = useState<any>({})
  // 待办
  const onGetMineNoFinishList = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const res = await getRecentStory({
      page: page,
      pagesize: 15,
    })
    if (isInit) {
      setDataList(res.data)
    } else {
      const oldData = _.cloneDeep(dataList.list)
      const newData = _.cloneDeep(res.data?.list)
      addMore(oldData, newData)
      setDataList({
        pager: res.data?.pager,
        list: oldData,
      })
    }
    setIsSpinning(false)
  }
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
  const fetchMoreData = () => {
    onGetMineNoFinishList(false, 1)
  }
  // 点击打开审核弹窗
  const onOpenExamine = (item: any) => {
    // setVerifyInfo(item)
    // setIsExamineVisible(true)
  }
  // 点击跳转详情
  const onClickItem = async (row: any) => {
    dispatch(setIsUpdateAddWorkItem(0))
    const params = encryptPhp(
      JSON.stringify({
        id: row.project_id,
        type: row.project_type === 2 ? 'sprint' : 'iteration',
        isOpenScreenDetail: true,
        detailId: row?.story_id,
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
  useEffect(() => {
    onGetMineNoFinishList(true, 1)
  }, [])
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
  // 1是数据，2是更多
  const onComputedTab = (type: number) => {
    const result = type === 1 ? dataList?.list : hasMore
    return result
  }
  return (
    <div>
      <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <AssignTaskWrap id="scrollableDiv">
          <InfiniteScroll
            dataLength={
              dataList.list ? Object.values(dataList.list).flat(2).length : 0
            }
            next={fetchMoreData}
            hasMore={onComputedTab(2)}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
          >
            {dataList.list
              ? Object.keys(dataList.list)?.map((k: any) => (
                  <ItemWrap key={k}>
                    <TimeName>{onComputedTime(k)}</TimeName>
                    <GroupItems
                      row={dataList.list?.[k]}
                      onOpenExamine={onOpenExamine}
                      onClickItem={onClickItem}
                      tabActive={1}
                    />
                  </ItemWrap>
                ))
              : null}
          </InfiniteScroll>
          {(JSON.stringify(dataList.list) === '{}' ||
            dataList.list?.length <= 0) && <NoData />}
        </AssignTaskWrap>
      </SpinWrap>
    </div>
  )
}

export default ReviewTask
