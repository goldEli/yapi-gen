/* eslint-disable no-negated-condition */
/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Badge, Checkbox } from 'antd'
import { useState } from 'react'
import { About, GrepContent, HoverWrap, Name, Time, Time2, Wrap } from './style'
import dayjs from 'dayjs'
import { useDispatch, useSelector } from '@store/index'
import { css } from '@emotion/css'
import { Editor } from 'ifunuikit'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { getMessage } from '@/components/Message'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setProjectWarningModal } from '@store/project'

const ContentItem = (props: any) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { send_user, msg_body, create_time, read, id, custom_data } = props.item
  const [choose, setChoose] = useState(false)
  const cha = useSelector(store => store.user.loginInfo.timeDiff)

  function formatMsgTime(time: number) {
    const dateTime = new Date(time + cha)
    const millisecond = dateTime.getTime()
    const now = new Date()
    const nowNew = now.getTime()
    let milliseconds = 0
    let timeSpanStr
    milliseconds = nowNew - millisecond
    if (milliseconds <= 1000 * 60 * 1) {
      // 小于一分钟展示为刚刚
      timeSpanStr = t('other.gangang')
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      // 大于一分钟小于一小时展示为分钟
      timeSpanStr = t('other.minBefore', {
        number: Math.round(milliseconds / (1000 * 60)),
      })
    } else if (
      1000 * 60 * 60 * 1 < milliseconds &&
      milliseconds <= 1000 * 60 * 60 * 24
    ) {
      // 大于一小时小于一天展示为小时
      timeSpanStr = t('other.hourBefore', {
        number: Math.round(milliseconds / (1000 * 60 * 60)),
      })
    } else {
      timeSpanStr = dayjs.unix(time / 1000).format('YYYY-MM-DD HH:mm:ss')
    }
    return timeSpanStr
  }

  const change = () => {
    setChoose(true)
    props.setReads([id])
  }

  function formateBlue(str: string, url?: string) {
    if (url) {
      return str.concat(
        '',
        `<a  class="dsds-my"
              href="${url}" target="_target">${t('other.checkTo')}</a>`,
      )
    }

    return str
  }

  // 跳转到员工概况
  const onToEmployee = (e: any, body: any) => {
    e.stopPropagation()

    if (!body?.user_id) {
      // 历史数据
      getMessage({
        type: 'warning',
        msg: t('viewingHistoricalDataIsNotCurrently'),
      })
    } else if (body?.has_permission === 2) {
      // 是否有权限
      getMessage({ type: 'warning', msg: t('noPermissionToViewYet') })
    } else {
      // EmployeeProfile
      const params = encryptPhp(
        JSON.stringify({
          user_id: body.user_id,
        }),
      )
      navigate(`/EmployeeProfile?data=${params}`)
    }
  }

  // // 点击打开项目预警
  // const onOpenWaring = () => {
  //   if (!['1207', '2207'].includes(props.item?.custom_type)) return
  //   dispatch(
  //     setProjectWarningModal({
  //       visible: true,
  //       id: Number(props.item?.custom_data?.project_id),
  //     }),
  //   )
  // }

  return (
    <Wrap
      bor={props.bor}
      greps={choose}
      onClick={() => (read === 1 || choose ? null : change())}
    >
      <div
        style={{
          marginRight: '8px',
        }}
      >
        <Badge offset={[-1, 4]} dot={read === 0 && !choose}>
          <CommonUserAvatar isBorder avatar={send_user.head} />
        </Badge>
      </div>
      {/* onClick={onOpenWaring} */}
      <HoverWrap style={{ flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Name className={String(read === 1 ? 'read' : 'unread')}>
            {send_user.nickname}
          </Name>
          <Time>{formatMsgTime(create_time * 1000)}</Time>
          {read === 0 && (
            <Time2>
              <Checkbox checked={choose} />
            </Time2>
          )}
        </div>
        <div className="msgTitle 111">
          <div style={{ alignSelf: 'start' }}>
            <CommonUserAvatar avatar={msg_body.optHeader} />
          </div>

          <About className={String(read === 1 ? 'read' : 'unread')}>
            {msg_body?.username ? (
              <>
                <span className="name" onClick={e => onToEmployee(e, msg_body)}>
                  {msg_body?.username}
                </span>
                {msg_body?.title_msg}
              </>
            ) : (
              msg_body.title
            )}
          </About>
        </div>

        <GrepContent status={read}>
          {/* <span
            className={tmgCss}
            dangerouslySetInnerHTML={{
              __html: formateBlue(msg_body.content, custom_data.linkWebUrl),
            }}
          /> */}
          <Editor
            color="transparent"
            value={formateBlue(msg_body.content, custom_data.linkWebUrl)}
            getSuggestions={() => []}
            readonly
          />
        </GrepContent>
      </HoverWrap>
    </Wrap>
  )
}

export default ContentItem
