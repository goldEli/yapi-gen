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
const MineNotice = () => {
  const [data, setData] = useState<any>()
  const dispatch = useDispatch()
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
        for (const iterator of data) {
          if (parseInt(iterator.read, 10) === 0) {
            iterator.read = 1
            // 更新统计
            dispatch(setIsNewMsg(isNewMsg + 1))
          }
        }
        setData([...data])
      }, 6000)
    }
    // setData(data)
  }
  // 消息推送更新
  useEffect(() => {
    _getMsg_list(true, 1)
  }, [todoStatistics?.total])
  const setRead = async (index: number, msgIds: string) => {
    const res = await setReadApi({ read: 2, msgIds: [msgIds] })
    if (res.code === 0) {
      data[index].read = 2
      setTimeout(() => {
        setData([...data])
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
    <div>
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
        <NoData></NoData>
      )}
    </div>
  )
}

export default MineNotice
