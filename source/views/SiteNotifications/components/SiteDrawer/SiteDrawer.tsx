/* eslint-disable no-promise-executor-return */
/* eslint-disable require-atomic-updates */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-undef */
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { changeNumber, changeVisible } from '@store/SiteNotifications'
import { Checkbox, Divider, Drawer, Skeleton, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContentItem from '../ContentItem/ContentItem'
import {
  CloseWrap,
  MyFooter,
  GrepTitle,
  TabsWrap,
  TabsWrapItem,
  Tips,
  Wrap,
  ActiveTab,
  GrepTitle2,
  messageDrawer,
} from './style'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getContactStatistics,
  getMsg_list,
  setReadApi,
} from '@/services/SiteNotifications'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import NoData from '@/components/NoData'
import styled from '@emotion/styled'
const BlueDiv = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  :hover {
    color: var(--primary-d2);
  }
  :hover svg {
    color: var(--primary-d2);
  }
`

const SiteDrawer = () => {
  const [t] = useTranslation()
  const [active, setActive] = useState('1')
  const newName = useRef<any>(
    Math.floor((new Date().getTime() - 30 * 24 * 3600 * 1000) / 1000),
  )
  const atmy = useRef<any>(undefined)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { all, isVisible } = useSelector(store => store.siteNotifications)
  const { isRefresh } = useSelector(store => store.user)
  const [list, setList] = useState([])
  const [now, setNow] = useState()
  const lastId = useRef(1)
  const tabBox = useRef<HTMLDivElement>(null)
  const tabActive = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(true)
  const [read, setRead] = useState<number | null>()
  const tabsValue = [
    {
      id: '1',
      text: `${t('new1')}(${now ?? 0})`,
    },
    {
      id: '4',
      text: t('notification'),
    },

    {
      id: '2',
      text: t('atmy'),
    },
    {
      id: '3',
      text: t('all'),
    },
  ]

  const onChange = (e: CheckboxChangeEvent) => {
    lastId.current = 1
    setHasMore(true)
    setList([])
    setRead(e.target.checked ? 0 : undefined)
    localStorage.setItem('read', e.target.checked ? '0' : '1')
  }

  const onClose = () => {
    dispatch(changeVisible(false))
  }
  const fetchMoreData = async (type: number) => {
    const re4 = await getMsg_list({
      lastId: lastId.current,
      read:
        localStorage.getItem('read') === '1'
          ? undefined
          : localStorage.getItem('read'),
      latTime: newName.current,
      msgType: atmy.current,
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
  const changeActive = (id: string) => {
    setList([])
    setActive(id)
    setHasMore(true)
    if (id === '3') {
      atmy.current = undefined
      newName.current = undefined
      lastId.current = 1
      fetchMoreData(1)
    }
    if (id === '2') {
      newName.current = undefined
      atmy.current = ['191', '132']
      lastId.current = 1
      fetchMoreData(1)
    }
    if (id === '4') {
      newName.current = undefined
      atmy.current = ['150']
      lastId.current = 1
      fetchMoreData(1)
    }
    if (id === '1') {
      atmy.current = undefined

      const tenMinutesAgoTimestamp = Math.floor(
        (new Date().getTime() - 30 * 24 * 3600 * 1000) / 1000,
      )

      newName.current = tenMinutesAgoTimestamp
      lastId.current = 1
      fetchMoreData(1)
    }
  }

  const setReads = async (values: any) => {
    const res = await setReadApi(values)
    setList([])
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (res.code === 0) {
      const res2 = await getContactStatistics()
      let num = 0

      res2.list.slice(1, 6).forEach((i: any) => {
        num += Number(i.nread)
      })

      dispatch(changeNumber(num))
      setHasMore(true)
      setList([])
      lastId.current = 1
      fetchMoreData(1)
    }
  }
  const setAllRead = () => {
    setReads(undefined)
  }

  const reset = async () => {
    const res = await getContactStatistics()
    const a = res.list.find((i: any) => i.send_user === 'now')
    setNow(a.nread)
  }
  const n2 = () => {
    lastId.current = 1
    setHasMore(true)
  }
  useEffect(() => {
    lastId.current = 1
    isVisible ? fetchMoreData(1) : n2()
    isVisible ? reset() : null
  }, [isVisible, read, all])

  const readStatue = () => {
    let state: boolean
    if (localStorage.getItem('read') === '0') {
      state = true
    } else {
      state = false
    }

    return state
  }

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      tabBox.current?.children[i].addEventListener('click', e => {
        if (tabActive.current) {
          tabActive.current.style.left = `${
            (tabBox.current?.children[i] as HTMLDivElement).offsetLeft
          }px`
          tabActive.current.style.width = `${tabBox.current?.children[i].clientWidth}px`
        }
      })
    }
  }, [])
  useEffect(() => {
    const index = tabsValue.findIndex((i: any) => i.id === active)
    tabActive.current!.style.left = `${
      (tabBox.current?.children[index] as HTMLDivElement).offsetLeft === 0
        ? 2
        : (tabBox.current?.children[index] as HTMLDivElement).offsetLeft
    }px`

    tabActive.current!.style.width = `${
      tabBox.current?.children[index].clientWidth === 0
        ? 80
        : tabBox.current?.children[index].clientWidth
    }px`
  }, [active, isRefresh])

  return (
    <Drawer
      className={messageDrawer}
      forceRender
      bodyStyle={{
        padding: '16px 0px 0px',
        boxSizing: 'border-box',
      }}
      width={400}
      zIndex={100}
      closable={false}
      placement="right"
      onClose={onClose}
      open={isVisible}
    >
      <Wrap>
        <div style={{ display: 'flex', padding: '0px 12px' }}>
          <TabsWrap ref={tabBox}>
            {tabsValue.map((i: any) => (
              <TabsWrapItem
                onClick={() => changeActive(i.id)}
                active={active === i.id}
                key={i.id}
              >
                {i.text}
              </TabsWrapItem>
            ))}
            <ActiveTab ref={tabActive} />
          </TabsWrap>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '16px 12px 8px',
          }}
        >
          <GrepTitle>{t('today')}</GrepTitle>
          <GrepTitle2 onClick={() => (list.length >= 1 ? setAllRead() : null)}>
            {t('all_read')}
          </GrepTitle2>
        </div>

        <InfiniteScroll
          dataLength={list.length}
          next={() => fetchMoreData(2)}
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 230px)',
            padding: '10px 0px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
          hasMore={hasMore}
          height={document.body.clientHeight - 230}
          loader={<Skeleton avatar paragraph={{ rows: 2 }} active />}
          scrollableTarget="scrollableDiv"
          endMessage={
            <div
              style={{
                margin: '0 12px',
              }}
            >
              {list.length < 1 ? (
                <NoData />
              ) : (
                <Divider plain>{t('nm')} </Divider>
              )}
            </div>
          }
        >
          {list.map((i: any) => (
            <ContentItem setReads={setReads} item={i} key={i.id} />
          ))}
        </InfiniteScroll>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '0 12px',
            background: 'var(--neutral-white-d1)',
          }}
        >
          {active === '1' ? (
            <Tips>
              {t(
                'all_notifications_for_the_last_30_days_have_been_shown_to_you',
              )}
            </Tips>
          ) : (
            <Tips>
              {t(
                'all_notifications_in_the_past_half_year_have_been_displayed_for_you',
              )}
            </Tips>
          )}

          <MyFooter>
            <Checkbox checked={readStatue()} onChange={onChange}>
              <span
                style={{
                  fontSize: '14px',

                  color: 'var(--neutral-n1-d1)',
                }}
              >
                {t('show_only_unread')}
              </span>
            </Checkbox>
            <div
              style={{
                display: 'flex',
              }}
            >
              {/* <Tooltip title={t('set')}>
                <CloseWrap
                  style={{
                    margin: '0 4px',
                  }}
                  onClick={() => {
                    navigate('/SiteNotifications/Setting/1')
                    dispatch(changeVisible(false))
                  }}
                  width={32}
                  height={32}
                >
                  <IconFont
                    style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                    type="settings"
                  />
                </CloseWrap>
              </Tooltip> */}
              {/* <Tooltip title={t('new_page')}> */}
              <BlueDiv
                onClick={() => {
                  const url = 'SiteNotifications/AllNote/1'
                  window.open(
                    `${window.origin}${import.meta.env.__URL_HASH__}${url}`,
                  )
                  // navigate()
                  // dispatch(changeVisible(false))
                }}
              >
                <span>{t('notificationCenter')}</span>
                <IconFont
                  style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                  type="right"
                />
              </BlueDiv>
              {/* </Tooltip> */}
            </div>
          </MyFooter>
        </div>
      </Wrap>
    </Drawer>
  )
}

export default SiteDrawer
