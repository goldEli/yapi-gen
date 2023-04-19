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

const ContentItem = (props: any) => {
  const { send_user, msg_body, to_user, create_time, read, id, custom_data } =
    props.item
  const [choose, setChoose] = useState(false)

  function formatTime(params: number) {
    let time = ''
    const now = new Date().valueOf() / 1000
    const difference = now - params

    if (difference < 7200) {
      time = '两小时前'
    } else {
      time = dayjs.unix(params).format('YYYY-MM-DD HH:mm:ss')
    }
    return time
  }
  const change = () => {
    setChoose(true)
    props.setReads([id])
  }

  function formateBlue(str: string, url?: string) {
    if (str.includes('请前往查看')) {
      return str.replace(
        '请前往查看',
        `<a href="${url}" target="_blank">请前往查看</a>`,
      )
    }

    return str
  }

  return (
    <Wrap greps={choose} onClick={() => (choose ? null : change())}>
      <div
        style={{
          marginRight: '12px',
        }}
      >
        <Badge offset={[-1, 4]} dot={read === 0}>
          <CommonUserAvatar avatar={to_user.head} />
        </Badge>
      </div>
      <HoverWrap style={{ flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Name>{send_user.username}</Name>
          {/* <Name>问题字段</Name> */}
          {/* <Tip>在评论中@了您</Tip> */}
          <Time>{formatTime(create_time)}</Time>
          {read === 0 && (
            <Time2>
              <Radio checked={choose} />
            </Time2>
          )}
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', margin: '5px 0px' }}
        >
          <CommonIconFont color="var(--neutral-n3)" type="folder-open-nor" />
          <About>{msg_body.title}</About>
        </div>

        <GrepContent>
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
