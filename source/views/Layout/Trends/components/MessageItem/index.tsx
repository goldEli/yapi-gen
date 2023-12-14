import CommonIconFont from '@/components/CommonIconFont'
import { ItemBox } from '../../AllNotes/style'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
const { Text } = Typography

type MessageItemProps = {
  item: any
  onRead(id: string): any
  formatMsgTime(time: number): string
  onToEmployee(e: any, body: any): void
}

const MessageItem = (props: MessageItemProps) => {
  const { item, onRead, formatMsgTime, onToEmployee } = props
  const itemRef = useRef<any>()
  const [isFlexStart, setIsFlexStart] = useState(false)
  useEffect(() => {
    if (itemRef.current) {
      if (itemRef.current?.getBoundingClientRect()?.height > 30) {
        setIsFlexStart(true)
      }
    }
  }, [])
  return (
    <ItemBox
      hasClick={item?.read === 2}
      hasLink={item?.custom_data?.linkWebUrl}
      isFlexStart={isFlexStart}
      key={item.id}
    >
      {item?.msg_body?.username ? (
        <CommonUserAvatar size="small" avatar={item.msg_body.optHeader} />
      ) : (
        <div className="icons">
          <CommonIconFont type="bell-sel" color="#FA9746" size={16} />
        </div>
      )}

      {item?.msg_body?.username ? (
        <Text
          className="name"
          ellipsis={{ tooltip: item?.msg_body?.username }}
          onClick={(e: any) => {
            onToEmployee(e, item?.msg_body)
          }}
        >
          {item?.msg_body?.username}
        </Text>
      ) : (
        <span className="system">【系统消息】</span>
      )}
      <a
        className="content"
        ref={itemRef}
        target="_target"
        href={item?.custom_data?.linkWebUrl}
        onClick={() => {
          if (item?.read === 2) {
            return
          }
          onRead(item.id)
        }}
      >
        {item?.msg_body?.username
          ? item?.msg_body?.content?.replace(item?.msg_body?.username, '')
          : item?.msg_body?.content}
      </a>
      <div className="time">{formatMsgTime(item.create_time * 1000)}</div>
    </ItemBox>
  )
}

export default MessageItem
