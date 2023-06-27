/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Badge, Checkbox } from 'antd'
import { useState } from 'react'
import { About, GrepContent, HoverWrap, Name, Time, Time2, Wrap } from './style'
import dayjs from 'dayjs'
import { useSelector } from '@store/index'
import { css } from '@emotion/css'
import { Editor } from '@xyfe/uikit'

const tmgCss = css`
  img {
    width: 100%;
    object-fit: contain;
  }
`

const ContentItem = (props: any) => {
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
      timeSpanStr = '刚刚'
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
      // 大于一分钟小于一小时展示为分钟
      timeSpanStr = `${Math.round(milliseconds / (1000 * 60))}分钟前`
    } else if (
      1000 * 60 * 60 * 1 < milliseconds &&
      milliseconds <= 1000 * 60 * 60 * 24
    ) {
      // 大于一小时小于一天展示为小时
      timeSpanStr = `${Math.round(milliseconds / (1000 * 60 * 60))}小时前`
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
    // console.log(url)

    if (url) {
      return str.concat(
        '',
        `<a  
        href="${url}" target="_target">请前往查看</a>`,
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
          <Time>{formatMsgTime(create_time * 1000)}</Time>
          {read === 0 && (
            <Time2>
              <Checkbox checked={choose} />
            </Time2>
          )}
        </div>
        <div className="msgTitle">
          {msg_body.optHeader ? (
            <CommonUserAvatar avatar={msg_body.optHeader} />
          ) : null}

          <About className={String(read === 1 ? 'read' : 'unread')}>
            {msg_body.title}
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
