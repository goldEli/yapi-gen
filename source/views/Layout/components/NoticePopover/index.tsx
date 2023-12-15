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
import NoData from '@/components/NoData'
import NewNoData from '@/components/NewNoData'
import { useTranslation } from 'react-i18next'
interface IProps {}
const NoticePopover = (props: any) => {
  const { onHistoryStatics, onClose } = props
  const [data, setData] = useState<any>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const [index, setIndex] = useState(-1)
  const [page, setPage] = useState(1)
  const [t] = useTranslation()

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
        const newData = res?.list ?? []
        for (const iterator of newData) {
          if (parseInt(iterator.read, 10) === 0) {
            iterator.read = 1
            dispatch(setIsNewMsg(isNewMsg + 1))
          }
        }
        setData({
          pager: total,
          list: [...newData],
        })
      }, 6000)
    }
  }

  useEffect(() => {
    _getMsg_list(true, 1)
  }, [])
  const setRead = async (index: number, msgIds: string) => {
    const newData = data.list
    const total = {
      total: data?.pager?.total,
    }
    const res = await setReadApi({ read: 2, msgIds: [msgIds] })
    dispatch(setIsNewMsg(isNewMsg + 1))
    if (res.code === 0) {
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
    <NoticePopoverWrap
    // style={{ overflowY: data?.list?.length ? 'scroll' : 'hidden' }}
    >
      <SpinWrap indicator={<NewLoadingTransition />} spinning={isSpinning}>
        <ContentList id="scrollableDiv">
          {data?.list?.length ? (
            <InfiniteScroll
              dataLength={data?.list?.length ? data?.list?.length : 0}
              next={fetchMoreData}
              hasMore={onComputedTab(2)}
              loader={<Skeleton paragraph={{ rows: 1 }} active />}
              scrollableTarget="scrollableDiv"
            >
              {data?.list?.map((item: any, index: number) => {
                return (
                  <NoticeItem
                    index={index}
                    key={index}
                    data={item}
                    onReadClick={onReadClick}
                    onCancel={() => {
                      console.log(1111)
                      onClose()
                    }}
                  ></NoticeItem>
                )
              })}
            </InfiniteScroll>
          ) : (
            <NewNoData
              text={t(
                'messagesFromProjectLogscommaReportRecordscommaSystemLogscommaEtcWillBeCollectedInDynamic',
              )}
              url="https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/22669459/dev/1702635983091/%E5%8A%A8%E6%80%81.png"
            ></NewNoData>
          )}
        </ContentList>
      </SpinWrap>
      <FooterBox>
        <div className="current-week">
          {data?.list?.length
            ? t('weHaveShownYouTheLatestUpdatesForThePastWeek')
            : null}
        </div>
        <div className="more-notice" onClick={onHistoryStatics}>
          {t('historicalDynamics')}
          <CommonIconFont type="right"></CommonIconFont>
        </div>
      </FooterBox>
    </NoticePopoverWrap>
  )
}
export default NoticePopover
