/* eslint-disable no-duplicate-imports */
import { Form, Input, Modal } from 'antd'
import type { ForwardRefRenderFunction } from 'react'
import { forwardRef, useState, useImperativeHandle } from 'react'

type EditLinkDialogProps = {
  title?: string
  onSubmit?(value: Record<string, unknown>): void
}

export type EditLinkDialogRef =
  | {
      show(formData?: Record<string, unknown>): void
    }
  | undefined

const EditLinkDialog: ForwardRefRenderFunction<
  EditLinkDialogRef,
  EditLinkDialogProps
> = (props, ref) => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    show(formData) {
      form.resetFields()
      form.setFieldsValue(formData)
      setOpen(true)
    },
  }))

  const onClose = () => setOpen(false)

  const onSubmit = () => {
    onClose()
    props.onSubmit?.(form.getFieldsValue())
  }

  return (
    <Modal
      zIndex={100000}
      centered
      getContainer={() => {
        const a: any = document.getElementById('myEditor')

        return a
      }}
      title={props.title}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
    >
      <div
        style={{
          padding: '24px',
        }}
      >
        <Form form={form}>
          <Form.Item name="content">
            <Input placeholder="请输入标题" />
          </Form.Item>
          <div
            style={{
              height: '50px',
            }}
          />
          <Form.Item name="href">
            <Input placeholder="请输入网页地址" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default forwardRef(EditLinkDialog)
