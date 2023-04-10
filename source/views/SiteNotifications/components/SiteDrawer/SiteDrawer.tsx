/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react/jsx-no-undef */
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { changeVisible } from '@store/SiteNotifications'
import { Checkbox, Drawer, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import VirtualList from '../VittualNode/VittualNode'
import VirtualScrollList from '../VittualNode/VittualNode'
import { useTranslation } from 'react-i18next'

const formWorkUsageData: any = {
  list: [],
}
for (let i = 0; i < 100; i++) {
  formWorkUsageData.list.push(i)
}
const tabsValue = [
  {
    id: '1',
    text: '最新（4）',
  },
  {
    id: '2',
    text: '@我的',
  },
  {
    id: '3',
    text: '全部',
  },
]

const SiteDrawer = () => {
  const [t] = useTranslation()
  const [active, setActive] = useState('1')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isVisible = useSelector(store => store.siteNotifications.isVisible)

  const onClose = () => {
    dispatch(changeVisible(false))
  }
  const changeActive = (id: string) => {
    setActive(id)
  }

  return (
    <Drawer
      bodyStyle={{ padding: 16, paddingBottom: '8px', boxSizing: 'border-box' }}
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
          <GrepTitle>{t('all_read')}</GrepTitle>
        </div>
        <div
        // style={{
        //   overflow: 'scroll',
        //   height: 'calc(100vh - 230px)',
        //   padding: '10px 16px',
        //   display: 'flex',
        //   flexDirection: 'column',
        //   gap: '16px',
        // }}
        >
          {/* {new Array(30).fill(null).map((i: any) => (
            <ContentItem key={i} />
          ))} */}
          <VirtualScrollList
            dataList={formWorkUsageData.list}
            renderItem={(i, index) => <ContentItem name={i} />}
          />
        </div>

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
            <Checkbox>
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
