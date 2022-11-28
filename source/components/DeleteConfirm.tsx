// 公用删除确认弹窗

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Modal, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import IconFont from './IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from './StyleCommon'

interface Props {
  isVisible: boolean
  text: string
  onChangeVisible(): void
  onConfirm(): void
  title?: string
}

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Title = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#323233',
  fontSize: 16,
  div: {
    marginLeft: 12,
  },
})

const ModalContent = styled.div({
  color: '#646566',
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
    >
      <ModalHeader>
        <Title>
          <IconFont style={{ fontSize: 24, color: '#FA9746' }} type="Warning" />
          <div>{props.title ? props.title : t('components.deleteConfirm')}</div>
        </Title>
        <CloseWrap width={32} height={32} onClick={props?.onChangeVisible}>
          <IconFont style={{ fontSize: 16 }} type="close" />
        </CloseWrap>
      </ModalHeader>
      <ModalContent>{props.text}</ModalContent>
      <ModalFooter size={16}>
        <Button onClick={props.onChangeVisible}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={props.onConfirm}>
          {t('common.confirm')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirm
