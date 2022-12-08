// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
import { Modal, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 16,
  color: '#323233',
  fontWeight: '500',
  height: 56,
  padding: '0 16px 0 26px',
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 24px',
})

interface ModalProps {
  width?: number
  isVisible: boolean
  title?: string
  onClose?(): void
  children?: any
  onConfirm?(): void
  confirmText?: string
  hasFooter?: any
  isShowFooter?: boolean
  hasTop?: any
}

const CommonModal = (props: ModalProps) => {
  const [t] = useTranslation()
  return (
    <Modal
      footer={false}
      visible={props?.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: 0 }}
      width={props?.width || 420}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
    >
      <ModalHeader>
        <span>{props?.title}</span>
        <Space size={4}>
          {props.hasTop}
          <CloseWrap onClick={props?.onClose} width={32} height={32}>
            <IconFont
              style={{
                fontSize: '20px',
              }}
              type="close"
            />
          </CloseWrap>
        </Space>
      </ModalHeader>
      <div style={{ padding: '0 4px 0 24px' }}>{props?.children}</div>
      {!props?.isShowFooter && (
        <>
          {props?.hasFooter}
          {!props.hasFooter && (
            <ModalFooter size={16}>
              <Button onClick={props?.onClose}>{t('common.cancel')}</Button>
              <Button onClick={props?.onConfirm} type="primary">
                {props?.confirmText ? props?.confirmText : t('common.confirm')}
              </Button>
            </ModalFooter>
          )}
        </>
      )}
    </Modal>
  )
}

export default CommonModal
