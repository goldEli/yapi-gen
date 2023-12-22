// 公用删除确认弹窗

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Modal, Space } from 'antd'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'
import CommonButton from './CommonButton'
import { useSelector } from '@store/index'

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
  okText?: string
  cancelText?: string
  width?: number
  // 是否不带图标
  hasIcon?: boolean
  isRed?: boolean
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
  const { fullScreen } = useSelector(store => store.kanBan)
  return (
    <ModalStyle
      visible={props.isVisible}
      title={false}
      footer={false}
      bodyStyle={{ padding: '20px 0px 0px 0px' }}
      closable={false}
      width={props?.width ?? 420}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      okText={props?.okText}
      cancelText={props?.cancelText}
      getContainer={
        fullScreen
          ? () => document.querySelector('.kanBanFullScreenBox') as any
          : // eslint-disable-next-line no-undefined
            undefined
      }
    >
      <ModalHeader>
        <Title>
          {!props.hasIcon && (
            <IconFont
              style={{ fontSize: 24, color: 'var(--function-warning)' }}
              type="Warning"
            />
          )}

          <div
            style={{
              width: '260px',
              display: 'inline-block',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              marginLeft: props?.hasIcon ? 0 : 12,
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
      <ModalContent style={{ paddingLeft: props?.hasIcon ? 24 : 60 }}>
        {props.children ?? props.text}
      </ModalContent>
      <ModalFooter size={16}>
        {!props?.notCancel && (
          <CommonButton onClick={props.onChangeVisible} type="light">
            {props?.cancelText ? props?.cancelText : t('cancel')}
          </CommonButton>
        )}
        <CommonButton
          type={props?.isRed ? 'dangerDel' : 'primary'}
          onClick={props.onConfirm}
        >
          {props?.okText ? props?.okText : t('confirm')}
        </CommonButton>
      </ModalFooter>
    </ModalStyle>
  )
}

export default DeleteConfirm
