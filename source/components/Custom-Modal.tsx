import React from 'react'
import { Modal } from 'antd'

export const CustomModal = prpps => {
  return (
    <Modal
      footer={null}
      onCancel={prpps.close()}
      title="显示字段配置"
      visible={prpps.visible}
    >
      <div style={{ display: 'flex' }}>{prpps.data2.age}</div>
    </Modal>
  )
}
