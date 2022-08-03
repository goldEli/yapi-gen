import styled from '@emotion/styled'
import { Modal, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import IconFont from './IconFont'

interface Props {
  isVisible: boolean
  text: string
  onChangeVisible(): void
  onConfirm(): void
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
})

const ModalFooter = styled(Space)({
  marginTop: 12,
  display: 'flex',
  justifyContent: 'flex-end',
})

const DeleteConfirm = (props: Props) => {
  return (
    <Modal
      visible={props.isVisible}
      title={false}
      footer={false}
      bodyStyle={{ padding: '16px 24px' }}
      closable={false}
      width={420}
      maskClosable={false}
      destroyOnClose
    >
      <ModalHeader>
        <Title>
          <IconFont style={{ fontSize: 24 }} type="Warning" />
          <div>删除确认</div>
        </Title>
        <IconFont
          style={{ fontSize: 16, color: '#323233' }}
          onClick={props.onChangeVisible}
          type="close"
        />
      </ModalHeader>
      <ModalContent>{props.text}</ModalContent>
      <ModalFooter size={16}>
        <Button onClick={props.onChangeVisible}>取消</Button>
        <Button type="primary" onClick={props.onConfirm}>
          确认
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteConfirm
