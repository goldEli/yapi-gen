import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  CanClick,
  ItemWrap,
  LoadingMore,
  SpinWrap,
  TaskItem,
  TimeName,
} from './style'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getVerifyUserListHeader } from '@/services/mine'
import _ from 'lodash'
import { Skeleton } from 'antd'
import NoData from '@/components/NoData'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { encryptPhp } from '@/tools/cryptoPhp'
import moment from 'moment'
import { setIsUpdateAddWorkItem } from '@store/project'
import EditExamine from '@/components/EditExamine'
import { setIsNewMsg } from '@store/mine'
import NewNoData from '@/components/NewNoData'
const GroupItems = (props: any) => {
  const { row, onOpenExamine, onClickItem, tabActive } = props
  const [page, setPage] = useState(1)
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
          <CanClick onClick={() => onOpenExamine(i)}>
            {t('newlyAdd.waitExamine')}
          </CanClick>
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
  // 审核详情打开
  const [isExamineVisible, setIsExamineVisible] = useState(false)
  // 审核数据
  const [verifyInfo, setVerifyInfo] = useState<any>({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [dataList, setDataList] = useState<any>({})
  const { isNewMsg } = useSelector(store => store.mine)
  // 待办
  const onGetMineNoFinishList = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const res = await getVerifyUserListHeader({
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
    setVerifyInfo(item)
    setIsExamineVisible(true)
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
      {isExamineVisible ? (
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
          onUpdate={() => {
            onGetMineNoFinishList(true, 1)
            dispatch(setIsNewMsg(isNewMsg + 1))
          }}
        />
      ) : null}
      <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <div
          id="scrollableDiv"
          style={{ height: 'calc(100vh - 168px)', overflow: 'auto' }}
        >
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
            dataList.list?.length <= 0) && (
            <NewNoData
              text="来自任务的审核消息都会收集在「待我审核任务」里面"
              url="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702636955304/%E5%AE%A1%E6%A0%B8.png"
            ></NewNoData>
          )}
        </div>
      </SpinWrap>
    </div>
  )
}

export default ReviewTask
