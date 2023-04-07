import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import useWebsocket from '@/tools/useWebsocket'
import { useDispatch, useSelector } from '@store/index'
import { changeVisible } from '@store/SiteNotifications'
import { Badge, notification } from 'antd'
import React, { useEffect } from 'react'

const SiteNotifications = () => {
  const { sendMessage, wsData } = useWebsocket()
  const dispatch = useDispatch()
  const isVisible = useSelector(store => store.siteNotifications.isVisible)
  const sendMsg = () => {
    if (Notification.permission === 'granted') {
      Notification.requestPermission(() => {
        const n = new Notification('来自张三的审批通知', {
          body: 'DXKJ-001产品计划已规划，点击前往审批',
        })
      })
    } else {
      notification.open({
        placement: 'bottomRight',
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      })
    }
  }
  useEffect(() => {
    if (wsData) {
      sendMsg()
    }
  }, [wsData])

  return (
    <Badge size="small" offset={[-2, 1]} count={5}>
      <CommonIconFont
        onClick={() => {
          dispatch(changeVisible(!isVisible))
          sendMessage('1234')
        }}
        color="var(--neutral-n2)"
        size={24}
        type="bell"
      />
    </Badge>
  )
}

export default SiteNotifications
