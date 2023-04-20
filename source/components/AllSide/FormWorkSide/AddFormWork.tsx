import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { Form, Input } from 'antd'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
  onConfirm(name: string): void
  onClose(): void
}
interface PropsType {
  isVisible: boolean
  onChange?(name: string): void
  value?: string | undefined
}

const Content = (props: PropsType) => {
  const [t] = useTranslation()
  const inputRefDom = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (props.isVisible) {
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props.isVisible])
  return (
    <>
      <LabelTitle>
        <span>{t('formWork.text8')}</span>
        <span>*</span>
      </LabelTitle>
      <Input
        value={props.value}
        autoComplete="off"
        ref={inputRefDom as any}
        onInput={(e: any) => props.onChange?.(e.target.value)}
        placeholder={t('formWork.text9')}
        maxLength={50}
        autoFocus
      />
    </>
  )
}
const AddFormWork = (props: Props) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const onConfirm = async () => {
    const res2 = await form.validateFields()
    const formValues = form.getFieldsValue()
    props.onConfirm(formValues.name)
  }
  useEffect(() => {
    if (props.isVisible) {
      form.resetFields()
    }
  }, [props.isVisible])
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={t('formWork.text10')}
      onClose={() => props.onClose()}
      onConfirm={onConfirm}
    >
      <FormWrap
        form={form}
        layout="vertical"
        style={{ padding: '0 16px 0 24px' }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: t('formWork.text11') }]}
        >
          <Content isVisible={props.isVisible} />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}
export default AddFormWork
