import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Modal, Select } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#323233',
  fontSize: 14,
  svg: {
    fontSize: 16,
  },
})

const ModalContent = styled(Select)({
  margin: '16px 0',
  height: 400,
  borderRadius: 6,
  boxSizing: 'border-box',
  border: '1px solid #EBEDF0',
  padding: 24,
  width: '100%',
})

const ModalFooter = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

interface Props {
  value: boolean
  onChangeValue(): void
}

const AddMember = (props: Props) => {
  return (
    <Modal
      visible={props.value}
      title={false}
      footer={false}
      bodyStyle={{ padding: 24 }}
      width={700}
      closable={false}
    >
      <ModalHeader>
        <span>添加项目成员</span>
        <IconFont onClick={props.onChangeValue} type="close" />
      </ModalHeader>
      <ModalContent showArrow={false} mode="multiple" showSearch />
      <ModalFooter>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#323233', marginRight: 16 }}>
            加入权限组
          </span>
          <Select style={{ width: 192 }} />
        </div>
        <Button type="primary">导入成员</Button>
      </ModalFooter>
    </Modal>
  )
}

export default AddMember
