/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Modal, Form, Input, DatePicker, Select, Popover, Space } from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { ShapeContent } from '@/components/Shape'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Editor from '@/components/Editor'

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
        content: '\'*\'',
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

const AddWrap = styled.div<{ hasColor?: boolean, hasDash?: boolean }>(
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

const QuicklyCreate = (props: Props) => {
  const [form] = Form.useForm()
  return (
    <Modal
      visible={props.visible}
      width={524}
      footer={false}
      title="快速创建"
      onCancel={props.onChangeVisible}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <FormWrap form={form} labelCol={{ span: 6 }}>
        <div style={{ display: 'flex' }}>
          <IconFont type="apartment" />
          <Form.Item label="创建项目" required>
            <Select placeholder="请选择" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="apartment" />
          <Form.Item label="创建类型" required>
            <Select placeholder="请选择" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="apartment" />
          <Form.Item label="需求名称" required>
            <Input placeholder="请输入需求名称" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex' }}>
          <IconFont type="edit-square" />
          <Form.Item label="需求描述">
            <Editor />
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
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return (
                  <LevelContent
                    tap={() => {

                      //
                    }}
                    hide={onHide}
                  />
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
      <ModalFooter>
        <AddButtonWrap>完成并创建下一个</AddButtonWrap>
        <Space size={16}>
          <Button>取消</Button>
          <Button type="primary">完成</Button>
        </Space>
      </ModalFooter>
    </Modal>
  )
}

export default QuicklyCreate
