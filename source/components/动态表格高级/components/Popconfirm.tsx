import React, { useState } from 'react'
import { Button, Popover } from 'antd'

const Popconfirm = (props: any) => {
  const [visible, setVisible] = useState(false)
  const PropsContent = props.content
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible)
  }
  const hide = () => {
    setVisible(false)
  }

  // content={Content(props.record, hide)}
  // content={() => <Content record={props.record} hide={hide}></Content>}
  return (
    <Popover
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      content={<PropsContent onHide={hide} />}
    >
      {props.children}
    </Popover>
  )
}
export default Popconfirm
