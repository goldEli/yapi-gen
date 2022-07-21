import { Modal, Form, Input, DatePicker, Select, Space, Upload } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Editor from '@/components/Editor'
import TagComponent from './TagComponent'
import UploadAttach from './UploadAttach'

const FormWrap = styled(Form)({
  height: 600,
  overflowY: 'auto',
  overflowX: 'hidden',
  '.labelIcon': {
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

const PriorityWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.anticon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
})

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const AddButtonWrap = styled.div({
  height: 32,
  boxSizing: 'border-box',
  borderRadius: 6,
  border: '1px solid #2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2877FF',
  padding: '0 16px',
  cursor: 'pointer',
})

const priorityList = [
  { name: '高', type: 'tall', color: '#ff5c5e' },
  { name: '中', type: 'middle', color: '#fa9746' },
  { name: '低', type: 'low', color: '#43ba9a' },
  { name: '极低', type: 'knockdown', color: '#bbbdbf' },
]

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
      width={740}
      footer={false}
      title="创建需求"
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <FormWrap form={form} labelCol={{ span: 5 }}>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="需求名称" required>
            <Input placeholder="请输入需求名称" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="edit-square" />
          <Form.Item label="需求描述">
            <Editor />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="user" />
          <Form.Item label="处理人" required>
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder="请选择处理人"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="预计时间">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="apartment" />
          <Form.Item label="父需求">
            <Select
              style={{ width: '100%' }}
              showArrow
              showSearch
              placeholder="请选择父需求"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="carryout" />
          <Form.Item label="优先级">
            <PopConfirm
              content={({ onHide }: { onHide: () => void }) => {
                return (
                  <LevelContent tap={() => {}} hide={onHide}></LevelContent>
                )
              }}
            >
              <PriorityWrap>
                <IconFont
                  type={priorityList[0].type}
                  style={{
                    fontSize: 16,
                    color: `${priorityList[0].color}!important`,
                  }}
                />
                <div>{priorityList[0].name}</div>
              </PriorityWrap>
            </PopConfirm>
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="interation" />
          <Form.Item label="迭代">
            <Select placeholder="请选择" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="id-card" />
          <Form.Item label="抄送人">
            <Select
              style={{ width: '100%' }}
              showArrow
              mode="multiple"
              showSearch
              placeholder="请选择抄送人"
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="app-store-add" />
          <Form.Item label="标签">
            <TagComponent
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont className="labelIcon" type="attachment" />
          <Form.Item label="附件">
            <UploadAttach
              addWrap={
                <AddWrap>
                  <IconFont type="plus" />
                  <div>添加</div>
                </AddWrap>
              }
            />
          </Form.Item>
        </div>
      </FormWrap>
      <ModalFooter>
        <AddButtonWrap>完成并创建下一个</AddButtonWrap>
        <Space size={16}>
          <Button>取消</Button>
          <Button type="primary">确认</Button>
        </Space>
      </ModalFooter>
    </Modal>
  )
}
