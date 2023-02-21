import { useDispatch, useSelector } from '@store/index'
import { changeCreateVisible } from '@store/view'
import { Form, Input } from 'antd'
import React from 'react'
import CommonModal from '../CommonModal'
import FormTitleSmall from '../FormTitleSmall'
import { Wrap, WrapText } from './style'

const CreateViewPort = () => {
  const [form] = Form.useForm()
  const createVisible = useSelector(state => state.view.createVisible)
  const dispatch = useDispatch()
  const onConfirm = () => {
    // console.log(form.getFieldsValue())
  }
  const onClose = () => {
    dispatch(changeCreateVisible(false))
  }
  return (
    <CommonModal
      onConfirm={onConfirm}
      onClose={onClose}
      title="创建视图"
      isVisible={createVisible}
    >
      <Wrap>
        <WrapText>将当前筛选条件、显示字段、排序方式、保存为新的视图</WrapText>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<FormTitleSmall text="视图名称" />}
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="请输入视图名称限20字" />
          </Form.Item>
        </Form>
      </Wrap>
    </CommonModal>
  )
}

export default CreateViewPort
