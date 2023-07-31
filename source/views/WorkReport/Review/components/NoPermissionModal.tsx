import styled from '@emotion/styled'
import React from 'react'
import imgSrc from '../image/assistantExampleImage.png'
import CommonModal from '@/components/CommonModal'
import { getMessage } from '@/components/Message'

const NoPermissionWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NoPermissionText = styled.div`
  font-size: 14px;
  font-family: SiYuanRegular;
  color: var(--neutral-n3);
  margin: 24px 0px;
`

interface NoPermissionProps {
  visible: boolean
  close(): void
}

const NoPermissionModal = (props: NoPermissionProps) => {
  const { close, visible } = props
  const confirm = () => {
    getMessage({
      type: 'success',
      msg: '已通知管理员开启该功能',
    })
  }

  return (
    <CommonModal
      width={640}
      title="日报助手"
      isVisible={visible}
      onClose={close}
      onConfirm={confirm}
      confirmText="开通该功能"
    >
      <NoPermissionWrap>
        <img width={466} src={imgSrc} />
        <NoPermissionText>请联系管理员开通该功能</NoPermissionText>
      </NoPermissionWrap>
    </CommonModal>
  )
}

export default NoPermissionModal
