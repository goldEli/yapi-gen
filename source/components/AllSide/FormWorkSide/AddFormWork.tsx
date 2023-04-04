import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { Form, Input } from 'antd'
import { useEffect, useRef } from 'react'
const FormWrap = styled(Form)`
  box-sizing: border-box;
  padding-right: 24px;
`
const LabelTitle = styled.div`
  display: flex;
  color: var(--neutral-n1-d1);
  font-size: 14px;
  margin-bottom: 8px;
  font-family: PingFang SC-Regular, PingFang SC;
  span:nth-child(2) {
    color: var(--function-error);
  }
`
interface Props {
  isVisible: boolean
  onConfirm(): void
  onClose(): void
}
const AddFormWork = (props: Props) => {
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (props.isVisible) {
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props.isVisible])
  return (
    <CommonModal
      isVisible={props.isVisible}
      title="创建模板"
      onClose={() => props.onClose()}
      onConfirm={() => props.onConfirm()}
      getPopupContainer={(node: any) => node}
    >
      <FormWrap
        form={form}
        layout="vertical"
        style={{ padding: '0 16px 0 24px' }}
      >
        <Form.Item name="name" rules={[{ required: true, message: '' }]}>
          <LabelTitle>
            <span>模板名称</span>
            <span>*</span>
          </LabelTitle>
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder="请输入模板名称限50字"
            allowClear
            maxLength={50}
            autoFocus
          />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default AddFormWork
