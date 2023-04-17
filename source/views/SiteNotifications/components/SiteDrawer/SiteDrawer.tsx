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
import { changeVisible } from '@store/SiteNotifications'
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
} from './style'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getContactStatistics,
  getMsg_list,
  setReadApi,
} from '@/services/SiteNotifications'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

const tabsValue = [
  {
    id: '3',
    text: '全部',
  },
  {
    id: '1',
    text: '最新（4）',
  },
  {
    id: '2',
    text: '@我的',
  },
]

const SiteDrawer = () => {
  const [t] = useTranslation()
  const [active, setActive] = useState('3')
  const newName = useRef<any>(undefined)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isVisible = useSelector(store => store.siteNotifications.isVisible)
  const [list, setList] = useState([])
  const lastId = useRef(0)
  const [hasMore, setHasMore] = useState(true)
  const [read, setRead] = useState<number | null>()

  const onChange = (e: CheckboxChangeEvent) => {
    lastId.current = 0
    setHasMore(true)
    setRead(e.target.checked ? 0 : undefined)
  }

  const onClose = () => {
    dispatch(changeVisible(false))
  }
  const fetchMoreData = async (b?: boolean) => {
    const re4 = await getMsg_list({
      lastId: lastId.current,
      read,
      latTime: newName.current,
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
        setList(list.concat(re4.list))
      }
    }, 500)
  }
  const changeActive = (id: string) => {
    setActive(id)
    if (id === '3') {
      newName.current = undefined
      lastId.current = 0
      fetchMoreData(true)
    }
    if (id === '1') {
      newName.current = new Date().valueOf() / 1000
      lastId.current = 0
      fetchMoreData(true)
    }
  }

  const setReads = async (values: any) => {
    setReadApi(values)
  }
  const setAllRead = () => {
    const arr = list.map((i: any) => i.id)
    setReads(arr)
  }
  useEffect(() => {
    isVisible ? fetchMoreData(true) : null
  }, [isVisible, read])

  return (
    <Drawer
      forceRender
      bodyStyle={{
        padding: 16,
        paddingBottom: '8px',
        paddingRight: '4px',
        boxSizing: 'border-box',
      }}
      width={400}
      zIndex={1}
      closable={false}
      mask={false}
      placement="right"
      onClose={onClose}
      open={isVisible}
    >
      <Wrap>
        <div style={{ display: 'flex' }}>
          <TabsWrap>
            {tabsValue.map((i: any) => (
              <TabsWrapItem
                onClick={() => changeActive(i.id)}
                active={active === i.id}
                key={i.id}
              >
                {i.text}
              </TabsWrapItem>
            ))}
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
            marginTop: '16px',
          }}
        >
          <GrepTitle>{t('today')}</GrepTitle>
          <GrepTitle onClick={setAllRead}>{t('all_read')}</GrepTitle>
        </div>

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

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
          }}
        >
          <Tips>
            {t(
              'all_notifications_in_the_past_half_year_have_been_displayed_for_you',
            )}
          </Tips>
          <MyFooter>
            <Checkbox onChange={onChange}>
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
              <Tooltip title={t('set')}>
                <CloseWrap
                  style={{
                    margin: '0 4px',
                  }}
                  onClick={() => navigate('/SiteNotifications/Setting/1')}
                  width={32}
                  height={32}
                >
                  <IconFont
                    style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                    type="settings"
                  />
                </CloseWrap>
              </Tooltip>
              <Tooltip title={t('new_page')}>
                <CloseWrap
                  style={{
                    margin: 0,
                  }}
                  onClick={() => navigate('/SiteNotifications/AllNote/1')}
                  width={32}
                  height={32}
                >
                  <IconFont
                    style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                    type="file-text"
                  />
                </CloseWrap>
              </Tooltip>
            </div>
          </MyFooter>
        </div>
      </Wrap>
    </Drawer>
  )
}

export default SiteDrawer
