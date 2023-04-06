import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import useWebsocket from '@/tools/useWebsocket'
import { useDispatch, useSelector } from '@store/index'
import { changeVisible } from '@store/SiteNotifications'
import { Badge } from 'antd'
import React, { useEffect } from 'react'

const SiteNotifications = () => {
  const { sendMessage, wsData } = useWebsocket()
  const dispatch = useDispatch()
  const isVisible = useSelector(store => store.siteNotifications.isVisible)
  const sendMsg = () => {
    if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission(status => {
        if (status === 'granted') {
          const n = new Notification('来自张三的审批通知', {
            body: 'DXKJ-001产品计划已规划，点击前往审批',
          })
        }
      })
    }
  }
  useEffect(() => {
    sendMsg()
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
