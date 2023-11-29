/* eslint-disable no-promise-executor-return */
/* eslint-disable no-empty */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import LeftTitle from '@/components/LeftTitle'
import { useDispatch, useSelector } from '@store/index'
import { changeNumber } from '@store/SiteNotifications'
import { useParams } from 'react-router'
import ContentItem from '../components/ContentItem/ContentItem'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider, Skeleton } from 'antd'
import {
  getContactStatistics,
  getMsg_list,
  setReadApi,
} from '@/services/SiteNotifications'
import { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/css'
import NoData from '@/components/NoData'
import AllSideFilter from '../components/AllSideFilter/AllSideFilter'
import styled from '@emotion/styled'
import CommonIconFont from '@/components/CommonIconFont'

export const scrollListWrap = css`
  padding: 0px 4px 0px 80px;
  .ant-skeleton-active {
    .ant-skeleton-title,
    .ant-skeleton-avatar,
    .ant-skeleton-paragraph > li {
      border-radius: 4px;
      background: var(--neutral-n7);
    }
  }
`

const AllReadBox = styled.div<{ isDisable?: boolean }>`
  display: flex;
  align-items: center;
  width: max-content;
  gap: 8px;
  cursor: ${props => (props.isDisable ? 'inherit' : 'pointer')};
  color: ${props =>
    props.isDisable
      ? 'var(--neutral-n4)!important'
      : 'var(--auxiliary-text-t2-d1)'};
  div {
    font-size: 14px;
  }
  .anticon {
    cursor: ${props => (props.isDisable ? 'inherit' : 'pointer')};
  }
  &:hover {
    color: var(--primary-d1);
  }
`

interface ZoomRatioType {
  [MapZoom: string]: string
}
const Index = () => {
  const lastId = useRef<any>(1)
  const all = useSelector(store => store.siteNotifications.all)
  const friendUsername = useRef<any>(undefined)
  const msgType = useRef<any>(undefined)
  const [list, setList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [isClickAll, setIsClickAll] = useState(false)
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
    const maxPage = re4.pager.total
    lastId.current += 1

    if (type === 1 && lastId.current === maxPage + 1) {
      setList(re4.list)
      setHasMore(false)
    } else if (type === 1) {
      setList(re4.list)
      if (re4.list.length < 1) {
        setHasMore(false)
      }
    } else if (type === 2 && lastId.current === maxPage + 1) {
      setList(e => e.concat(re4.list))
      setHasMore(false)
    } else if (type === 2) {
      setList(e => e.concat(re4.list))
    }
  }
  const setReads = async (values: any) => {
    const res = await setReadApi(values)
    setList([])
    setHasMore(true)
    lastId.current = 1
    await new Promise(resolve => setTimeout(resolve, 2000))
    fetchMoreData(1)

    if (res.code === 0) {
      const res2 = await getContactStatistics()
      let num = 0
      res2.list.slice(1, 6).forEach((i: any) => {
        num += Number(i.nread)
      })

      dispatch(changeNumber(num))
    }
  }
  const setReads2 = async (values: any) => {
    const res = await setReadApi(values)
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (res.code === 0) {
      const res2 = await getContactStatistics()
      let num = 0
      res2.list.slice(1, 6).forEach((i: any) => {
        num += Number(i.nread)
      })

      dispatch(changeNumber(num))
    }
  }
  const setAllRead = () => {
    // const arr = list.map((i: any) => i.id)
    setReads(undefined)
  }

  const changeUser = (str: string, arr: any) => {
    setList([])
    msgType.current = id === '4' ? ['191', '132'].concat(arr ?? []) : arr
    friendUsername.current = str
    lastId.current = 1
    setHasMore(true)

    fetchMoreData(1)
  }
  const changeMsg = (arr: any) => {
    setList([])
    msgType.current = id === '4' ? ['191', '132'].concat(arr ?? []) : arr
    lastId.current = 1
    setHasMore(true)
    fetchMoreData(1)
  }

  // 点击全部已读
  const onClickAllRead = () => {
    if (isClickAll) return
    list.length >= 1 ? setAllRead() : null
    setIsClickAll(true)
  }

  useEffect(() => {
    msgType.current = undefined
    if (id === '4') {
      msgType.current = ['191', '132']
    }
    lastId.current = 1
    setList([])
    setHasMore(true)
    fetchMoreData(1)
  }, [id, all])

  return (
    <div
      style={{
        height: 'calc(100% - 38px)',
        background: 'var(--neutral-white-d1)',
      }}
    >
      <AllSideFilter changeUser={changeUser} changeMsg={changeMsg} />
      <div
        style={{
          padding: '16px 24px',
        }}
      >
        <AllReadBox isDisable={isClickAll} onClick={onClickAllRead}>
          <div>{t('all_read')}</div>
          <CommonIconFont type="read" size={16} />
        </AllReadBox>
      </div>

      <div className={scrollListWrap}>
        <InfiniteScroll
          dataLength={list.length}
          next={() => fetchMoreData(2)}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 166px)',
            padding: '10px 16px',
            paddingRight: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          hasMore={hasMore}
          height={document.body.clientHeight - 230}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          scrollableTarget="scrollableDiv"
          endMessage={
            list.length < 1 ? <NoData /> : <Divider plain>{t('nm')} </Divider>
          }
        >
          {list.map((i: any) => {
            return <ContentItem bor setReads={setReads2} item={i} key={i.id} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Index
