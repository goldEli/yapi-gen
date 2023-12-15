import { Button, Popover, Skeleton } from 'antd'
import { ContentList, FooterBox, NoticePopoverWrap } from './style'
import CommonIconFont from '@/components/CommonIconFont'
import { ICON_TYPE_DATA } from './constant'
import NoticeItem from './NoticeItem'
import { useEffect, useMemo, useState } from 'react'
import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from '@store/index'
import { setIsNewMsg, setMsgStatics } from '@store/mine'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'
import { SpinWrap } from '../../style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
interface IProps {}
const NoticePopover = (props: any) => {
  const { onHistoryStatics } = props
  const [data, setData] = useState<any>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const [index, setIndex] = useState(-1)
  const [page, setPage] = useState(1)
  const { isNewMsg, msgStatics } = useSelector(store => store.mine)
  const _getMsg_list = async (isInit: boolean, page: number) => {
    setIsSpinning(true)
    const todayDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    const lastSevenDays = dayjs(todayDate)
      .subtract(7, 'days')
      .format('YYYY-MM-DD HH:mm:ss')
    const res = await getMsg_list({
      business_type: 1,
      latTime: new Date(lastSevenDays).valueOf() / 1000,
      nowWhereReadAll: true,
      pageSize: 10,
      page: page,
    })
    setIsSpinning(false)
    dispatch(setMsgStatics({ ...msgStatics, allnews: res?.total }))

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
    if (res?.nowWhereReadAllNum) {
      setTimeout(() => {
        for (const iterator of data) {
          if (parseInt(iterator.read, 10) === 0) {
            iterator.read = 1
          }
        }
        setData([...data])
      }, 6000)
      dispatch(setIsNewMsg(isNewMsg + 1))
    }
  }

  useEffect(() => {
    _getMsg_list(true, 1)
  }, [])
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
    <NoticePopoverWrap>
      <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <ContentList id="scrollableDiv">
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
        </ContentList>
      </SpinWrap>
      <FooterBox>
        <div className="current-week">已为您显示近一周的动态信息</div>
        <div className="more-notice" onClick={onHistoryStatics}>
          历史动态<CommonIconFont type="right"></CommonIconFont>
        </div>
      </FooterBox>
    </NoticePopoverWrap>
  )
}
export default NoticePopover
