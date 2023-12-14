import { Button, Popover, Skeleton } from 'antd'
import { ContentList, FooterBox, NoticePopoverWrap } from './style'
import CommonIconFont from '@/components/CommonIconFont'
import { ICON_TYPE_DATA } from './constant'
import NoticeItem from './NoticeItem'
import { useEffect, useMemo, useState } from 'react'
import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from '@store/index'
import { setIsNewMsg } from '@store/mine'
import InfiniteScroll from 'react-infinite-scroll-component'
import _ from 'lodash'
interface IProps {}
const NoticePopover = (props: any) => {
  const { onHistoryStatics } = props
  const [data, setData] = useState<any>([])
  const dispatch = useDispatch()
  const [index, setIndex] = useState(-1)
  const { isNewMsg } = useSelector(store => store.mine)
  const _getMsg_list = async (isInit: boolean, page: number) => {
    const todayDate = dayjs(new Date()).format('YYYY-MM-DD')
    const lastSevenDays = dayjs(todayDate)
      .subtract(7, 'days')
      .format('YYYY-MM-DD')
    const res = await getMsg_list({
      business_type: 1,
      latTime: new Date(lastSevenDays).valueOf() / 1000,
      nowWhereReadAll: true,
      pageSize: 50,
      page: page,
    })
    const data = res?.list
    setData(data)
    // if (isInit) {
    //   setData(data)
    // } else {
    //   const oldData = _.cloneDeep(data.list)
    //   const newData = _.cloneDeep(res.list)
    //   addMore(oldData, newData)
    //   setData({
    //     pager: res.pager,
    //     list: oldData,
    //   })
    // }
    if (res?.nowWhereReadAllNum) {
      dispatch(setIsNewMsg(isNewMsg + 1))
    }
    setTimeout(() => {
      for (const iterator of data) {
        iterator.read = 1
      }
      setData([...data])
    }, 3600)
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
    const allTask = data
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
    _getMsg_list(false, 1)
  }
  return (
    <NoticePopoverWrap>
      <ContentList>
        {data.map((item: any, index: number) => {
          return (
            <NoticeItem
              index={index}
              key={index}
              data={item}
              onReadClick={onReadClick}
            ></NoticeItem>
          )
        })}
        {/* <InfiniteScroll
          dataLength={
            data?.list?.length ? data?.list?.length : 0
          }
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
        </InfiniteScroll> */}
      </ContentList>
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
