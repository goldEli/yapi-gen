/* eslint-disable require-unicode-regexp */
/* eslint-disable react/jsx-no-leaked-render */
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
import { Badge, message, notification } from 'antd'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import {
  getAllNoteSet,
  getContactStatistics,
  getMsg_list,
  getMyAllNoteSet,
} from '@/services/SiteNotifications'
import { useTranslation } from 'react-i18next'
import { TextChange } from '@/components/TextChange/TextChange'
import NoteModal from '@/components/NoteModal'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { setProjectInfo, setProjectWarningModal } from '@store/project'

const mcs = css`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; // 显示2行
  -webkit-box-orient: vertical;
  word-break: break-all;
`

export const FeedBadge = styled(Badge)`
  position: absolute;
  right: 12px;
`

const SiteNotifications = (props: any, ref: any) => {
  const { loginInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [first, setFirst] = useState(false)
  const [first2, setFirst2] = useState({})
  const [t] = useTranslation()
  const { wsData, creatWebSocket } = useWebsocket()
  const dispatch = useDispatch()
  const { isVisible, all } = useSelector(store => store.siteNotifications)
  const isRefresh = useSelector(store => store.user.isRefresh)
  const { layoutSideCollapse } = useSelector(store => store.global)
  const { currentMenu, menuIconList } = useSelector(store => store.user)
  const isDesktopDevice = /Windows|Macintosh|X11|Android|webOS/i.test(
    navigator.userAgent,
  )
  console.log(isDesktopDevice, 'isDesktopDevice')

  const init2 = async () => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 2000))

    const res = await getContactStatistics()
    let num = 0
    res.list.slice(1, 6).forEach((i: any) => {
      num += Number(i.nread)
    })

    dispatch(changeNumber(num))
  }
  console.log(navigator.userAgent, 'navigator.userAgent')

  const sendMsg = () => {
    if (wsData?.data?.customData?.noticeStyle === '2') {
      const element: any = document.getElementsByClassName('ant-message')

      message.success({
        icon: <span></span>,
        duration: 0,

        content: <TextChange text={wsData.data.msgBody.title} />,
        className: 'custom-class',
        onClick: () => {
          // message.destroy('infoKey')
          for (let i = 0; i < element.length; i++) {
            const childNode = element[i]
            childNode.remove()
          }

          // dispatch(changeVisible(!isVisible))
        },
      })
    } else if (
      wsData?.data?.customData?.noticeStyle === '1' &&
      !(
        wsData?.data?.customType === '1207' ||
        wsData?.data?.customType === '2207'
      )
    ) {
      setFirst(true)
      setFirst2({
        customData: wsData.data.customData,
        msgBody: wsData.data.msgBody,
        id: wsData.data.msgIds,
      })
    }
    if (isDesktopDevice) {
      Notification.requestPermission().then(result => {
        if (result === 'granted') {
          const n: any = new Notification(wsData.data.msgBody.title, {
            body: wsData.data.msgBody.content,
          })
          n.onclick = function () {
            if (wsData.data.customData.linkWebUrl) {
              // 当点击事件触发，打开指定的url
              window.open(wsData.data.customData.linkWebUrl)
            }
          }
        } else {
          notification.open({
            icon: <CommonIconFont color="#6688FF" size={20} type="bell" />,
            className: 'notification-my',
            maxCount: 1,
            placement: 'bottomLeft',
            message: (
              <div style={{ fontFamily: 'SiYuanMedium', marginLeft: '-17px' }}>
                {wsData.data.msgBody.title}
              </div>
            ),
            description: (
              <div className={mcs} style={{ marginLeft: '-12px' }}>
                {wsData.data.msgBody.content}
              </div>
            ),
            onClick: () => {
              if (wsData.data.customData.linkWebUrl) {
                // 当点击事件触发，打开指定的url
                window.open(wsData.data.customData.linkWebUrl)
              }
            },
          })
        }
      })
    }

    init2()
  }
  const setNewName = (type: string, code: number) => {
    let name = ''
    if (type === 'project') {
      switch (code) {
        case 130:
          name = t('assign_me_tasks')
          break
        case 131:
          name = t('pending_my_approval')
          break
        case 132:
          name = t('me_in_the_comments')
          break
        case 133:
          name = t('created_the_task')
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'system') {
      switch (code) {
        case 150:
          name = t('system_notice')
          break
        case 151:
          name = t('Reminder')
          break
        case 152:
          name = t('my_approval')
          break
        case 153:
          name = t('to_do')
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'calendar') {
      switch (code) {
        case 170:
          name = t('calendar_reminder')
          break
        case 171:
          name = t('Invitations')
          break
        case 132:
          name = t('mentioned_in_comments')
          break
        case 133:
          name = t('created_tasks')
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'report') {
      switch (code) {
        case 190:
          name = t('who_submitted_the_report')
          break
        case 191:
          name = t('mentioned_in_comments')
          break
        case 192:
          name = t('report_reminder')
          break
        case 133:
          name = t('created_the_task')
          break

        default:
          name = ''
          break
      }
    }
    if (type === 'email') {
      switch (code) {
        case 201:
          name = t('to_do')
          break
        case 202:
          name = t('me_in_the_comments')
          break
        case 203:
          name = t('waiting_for_my_approval')
          break
        case 204:
          name = t('report_reminder')
          break
        case 205:
          name = t('who_submitted_the_report')
          break
        case 206:
          name = t('calendar_reminder')
          break
        case 207:
          name = t('invitationss')
          break
        case 208:
          name = t('system_announcement')
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
      obj.name = t('pm')
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
      obj.name = t('systematic_notification')
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
      obj.name = t('schedule_management')
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
      obj.name = t('work_report')
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
    return values?.map((i: any) => ({
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
    if (loginInfo) {
      creatWebSocket(loginInfo?.comAuth?.token, loginInfo?.id)
    }
  }, [loginInfo])

  useEffect(() => {
    init()
    init2()
  }, [isRefresh])

  // 更新页面小铃铛预警任务数量
  const updateWarningCount = (data: any) => {
    if (data?.customType === '1207' || data?.customType === '2207') {
      dispatch(
        setProjectInfo({
          ...projectInfo,
          project_warring_info: {
            ...(projectInfo.project_warring_info || {}),
            warring_count: data?.customData?.warning_count,
            noticeStyle: data?.customData?.noticeStyle,
            customType: data?.customType,
          },
        }),
      )
    }
  }

  useEffect(() => {
    if (
      (wsData?.data?.customType === '1207' ||
        wsData?.data?.customType === '2207') &&
      projectInfo?.id === Number(wsData?.data?.customData?.project_id) &&
      (window.location.href.includes('/ProjectManagement/') ||
        window.location.href.includes('/SprintProjectManagement/')) &&
      !(
        window.location.href.includes('/SprintProjectManagement/Setting') ||
        window.location.href.includes('/ProjectManagement/Mine') ||
        window.location.href.includes(
          '/SprintProjectManagement/DemandSetting',
        ) ||
        window.location.href.includes('/ProjectManagement/Setting') ||
        window.location.href.includes('/ProjectManagement/Mine') ||
        window.location.href.includes('/ProjectManagement/DemandSetting') ||
        window.location.href.includes('/ProjectManagement/Project') ||
        window.location.href.includes('/SprintProjectManagement/Project')
      )
    ) {
      // 更新页面小铃铛预警任务数量
      dispatch(setProjectWarningModal({ visible: true }))
      updateWarningCount(wsData?.data)
    } else {
      sendMsg()
    }
  }, [wsData])

  useImperativeHandle(
    ref,
    () => {
      return {
        first,
      }
    },
    [first],
  )

  return (
    <>
      {!layoutSideCollapse && (
        <Badge size="small" offset={[-2, 1]} count={all}>
          <CommonIconFont
            type={
              currentMenu?.id === props?.item.id
                ? menuIconList?.filter((k: any) =>
                    String(props?.item.url).includes(k.key),
                  )[0]?.active
                : menuIconList?.filter((k: any) =>
                    String(props?.item.url).includes(k.key),
                  )[0]?.normal
            }
            size={24}
            color="var(--neutral-n2)"
          />
        </Badge>
      )}
      {layoutSideCollapse && (
        <>
          <CommonIconFont
            type={
              currentMenu?.id === props?.item.id
                ? menuIconList?.filter((k: any) =>
                    String(props?.item.url).includes(k.key),
                  )[0]?.active
                : menuIconList?.filter((k: any) =>
                    String(props?.item.url).includes(k.key),
                  )[0]?.normal
            }
            size={24}
            color="var(--neutral-n2)"
          />
          <FeedBadge size="small" offset={[-2, 1]} count={all} />
        </>
      )}
      <NoteModal
        onClose={() => setFirst(false)}
        data={first2}
        isVisible={first}
      />
    </>
  )
}

export default forwardRef(SiteNotifications)
