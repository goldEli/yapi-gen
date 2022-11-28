// 公用的popover,例：修改修改优先级

/* eslint-disable @typescript-eslint/naming-convention */
import { useState, type ReactNode } from 'react'
import { Popover } from 'antd'

type PopConfirmProps = {
  children: ReactNode
  content: any
  record?: Record<string, string | number>
  isShow?: boolean
}
const Popconfirm = (props: PopConfirmProps) => {
  const [visible, setVisible] = useState(false)
  const PropsContent = props.content
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible)
  }
  const hide = () => {
    setVisible(false)
  }

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      getPopupContainer={n => (props.isShow ? n : document.body)}
      content={<PropsContent onHide={hide} />}
      destroyTooltipOnHide
    >
      {props.children}
    </Popover>
  )
}

export default Popconfirm
