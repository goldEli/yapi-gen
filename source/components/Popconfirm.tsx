import { useState, type ReactNode } from 'react'
import { Popover } from 'antd'

type PopConfirmProps = {
  children: ReactNode
  content: any
  record?: Record<string, string | number>
  isShow?: boolean

  // onHide
}
const Popconfirm = (props: PopConfirmProps) => {
  const [visible, setVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
      getPopupContainer={n => n}
      content={<PropsContent onHide={hide} />}
      destroyTooltipOnHide
    >
      {props.children}
    </Popover>
  )
}

export default Popconfirm
