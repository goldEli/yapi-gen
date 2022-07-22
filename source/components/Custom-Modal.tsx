import React from 'react'
import { Modal } from 'antd'

export const CustomModal = (props: any) => {
  return (
    <Modal
      footer={null}
      onCancel={props.close()}
      title="显示字段配置"
      visible={props.visible}
    >
      <div style={{ display: 'flex' }}>{props.data2.age}</div>
    </Modal>
  )
}
