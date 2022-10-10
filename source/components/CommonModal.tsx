/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
import { Modal, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 16,
  color: '#323233',
  fontWeight: '500',
  height: 56,
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
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
}

const CommonModal = (props: ModalProps) => {
  const [t] = useTranslation()
  return (
    <Modal
      footer={false}
      visible={props?.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: '0 24px' }}
      width={props?.width || 420}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
    >
      <ModalHeader>
        <span>{props?.title}</span>
        <IconFont
          onClick={props?.onClose}
          style={{ cursor: 'pointer' }}
          type="close"
        />
      </ModalHeader>
      <div>{props?.children}</div>
      {props?.isShowFooter ? null : (
        <>
          {props?.hasFooter
            ? props?.hasFooter
            : (
                <ModalFooter size={16}>
                  <Button onClick={props?.onClose}>{t('common.cancel')}</Button>
                  <Button onClick={props?.onConfirm} type="primary">
                    {props?.confirmText ? props?.confirmText : '确定'}
                  </Button>
                </ModalFooter>
              )}
        </>
      )}
    </Modal>
  )
}

export default CommonModal
