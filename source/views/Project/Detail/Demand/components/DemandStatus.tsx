import IconFont from '@/components/IconFont'
import Popconfirm from '@/components/Popconfirm'
import styled from '@emotion/styled'
import { Divider, Form, Input, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid #EBEDF0',
  color: '#969799',
  cursor: 'pointer',
})

const DemandStatus = styled.div({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  width: 362,
  '.ant-form-item': {
    margin: '16px 0 0 0',
  },
})

const PopoverFooter = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 36,
  justifyContent: 'flex-end',
})

const statusList = [
  { name: '规划中' },
  { name: '实现中' },
  { name: '已实现' },
  { name: '已关闭' },
]

interface Props {
  hide?(): void
  tap?(value: any, active: any): void
}

const DemandBox = (props: Props) => {
  const [form] = Form.useForm()
  return (
    <DemandStatus title="">
      <div
        onClick={() => props.hide?.()}
        style={{ textAlign: 'right',
          color: '#323233',
          cursor: 'pointer' }}
      >
        <IconFont type="close" />
      </div>
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item label="处理人" required>
          <Select placeholder="请选择" />
        </Form.Item>
        <Form.Item label="评论">
          <Input.TextArea
            autoSize={{ minRows: 5,
              maxRows: 5 }}
            placeholder="请输入评论处理意见"
          />
        </Form.Item>
      </Form>
      <PopoverFooter size={16}>
        <Button onClick={() => props.hide?.()}>取消</Button>
        <Button type="primary">确认</Button>
      </PopoverFooter>
    </DemandStatus>
  )
}

export default () => {
  return (
    <>
      {statusList.map((i, index) => (
        <Popconfirm
          content={({ onHide }: { onHide(): void }) => {
            return <DemandBox tap={() => {}} hide={onHide} />
          }}
        >
          <div style={{ display: 'flex',
            alignItems: 'center' }}>
            <StatusWrap>{i.name}</StatusWrap>
            <Divider
              style={{
                width: 48,
                margin: '0 8px',
                minWidth: 'auto',
                display: index === statusList.length - 1 ? 'none' : 'block',
              }}
              dashed
            />
          </div>
        </Popconfirm>
      ))}
    </>
  )
}
