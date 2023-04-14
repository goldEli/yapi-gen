/* eslint-disable no-empty */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch, useSelector } from '@store/index'
import { changeVisibleFilter } from '@store/SiteNotifications'
import { useParams } from 'react-router'
import AllSideFilter from '../components/AllSideFilter/AllSideFilter'
import ContentItem from '../components/ContentItem/ContentItem'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider, Skeleton } from 'antd'
import { getMsg_list, setReadApi } from '@/services/SiteNotifications'
import { useEffect, useRef, useState } from 'react'

interface ZoomRatioType {
  [MapZoom: string]: string
}
const Index = () => {
  const lastId = useRef<any>()
  const friendUsername = useRef<any>(undefined)
  const msgType = useRef<any>(undefined)
  const [list, setList] = useState([])
  // const [lastId, setLastId] = useState<any>(0)
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

  const fetchMoreData = async (b?: boolean) => {
    const re4 = await getMsg_list({
      lastId: lastId.current,
      read: id === '2' ? 0 : id === '3' ? 1 : undefined,
      friendUsername: friendUsername.current,
      msgType: msgType.current,
    })

    if (re4.lastId === 0) {
      setHasMore(false)
      return
    }
    lastId.current = re4.lastId
    setTimeout(() => {
      if (b) {
        setList(re4.list)
      } else {
        setList(e => e.concat(re4.list))
      }
    }, 500)
  }
  const changeUser = (str: string, arr: any) => {
    console.log(str, 'fdfd')
    msgType.current = arr
    friendUsername.current = str
    lastId.current = 0
    setHasMore(true)
    fetchMoreData(true)
  }
  const changeMsg = (arr: any) => {
    msgType.current = arr

    lastId.current = 0
    setHasMore(true)
    fetchMoreData(true)
  }
  console.log(list)
  console.log(friendUsername)

  useEffect(() => {
    lastId.current = 0
    setHasMore(true)
    fetchMoreData(true)
  }, [id])
  console.log(list, '集合')

  return (
    <div>
      <AllSideFilter changeUser={changeUser} changeMsg={changeMsg} />
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
          endMessage={<Divider plain>nothing more 🤐</Divider>}
        >
          {list.map((i: any) => {
            console.log(i, 'shu')

            return <ContentItem setReads={setReads} item={i} key={i.id} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Index
