/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch } from '@store/index'
import { changeVisibleFilter } from '@store/SiteNotifications'
import { useParams } from 'react-router'
import AllSideFilter from '../components/AllSideFilter/AllSideFilter'
import ContentItem from '../components/ContentItem/ContentItem'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider, Skeleton } from 'antd'
import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import { useEffect, useState } from 'react'

interface ZoomRatioType {
  [MapZoom: string]: string
}
const Index = () => {
  const [list, setList] = useState([])
  const [lastId, setLastId] = useState<any>(0)
  const [hasMore, setHasMore] = useState(true)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { id } = useParams()
  const titles: ZoomRatioType = {
    1: '全部通知',
    2: '未读通知',
    3: '已读通知',
    4: '提及我的',
  }
  const setReads = async (values: any) => {
    setReadApi(values)
  }
  const setAllRead = () => {
    const arr = list.map((i: any) => i.id)
    setReads(arr)
  }
  const init = async () => {
    const re4 = await getMsg_list({
      lastId,
      read: id === '2' ? 0 : id === '3' ? 1 : undefined,
    })

    return {
      lastId: re4.lastId,
      list: re4.list,
    }
  }

  const fetchMoreData = async () => {
    const re4 = await init()

    if (re4.lastId === 0) {
      setHasMore(false)
      return
    }

    setList(list.concat(re4.list))
    setLastId(re4.lastId)
  }

  useEffect(() => {
    fetchMoreData()
  }, [])

  return (
    <div>
      <AllSideFilter />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px 24px',
          alignItems: 'center',
        }}
      >
        <LeftTitle title={titles[id as string]} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <CommonButton
            onClick={() => dispatch(changeVisibleFilter(true))}
            type="light"
          >
            {t('filtering_notifications') as string}
          </CommonButton>
          {id !== '3' && (
            <CommonButton onClick={setAllRead} type="light">
              {t('all_read') as string}
            </CommonButton>
          )}
        </div>
      </div>

      <div style={{ padding: '0 80px' }}>
        <InfiniteScroll
          dataLength={list.length}
          next={fetchMoreData}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 230px)',
            padding: '10px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          hasMore={hasMore}
          height={document.body.clientHeight - 230}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          scrollableTarget="scrollableDiv"
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        >
          {list.map((i: any) => (
            <ContentItem setReads={setReads} item={i} key={i.id} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Index
