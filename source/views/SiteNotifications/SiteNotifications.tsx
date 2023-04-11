/* eslint-disable consistent-return */
/* eslint-disable complexity */
import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import useWebsocket from '@/tools/useWebsocket'
import { useDispatch, useSelector } from '@store/index'
import {
  changeVisible,
  setConfiguration,
  setMyConfiguration,
} from '@store/SiteNotifications'
import { Badge, notification } from 'antd'
import React, { useEffect } from 'react'
import { getAllNoteSet, getMyAllNoteSet } from '@/services/SiteNotifications'

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
  const setNewName = (type: string, code: number) => {
    let name = ''
    if (type === 'project') {
      switch (code) {
        case 130:
          name = '分配给我任务'
          break
        case 131:
          name = '待我审批'
          break
        case 132:
          name = '评论中@我'
          break
        case 133:
          name = '创建了任务'
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'system') {
      switch (code) {
        case 150:
          name = '系统公告'
          break
        case 151:
          name = '事项提醒'
          break
        case 152:
          name = '我审核的'
          break
        case 153:
          name = '待办'
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'calendar') {
      switch (code) {
        case 170:
          name = '日程提醒'
          break
        case 171:
          name = '邀请我参与的'
          break
        case 132:
          name = '评论中@我'
          break
        case 133:
          name = '创建了任务'
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'report') {
      switch (code) {
        case 190:
          name = '谁提交了简报'
          break
        case 191:
          name = '评论中@我'
          break
        case 192:
          name = '简报催缴'
          break
        case 133:
          name = '创建了任务'
          break

        default:
          name = ''
          break
      }
    }
    return name
  }

  const rename = (value: any) => {
    const obj = {
      name: '',
      children: [],
    }

    if (value.module === 'project') {
      obj.name = '项目管理'
      obj.children = value.lists.map((i: any) => {
        return {
          label: setNewName(value.module, i.rule),
          value: i.rule,
          checked: true,
        }
      })
      return obj
    }
    if (value.module === 'system') {
      obj.name = '系统通知'
      obj.children = value.lists.map((i: any) => {
        return {
          label: setNewName(value.module, i.rule),
          value: i.rule,
          checked: true,
        }
      })
      return obj
    }
    if (value.module === 'calendar') {
      obj.name = '日程管理'
      obj.children = value.lists.map((i: any) => {
        return {
          label: setNewName(value.module, i.rule),
          value: i.rule,
          checked: true,
        }
      })
      return obj
    }
    if (value.module === 'report') {
      obj.name = '工作汇报'
      obj.children = value.lists.map((i: any) => {
        return {
          label: setNewName(value.module, i.rule),
          value: i.rule,
          checked: true,
        }
      })
      return obj
    }
  }

  const initSet = (values: any) => {
    const arr: any = []
    values.forEach((i: any) => {
      arr.push(rename(i))
    })
    return arr
  }
  const init = async () => {
    const res = await getAllNoteSet()
    dispatch(setConfiguration(initSet(res.im)))

    const res2 = await getMyAllNoteSet()

    dispatch(setMyConfiguration(res2.list))
  }
  useEffect(() => {
    init()
  }, [])
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
