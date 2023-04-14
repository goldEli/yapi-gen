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
  const { send_user, msg_body, to_user, create_time, read, id } = props.item
  const [choose, setChoose] = useState(false)

  function formatTime(params: number) {
    let time = ''
    const now = new Date().valueOf() / 1000
    const difference = now - params
    console.log()
    if (difference < 7200) {
      time = '两小时前'
    } else {
      time = dayjs.unix(params).format('YYYY-MM-DD HH:mm:ss')
    }
    return time
  }

  return (
    <div>
      <Wrap onClick={() => setChoose(true)}>
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
            <Name>{send_user}</Name>
            {/* <Tip>在评论中@了您</Tip> */}
            <Time>{formatTime(create_time)}</Time>
            {read === 0 && (
              <Time2 onClick={() => props.setReads([id])}>
                <Radio checked={choose} />
              </Time2>
            )}
          </div>
          {/* <div
            style={{ display: 'flex', alignItems: 'center', margin: '5px 0px' }}
          >
            <CommonIconFont color="var(--neutral-n3)" type="folder-open-nor" />
            <About>关于XXXX产品V3.0.0的开发计划</About>
          </div> */}

          <GrepContent>
            <span>{msg_body.content}</span>
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
    </div>
  )
}

export default ContentItem
