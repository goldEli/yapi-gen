/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import FormTitleSmall from '@/components/FormTitleSmall'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Form, Input, Tooltip } from 'antd'
import { useEffect, useRef } from 'react'
const FormWrap = styled(Form)({
  '& .ant-form-item-row': {
    display: 'block !important',
  },
})
interface DragItem {
  type: number
  title: string
  icon: string
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
  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      name: props.dragItem?.title,
    })
  }, [props.isVisible])
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={'组件参数配置'}
      onClose={props.onClose}
      onConfirm={() =>
        props.onConfirm(form.getFieldsValue(), props.dragItem?.type)
      }
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
                <FormTitleSmall text="标题名称" />
                <Tooltip
                  overlayStyle={{
                    fontSize: '12px',
                    color: 'var(--neutral-n3)',
                  }}
                  trigger={['click']}
                  placement="top"
                  title="输入一个符合阅读习惯名称限20字，不能是 组件名称，且不能与已有的自定义标题重名"
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
            <Input autoComplete="off" autoFocus />
          </Form.Item>
          {props.dragItem?.type === 3 && (
            <Form.Item style={{ marginTop: 24 }} name="tips" label="提示文字">
              <TextArea
                style={{ minHeight: '102px' }}
                placeholder="提示文字可以用来提示用户如何填写"
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
