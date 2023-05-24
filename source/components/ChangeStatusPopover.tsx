/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */

// 公用流转状态弹窗

import { Popover } from 'antd'
import { ReactNode, useState } from 'react'
import { ShapeContent } from './Shape'

interface Props {
  isShow?: boolean
  children: ReactNode
  onChangeStatus(value: any): void
  record: any
  projectId?: any
  isCanOperation?: boolean
}

const ChangeStatusPopover = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)

  const onChangeStatus = (value: any) => {
    props.onChangeStatus(value)
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
      overlayStyle={{ width: 683 }}
      // 设置宽度是用于弹窗自适应宽度后会左右摆动问题
      content={
        props?.isCanOperation ? (
          <ShapeContent
            onTap={onChangeStatus}
            onClosePopover={() => setPopoverVisible(false)}
            row={props?.record}
            record={{
              id: props.record?.id,
              project_id: props?.projectId,
              status: {
                id: props.record?.status?.id,
                can_changes: props?.record?.status?.can_changes,
              },
            }}
          />
        ) : null
      }
    >
      {props.children}
    </Popover>
  )
}

export default ChangeStatusPopover
