/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

// 公用优先级状态弹窗

import { Popover } from 'antd'
import { ReactNode, useState } from 'react'
import { LevelContent } from './Level'

interface Props {
  isShow?: boolean
  children: ReactNode
  onChangePriority?(item: any): void
  record: any
  isCanOperation?: boolean
  projectId?: any
  onCurrentDetail?(item: any): void
}

const ChangePriorityPopover = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const onChangePriority = (item: any) => {
    props.onChangePriority?.(item)
    setPopoverVisible(false)
  }

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      placement="bottomLeft"
      trigger="click"
      destroyTooltipOnHide
      getPopupContainer={n => (props.isShow ? n : document.body)}
      content={
        props?.isCanOperation && (
          <LevelContent
            onTap={onChangePriority}
            onHide={() => setPopoverVisible(false)}
            record={props?.record}
            projectId={props?.projectId}
            onCurrentDetail={props?.onCurrentDetail}
          />
        )
      }
    >
      {props.children}
    </Popover>
  )
}

export default ChangePriorityPopover
