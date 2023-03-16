// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
import { Modal, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'
import CommonButton from './CommonButton'

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  font-weight: 500;
  height: 56px;
  padding: 0 13px 0 24px;
`

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 20px 0 24px',
})
const ModalStyle = styled(Modal)`
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
interface ModalProps {
  width?: number | string
  isVisible: boolean
  title?: string
  onClose?(): void
  children?: any
  onConfirm?(): any
  confirmText?: string
  hasFooter?: any
  isShowFooter?: boolean
  hasTop?: any
}

const CommonModal = (props: any) => {
  const [t] = useTranslation()
  return (
    <ModalStyle
      footer={false}
      open={props?.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: '0 4px 0 0' }}
      width={props?.width || 528}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
    >
      <ModalHeader>
        <span>{props?.title}</span>
        <Space size={4}>
          {props.hasTop}
          <CloseWrap onClick={props?.onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </Space>
      </ModalHeader>
      <div>{props?.children}</div>
      {!props?.isShowFooter && (
        <>
          {props?.hasFooter}
          {!props.hasFooter && (
            <ModalFooter size={16}>
              <CommonButton type="secondary" onClick={props?.onClose}>
                {t('common.cancel')}
              </CommonButton>
              <CommonButton type="primary" onClick={props?.onConfirm}>
                {t('common.confirm')}
              </CommonButton>
            </ModalFooter>
          )}
        </>
      )}
    </ModalStyle>
  )
}

export default CommonModal
