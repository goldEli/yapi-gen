/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
// 组件参数配置弹窗
import CommonModal from '@/components/CommonModal'
import FormTitleSmall from '@/components/FormTitleSmall'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Form, Input, Tooltip } from 'antd'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
const FormWrap = styled(Form)({
  '& .ant-form-item-row': {
    display: 'block !important',
  },
})
interface DragItem {
  type: number
  name: string
  icon: string
  tips: string
  is_required: number
}
interface Props {
  onClose(): void
  onConfirm(values: DragItem, type: number): void
  isVisible: boolean
  dragItem: DragItem
}
const ParmasDialog = (props: Props) => {
  const { TextArea } = Input
  const ChooseDom = useRef<HTMLInputElement>(null)
  const [form] = Form.useForm()
  const [t] = useTranslation()
  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      name: props.dragItem?.name,
      tips: props.dragItem?.tips,
    })
  }, [props.isVisible])
  const onConfirm = () => {
    const formVal = form.getFieldsValue()
    formVal.is_required = props.dragItem?.is_required
    if (formVal.name) {
      props.onConfirm(formVal, props.dragItem?.type)
    } else {
      return
    }
  }
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={t('formWork.dialog1')}
      onClose={props.onClose}
      onConfirm={onConfirm}
    >
      <div
        ref={ChooseDom}
        style={{ maxHeight: 464, overflowY: 'auto', padding: '0 24px 0 24px' }}
      >
        <FormWrap form={form} layout="vertical">
          <Form.Item
            name="name"
            label={
              <div>
                <FormTitleSmall text={t('formWork.dialog2')} />
                <Tooltip
                  overlayStyle={{
                    fontSize: '12px',
                    color: 'var(--neutral-n3)',
                  }}
                  trigger={['click']}
                  placement="top"
                  title={t('formWork.dialog3')}
                >
                  <IconFont
                    style={{
                      color: 'var( --neutral-n4)',
                      position: 'absolute',
                      left: '69px',
                      top: '4px',
                    }}
                    type="question"
                  />
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: '' }]}
            getValueFromEvent={event => {
              return event.target.value.replace(/(?<start>^\s*)/g, '')
            }}
          >
            <Input autoComplete="off" autoFocus maxLength={20} />
          </Form.Item>
          {props.dragItem?.type === 3 && (
            <Form.Item
              style={{ marginTop: 24 }}
              name="tips"
              label={t('formWork.dialog4')}
            >
              <TextArea
                style={{ minHeight: '102px' }}
                placeholder={t('formWork.dialog5')}
                autoComplete="off"
                autoFocus
              />
            </Form.Item>
          )}
        </FormWrap>
      </div>
    </CommonModal>
  )
}
export default ParmasDialog
