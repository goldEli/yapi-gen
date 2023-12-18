import { Button, Drawer, Space } from 'antd'
import {
  ContentWrap,
  DrawerFooter,
  DrawerWrap,
  TabsBox,
  TabsWrap,
  TitleWrap,
  cusDrawer,
} from './style'

import CommonIconFont from '@/components/CommonIconFont'
import NoticeItem from '../NoticePopover/NoticeItem'
import { useEffect, useRef, useState } from 'react'
import AssignTask from './assignTask'
import ReviewTask from './reviewTask'
import MineNotice from './mineNotice'
import classNames from 'classnames'
import { useSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
interface IProps {}

const TodoDrawer = (props: any) => {
  const { open = false, onCancel } = props
  const [t] = useTranslation()
  const [active, setActive] = useState(1)
  const tabs = [
    { name: t('my'), value: 1, fields: 'at' },
    { name: t('assignMyTasks'), value: 2, fields: 'handle' },
    { name: t('waitingForMeToReviewTheTask'), value: 3, fields: 'verify' },
  ]
  const content: any = {
    1: <MineNotice></MineNotice>,
    2: <AssignTask onCancel={onCancel}></AssignTask>,
    3: <ReviewTask onCancel={onCancel}></ReviewTask>,
  }
  const { msgStatics } = useSelector(store => store.mine)
  const { todoStatistics } = msgStatics ?? {}
  const { list } = todoStatistics ?? {}
  const navigate = useNavigate()

  const footer = (
    <DrawerFooter
      onClick={() => {
        if (active === 2) {
          onCancel()
          navigate('Mine/Carbon')
        }
        if (active === 3) {
          onCancel()
          navigate('Mine/Examine')
        }
      }}
    >
      {t('viewMyWork')}
      <CommonIconFont type="right"></CommonIconFont>
    </DrawerFooter>
  )
  const empty = <div style={{ height: '40px' }}></div>

  // 关闭抽屉
  const onCloseDrawer = (e: any) => {
    if (!open) {
      return
    }
    if (
      document.querySelector('#LayoutSide')?.contains?.(e.target) ||
      document.querySelector('#LayoutHeader')?.contains?.(e.target)
    ) {
      onCancel()
    }
  }

  useEffect(() => {
    if (open) {
      document.querySelector('body')?.addEventListener('click', onCloseDrawer)
    }
    return document
      .querySelector('body')
      ?.addEventListener('click', onCloseDrawer)
  }, [open])

  return (
    <div
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Drawer
        title={null}
        width={528}
        open={open}
        closable={false}
        onClose={onCancel}
        maskClosable
        maskStyle={{ background: 'transparent' }}
        zIndex={196}
        drawerStyle={{ paddingTop: '56px' }}
        className={cusDrawer}
        footer={active === 1 ? null : footer}
        destroyOnClose
        bodyStyle={{ padding: '16px 0 0', overflow: 'hidden' }}
        footerStyle={{ padding: '0 16px' }}
      >
        <TitleWrap>
          <TabsWrap>
            <TabsBox>
              {tabs.map(item => {
                return (
                  <div
                    key={item.value}
                    className={classNames('item', {
                      activity: active === item.value,
                    })}
                    onClick={() => setActive(item.value)}
                  >
                    {item.name} ({list ? list[item.fields] : null})
                  </div>
                )
              })}
            </TabsBox>
          </TabsWrap>
          <CloseWrap width={32} height={32} onClick={onCancel}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </TitleWrap>
        <ContentWrap>{content[active]}</ContentWrap>
      </Drawer>
    </div>
  )
}
export default TodoDrawer
