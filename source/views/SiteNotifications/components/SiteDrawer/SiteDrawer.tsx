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
          <GrepTitle>今天</GrepTitle>
          <GrepTitle>全部已读</GrepTitle>
        </div>
        <ContentItem />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
          }}
        >
          <Tips>已为您显示近半年的所有通知消息</Tips>
          <MyFooter>
            <Checkbox>
              <span
                style={{
                  fontSize: '14px',

                  color: 'var(--neutral-n1-d1)',
                }}
              >
                只显示未读
              </span>
            </Checkbox>
            <div
              style={{
                display: 'flex',
              }}
            >
              <Tooltip title="设置">
                <CloseWrap
                  style={{
                    margin: '0 4px',
                  }}
                  onClick={() => navigate('/SiteNotifications/Setting')}
                  width={32}
                  height={32}
                >
                  <IconFont
                    style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
                    type="settings"
                  />
                </CloseWrap>
              </Tooltip>
              <Tooltip title="新页面">
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
