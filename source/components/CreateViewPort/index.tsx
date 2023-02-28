/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import { useDispatch, useSelector } from '@store/index'
import { changeCreateVisible } from '@store/view'
import { addViewList, getViewList } from '@store/view/thunk'
import { Form, Input } from 'antd'
import CommonModal from '../CommonModal'
import FormTitleSmall from '../FormTitleSmall'
import { Wrap, WrapText } from './style'

const CreateViewPort = (props: any) => {
  const [form] = Form.useForm()
  const { searchKey, valueKey, titles, sort, createVisible } = useSelector(
    state => state.view,
  )
  const dispatch = useDispatch()
  const onConfirm = async () => {
    const res = await form.validateFields()
    const obj: any = {}
    for (const i in searchKey) {
      obj[searchKey[i].key] = null
    }

    const data = {
      name: res.name,
      config: {
        search: { ...obj, ...valueKey },
        fields: titles,
        sort: sort,
      },
      project_id: props.pid,
    }

    await dispatch(addViewList(data))
    await dispatch(getViewList(props.pid))
    await dispatch(changeCreateVisible(false))
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
