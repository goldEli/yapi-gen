// 公用删除确认弹窗

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Modal, Space } from 'antd'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'
import CommonButton from './CommonButton'

interface Props {
  isVisible: boolean
  title?: string
  text?: string
  onChangeVisible?(): void
  onConfirm(): void
  children?: any
  // 没有取消按钮
  notCancel?: boolean
}

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Title = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  font-size: 16px;

  div {
    margin-left: 12px;
    font-weight: 500;
  }
`

const ModalContent = styled.div({
  color: 'var(--neutral-n2)',
  fontSize: 14,
  marginTop: 12,
  paddingLeft: 36,
  paddingRight: 8,
})

const ModalFooter = styled(Space)({
  marginTop: 12,
  display: 'flex',
  justifyContent: 'flex-end',
  paddingRight: 8,
})

const DeleteConfirm = (props: Props) => {
  const [t] = useTranslation()
  return (
    <Modal
      visible={props.isVisible}
      title={false}
      footer={false}
      bodyStyle={{ padding: '16px 16px 16px 24px' }}
      closable={false}
      width={420}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
    >
      <ModalHeader>
        <Title>
          <IconFont style={{ fontSize: 24, color: '#FA9746' }} type="Warning" />
          <div>{props.title ? props.title : '删除确认'}</div>
        </Title>
        {!props?.notCancel && (
          <CloseWrap width={32} height={32} onClick={props?.onChangeVisible}>
            <IconFont style={{ fontSize: 20 }} type="close" />
          </CloseWrap>
        )}
      </ModalHeader>
      <ModalContent>{props.children ?? props.text}</ModalContent>
      <ModalFooter size={16}>
        {!props?.notCancel && (
          <CommonButton onClick={props.onChangeVisible} type="secondary">
            取消
          </CommonButton>
        )}
        <CommonButton type="primary" onClick={props.onConfirm}>
          确定
        </CommonButton>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirm
