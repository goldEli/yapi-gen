import { Modal, Form, Input, DatePicker, Select, Popover } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'

const FormWrap = styled(Form)({
  '.anticon': {
    display: 'flex',
    alignItems: 'flex-start',
    svg: {
      fontSize: 16,
      color: '#969799',
      margin: '3px 8px 0 0',
    },
  },
  '.ant-form-item-label': {
    '> label::after': {
      display: 'none',
    },
    '> label': {
      display: 'flex',
      alignItems: 'flex-start',
    },
    '.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after':
      {
        display: 'inline-block',
        color: '#ff4d4f',
        fontSize: 14,
        content: "'*'",
      },
    '> label::before': {
      display: 'none!important',
    },
  },
  '.ant-form-item': {
    width: '100%',
  },
  '.ant-form-item-control-input': {
    minHeight: 'inherit',
  },
})

interface Props {
  visible: boolean
  onChangeVisible(): void
}

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 4,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
      ? '1px dashed #969799'
      : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
  }),
)

export default (props: Props) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={props.visible}
      width={524}
      footer={false}
      title="创建需求"
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <FormWrap form={form} labelCol={{ span: 6 }}>
        <div style={{ display: 'flex' }}>
          <IconFont type="apartment" />
          <Form.Item label="需求名称" required>
            <Input placeholder="请输入需求名称" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="edit-square" />
          <Form.Item label="需求描述">
            <Input placeholder="编辑器" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="user" />
          <Form.Item label="处理人" required>
            <AddWrap>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="carryout" />
          <Form.Item label="预计时间">
            <DatePicker.RangePicker />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="apartment" />
          <Form.Item label="父需求">
            <AddWrap>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="carryout" />
          <Form.Item label="优先级">
            <Popconfirm
              content={({ onHide }: { onHide: () => void }) => {
                return <LevelContent hide={onHide}></LevelContent>
              }}
            >
              123
            </Popconfirm>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="interation" />
          <Form.Item label="迭代">
            <Select placeholder="请选择" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="id-card" />
          <Form.Item label="抄送人">
            <AddWrap hasColor>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="app-store-add" />
          <Form.Item label="标签">
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="attachment" />
          <Form.Item label="附件">
            <AddWrap>
              <IconFont type="plus" />
              <div>添加</div>
            </AddWrap>
          </Form.Item>
        </div>
      </FormWrap>
    </Modal>
  )
}
