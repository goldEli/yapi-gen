import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import NoticeItem from '../NoticePopover/NoticeItem'
import { useEffect, useMemo, useState } from 'react'
import { setIsNewMsg } from '@store/mine'
import { useDispatch, useSelector } from '@store/index'
import NoData from '@/components/NoData'
import _ from 'lodash'
import { MyList, SpinWrap } from './style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { ContentList } from '../NoticePopover/style'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Skeleton } from 'antd'
import NewNoData from '@/components/NewNoData'
import { useTranslation } from 'react-i18next'
const MineNotice = () => {
  const [data, setData] = useState<any>()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { isNewMsg, msgStatics } = useSelector(store => store.mine)
  const [isSpinning, setIsSpinning] = useState(false)
  const [page, setPage] = useState(1)
  const { todoStatistics } = msgStatics
  const _getMsg_list = async (isInit: boolean, page: number) => {
    const res = await getMsg_list({
      business_type: 2,
      nowWhereReadAll: true,
      pageSize: 10,
      page: page,
    })
    // const data = res?.list
    const total = {
      total: res?.total,
    }
    if (isInit) {
      setData({
        pager: total,
        list: res?.list,
      })
    } else {
      const oldData = _.cloneDeep(data.list)
      const newData = _.cloneDeep(res.list)
      const total = {
        total: res?.total,
      }
      setData({
        pager: total,
        list: [...oldData, ...newData],
      })
    }
    // 只有未读消息才走这个逻辑
    if (res?.nowWhereReadAllNum) {
      setTimeout(() => {
        const newData = res?.list ?? []
        for (const iterator of newData) {
          if (parseInt(iterator.read, 10) === 0) {
            iterator.read = 1
            // 更新统计
            dispatch(setIsNewMsg(isNewMsg + 1))
          }
        }
        setData({
          pager: total,
          list: [...newData],
        })
      }, 6000)
    }
    // setData(data)
  }
  // 消息推送更新
  useEffect(() => {
    _getMsg_list(true, 1)
  }, [todoStatistics?.total])
  const setRead = async (index: number, msgIds: string) => {
    const newData = data.list
    const total = {
      total: data?.pager?.total,
    }
    const res = await setReadApi({ read: 2, msgIds: [msgIds] })
    if (res.code === 0) {
      dispatch(setIsNewMsg(isNewMsg + 1))
      newData[index].read = 2
      setTimeout(() => {
        setData({
          pager: total,
          list: [...newData],
        })
      })
    }
  }
  const onReadClick = (index: number, msgIds: string) => {
    setRead(index, msgIds)
  }
  const hasMore = useMemo(() => {
    if (!data?.list) {
      return false
    }
    const allTask = data?.list
    if (allTask?.length < data?.pager?.total) {
      return true
    }
    return false
  }, [data])
  // 1是数据，2是更多
  const onComputedTab = (type: number) => {
    const result = type === 1 ? data?.list : hasMore
    return result
  }
  const fetchMoreData = () => {
    const pages = page + 1
    setPage(pages)
    _getMsg_list(false, pages)
  }
  return (
    <div style={{ height: '100%' }}>
      {data?.list?.length ? (
        <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
          <MyList id="scrollableDiv">
            <InfiniteScroll
              dataLength={data?.list?.length ? data?.list?.length : 0}
              next={fetchMoreData}
              hasMore={onComputedTab(2)}
              loader={<Skeleton paragraph={{ rows: 1 }} active />}
              scrollableTarget="scrollableDiv"
            >
              {data?.list?.length
                ? data?.list?.map((item: any, index: number) => {
                    return (
                      <NoticeItem
                        index={index}
                        key={index}
                        data={item}
                        onReadClick={onReadClick}
                      ></NoticeItem>
                    )
                  })
                : null}
            </InfiniteScroll>
          </MyList>
        </SpinWrap>
      ) : (
        <NewNoData
          text={t('commentMessagesFromTasksWillBeCollectedInMySection')}
          url="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702629603194/%E6%88%91%E7%9A%84.png"
        ></NewNoData>
      )}
      {/* <NewNoData text='来自任务的评论消息都会收集在「@我的」里面' url='https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702629603194/%E6%88%91%E7%9A%84.png'></NewNoData> */}
    </div>
  )
}

export default MineNotice
