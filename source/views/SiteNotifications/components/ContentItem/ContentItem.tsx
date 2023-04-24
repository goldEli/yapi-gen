/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import { Badge, Radio } from 'antd'
import React, { useState } from 'react'
import {
  About,
  GrepContent,
  HoverWrap,
  Name,
  Time,
  Time2,
  Tip,
  Wrap,
  Wrap2,
} from './style'
import dayjs from 'dayjs'
import { useSelector } from '@store/index'

const ContentItem = (props: any) => {
  const { send_user, msg_body, to_user, create_time, read, id, custom_data } =
    props.item
  const [choose, setChoose] = useState(false)
  const cha = useSelector(store => store.user.loginInfo.timeDiff)
  // function formatTime(params: number) {
  //   let time = ''
  //   const now = new Date().valueOf() / 1000
  //   const difference = now - params

  //   if (difference < 7200) {
  //     time = '两小时前'
  //   } else {
  //     time = dayjs.unix(params).format('YYYY-MM-DD HH:mm:ss')
  //   }
  //   return time
  // }
  function formatMsgTime(timespan: number) {
    var dateTime = new Date(timespan + cha)
    var year = dateTime.getFullYear()
    var month = dateTime.getMonth() + 1
    var day = dateTime.getDate()
    var hour = dateTime.getHours()
    var minute = dateTime.getMinutes()
    // var second = dateTime.getSeconds()
    var millisecond = dateTime.getTime()
    var now = new Date()
    var nowNew = now.getTime()
    var milliseconds = 0
    var timeSpanStr
    milliseconds = nowNew - millisecond
    if (milliseconds <= 1000 * 60 * 1) {
      // 小于一分钟展示为刚刚
      timeSpanStr = '刚刚'
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      // 大于一分钟小于一小时展示为分钟
      timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前'
    } else if (
      1000 * 60 * 60 * 1 < milliseconds &&
      milliseconds <= 1000 * 60 * 60 * 24
    ) {
      // 大于一小时小于一天展示为小时
      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
    } else {
      timeSpanStr = dayjs.unix(timespan / 1000).format('YYYY-MM-DD HH:mm:ss')
    }
    return timeSpanStr
  }

  const change = () => {
    setChoose(true)
    props.setReads([id])
  }

  function formateBlue(str: string, url?: string) {
    if (str.includes('请前往查看')) {
      return str.replace(
        '请前往查看',
        `<a href="${url}" target="_self">请前往查看</a>`,
      )
    }

    return str
  }

  return (
    <Wrap
      greps={choose}
      onClick={() => (read === 1 || choose ? null : change())}
    >
      <div
        style={{
          marginRight: '8px',
        }}
      >
        <Badge offset={[-1, 4]} dot={read === 0}>
          <CommonUserAvatar isBorder avatar={send_user.head} />
        </Badge>
      </div>
      <HoverWrap style={{ flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Name className={String(read === 1 ? 'read' : 'unread')}>
            {send_user.nickname}
          </Name>
          {/* <Name>问题字段</Name> */}
          {/* <Tip>在评论中@了您</Tip> */}
          <Time>{formatMsgTime(create_time * 1000)}</Time>
          {read === 0 && (
            <Time2>
              <Radio checked={choose} />
            </Time2>
          )}
        </div>
        <div className="msgTitle">
          <CommonUserAvatar avatar={msg_body.optHeader} />
          <About className={String(read === 1 ? 'read' : 'unread')}>
            {msg_body.title}
          </About>
        </div>

        <GrepContent status={read}>
          <span
            dangerouslySetInnerHTML={{
              __html: formateBlue(msg_body.content, custom_data.linkWebUrl),
            }}
          />
          {/* <span
            style={{
              color: 'var(--auxiliary-text-t1-d2)',
            }}
          >
            前往查看
          </span> */}
        </GrepContent>
      </HoverWrap>
    </Wrap>
  )
}

export default ContentItem
