/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/boolean-prop-naming */
import { useState, type ReactNode } from 'react'
import { Popover } from 'antd'

type PopConfirmProps = {
  children: ReactNode
  content: any
  record?: Record<string, string | number>
  show?: boolean

  // onHide
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
      getPopupContainer={n => props.show ? n : document.body}
      content={<PropsContent onHide={hide} />}
    >
      {props.children}
    </Popover>
  )
}

export default Popconfirm
