// 公用删除确认弹窗

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Modal, Space } from 'antd'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'
import CommonButton from './CommonButton'

export interface DeleteConfirmProps {
  isVisible: boolean
  title?: string
  text?: any
  onChangeVisible?: () => void
  onConfirm(): void
  children?: any
  // 没有取消按钮
  notCancel?: boolean
  onCancel?: () => void
  onCancelState?: boolean
}

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  paddingLeft: 24,
  paddingRight: 18,
  fontFamily: 'SiYuanMedium',
})

const Title = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  font-size: 16px;

  div {
    margin-left: 12px;
    font-family: siyuanmedium;
  }
`

const ModalContent = styled.div({
  color: 'var(--neutral-n2)',
  fontSize: 14,
  marginTop: 9,
  paddingLeft: 60,
  paddingRight: 27,
})

const ModalFooter = styled(Space)({
  marginTop: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  height: 80,
  padding: 24,
})
const ModalStyle = styled(Modal)`
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
const DeleteConfirm = (props: DeleteConfirmProps) => {
  const [t] = useTranslation()
  return (
    <ModalStyle
      visible={props.isVisible}
      title={false}
      footer={false}
      bodyStyle={{ padding: '20px 0px 0px 0px' }}
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
          <IconFont
            style={{ fontSize: 24, color: 'var(--function-warning)' }}
            type="Warning"
          />
          <div
            style={{
              width: '260px',
              display: 'inline-block',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {props.title ? props.title : t('confirmationOfDeletion')}
          </div>
        </Title>
        {!props?.notCancel && (
          <CloseWrap
            width={32}
            height={32}
            onClick={() =>
              props?.onCancelState
                ? props?.onCancel?.()
                : props?.onChangeVisible?.()
            }
          >
            <IconFont style={{ fontSize: 20 }} type="close" />
          </CloseWrap>
        )}
      </ModalHeader>
      <ModalContent>{props.children ?? props.text}</ModalContent>
      <ModalFooter size={16}>
        {!props?.notCancel && (
          <CommonButton onClick={props.onChangeVisible} type="light">
            {t('cancel')}
          </CommonButton>
        )}
        <CommonButton type="primary" onClick={props.onConfirm}>
          {t('confirm')}
        </CommonButton>
      </ModalFooter>
    </ModalStyle>
  )
}

export default DeleteConfirm
