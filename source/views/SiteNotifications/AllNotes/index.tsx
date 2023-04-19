/* eslint-disable no-empty */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch } from '@store/index'
import { changeVisible, changeVisibleFilter } from '@store/SiteNotifications'
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
  const [hasMore, setHasMore] = useState(true)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { id } = useParams()
  const titles: ZoomRatioType = {
    1: t('all_notices'),
    2: t('unread_notifications'),
    3: t('read_notifications'),
    4: t('referring_to_my'),
  }

  const fetchMoreData = async (type: number) => {
    const re4 = await getMsg_list({
      lastId: lastId.current,
      read: id === '2' ? 0 : id === '3' ? 1 : undefined,
      friendUsername: friendUsername.current,
      msgType: msgType.current,
    })

    lastId.current = re4.lastId
    setTimeout(() => {
      if (type === 1 && re4.lastId === 0) {
        setList(re4.list)
        setHasMore(false)
      } else if (type === 1) {
        setList(re4.list)
      } else if (type === 2 && re4.lastId === 0) {
        setList(e => e.concat(re4.list))
        setHasMore(false)
      } else if (type === 2) {
        setList(e => e.concat(re4.list))
      }
    }, 500)
  }
  const setReads = async (values: any) => {
    await setReadApi(values)
    setList([])
    setHasMore(true)
    lastId.current = 0
    fetchMoreData(1)
  }
  const setAllRead = () => {
    const arr = list.map((i: any) => i.id)
    setReads(arr)
  }

  const changeUser = (str: string, arr: any) => {
    msgType.current = arr
    friendUsername.current = str
    lastId.current = undefined
    setHasMore(true)

    fetchMoreData(1)
  }
  const changeMsg = (arr: any) => {
    msgType.current = arr
    lastId.current = undefined
    setHasMore(true)
    fetchMoreData(1)
  }

  useEffect(() => {
    lastId.current = 0
    setList([])
    fetchMoreData(1)
  }, [id])

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
            onClick={() => {
              dispatch(changeVisibleFilter(true))
              dispatch(changeVisible(false))
            }}
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

      <div style={{ padding: '0 80px', paddingRight: '4px' }}>
        <InfiniteScroll
          dataLength={list.length}
          next={() => fetchMoreData(2)}
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
          endMessage={<Divider plain>{t('nm')} </Divider>}
        >
          {list.map((i: any) => {
            return <ContentItem setReads={setReads} item={i} key={i.id} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Index
