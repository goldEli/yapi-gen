/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import useWebsocket from '@/tools/useWebsocket'
import { useDispatch, useSelector } from '@store/index'
import {
  changeNumber,
  changeVisible,
  changeVisibleFilter,
  setConfiguration,
  setEmailConfiguration,
  setMyConfiguration,
  setMyEmailConfiguration,
} from '@store/SiteNotifications'
import { Badge, notification } from 'antd'
import React, { useEffect } from 'react'
import {
  getAllNoteSet,
  getContactStatistics,
  getMsg_list,
  getMyAllNoteSet,
} from '@/services/SiteNotifications'

const SiteNotifications = () => {
  const { wsData } = useWebsocket()
  const dispatch = useDispatch()
  const { isVisible, all } = useSelector(store => store.siteNotifications)
  const init2 = async () => {
    const res = await getContactStatistics()

    let num = 0

    res.list.slice(1, 6).forEach((i: any) => {
      num += Number(i.nread)
    })

    dispatch(changeNumber(num))
  }
  const sendMsg = () => {
    if (Notification.permission === 'granted') {
      Notification.requestPermission(() => {
        const n: any = new Notification(wsData.data.msgBody.title, {
          body: wsData.data.msgBody.content,
        })
        n.onclick = function () {
          if (wsData.data.customData.linkWebUrl) {
            // 当点击事件触发，打开指定的url
            window.open(wsData.data.customData.linkWebUrl)
            n.close()
          }
        }
      })
    } else {
      notification.open({
        maxCount: 1,
        placement: 'bottomRight',
        message: wsData.data.msgBody.title,
        description: wsData.data.msgBody.content,
        onClick: () => {
          if (wsData.data.customData.linkWebUrl) {
            // 当点击事件触发，打开指定的url
            window.open(wsData.data.customData.linkWebUrl)
          }
        },
      })
    }
    init2()
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
    if (type === 'email') {
      switch (code) {
        case 201:
          name = '待办'
          break
        case 202:
          name = '评论中@我'
          break
        case 203:
          name = '待我审批'
          break
        case 204:
          name = '简报催缴'
          break
        case 205:
          name = '谁提交了简报'
          break
        case 206:
          name = '日程提醒'
          break
        case 207:
          name = '邀请我参与的日程'
          break
        case 208:
          name = '系统公告'
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
      sendType: '',
    }

    if (value.module === 'project') {
      obj.name = '项目管理'
      obj.sendType = 'project'
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
      obj.sendType = 'sys'
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
      obj.sendType = 'calendar'
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
      obj.sendType = 'report'
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
  const initEmailSet = (values: any) => {
    return values.map((i: any) => ({
      id: i.rule,
      text: setNewName('email', i.rule),
    }))
  }
  const init = async () => {
    const res = await getAllNoteSet()
    dispatch(
      setConfiguration(
        initSet(res.im.filter((i: any) => i.module !== 'product')),
      ),
    )
    dispatch(setEmailConfiguration(initEmailSet(res.mail)))
    const res2 = await getMyAllNoteSet()
    dispatch(
      setMyConfiguration(
        res2.list.filter((i: any) => {
          return !String(i).startsWith('2')
        }),
      ),
    )
    dispatch(
      setMyEmailConfiguration(
        res2.list.filter((i: any) => {
          return String(i).startsWith('2')
        }),
      ),
    )
  }

  useEffect(() => {
    init()
    init2()
  }, [])
  useEffect(() => {
    if (wsData) {
      sendMsg()
    }
  }, [wsData])

  return (
    <div
      style={{
        cursor: 'pointer',
      }}
      onClick={() => {
        dispatch(changeVisible(!isVisible))
        dispatch(changeVisibleFilter(false))
      }}
    >
      <Badge size="small" offset={[-2, 1]} count={all}>
        <CommonIconFont color="var(--neutral-n2)" size={24} type="bell" />
      </Badge>
    </div>
  )
}

export default SiteNotifications
