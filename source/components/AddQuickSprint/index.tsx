// 快捷添加子事务

import { useDispatch, useSelector } from '@store/index'
import CommonModal from '../CommonModal'
import { setAddQuickSprintModal } from '@store/project'
import { Form, Input, Select } from 'antd'
import CustomSelect from '../CustomSelect'
import { useTranslation } from 'react-i18next'
import MoreOptions from '../MoreOptions'
import styled from '@emotion/styled'

const ParentWrap = styled.div`
  height: 24px;
  border-radius: 6px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  background: var(--neutral-n8);
  width: max-content;
  img {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  span {
    font-size: 12px;
    color: var(--neutral-n2);
  }
`

const AddQuickSprint = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { addQuickSprintModal } = useSelector(store => store.project)
  const { visible, params } = addQuickSprintModal
  const [form] = Form.useForm()

  const list = [
    {
      content: '故事',
      icon: 'https://dev.staryuntech.com/dev-agile/attachment/category_icon/message.png',
      id: 0,
    },
    {
      content: '故事1',
      icon: 'https://dev.staryuntech.com/dev-agile/attachment/category_icon/message.png',
      id: 1,
    },
    {
      content: '故事2',
      icon: 'https://dev.staryuntech.com/dev-agile/attachment/category_icon/message.png',
      id: 2,
    },
  ]

  //   关闭弹窗
  const onClose = () => {
    dispatch(setAddQuickSprintModal({ visible: false, params: {} }))
    form.resetFields()
  }

  //   创建子事务
  const onConfirm = async () => {
    await form.validateFields()
    // console.log(form.getFieldsValue())
  }

  return (
    <CommonModal
      confirmText="创建"
      isVisible={visible}
      title="添加子事务"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Form form={form} layout="vertical" style={{ padding: '0 24px' }}>
        <Form.Item label="创建以下事务的子事务">
          <ParentWrap>
            <img src={params?.icon} alt="" />
            <span>{params?.parentName}</span>
          </ParentWrap>
        </Form.Item>
        <Form.Item
          label="类别"
          name="category"
          rules={[{ required: true, message: '' }]}
        >
          <CustomSelect
            placeholder={t('common.searchProject')}
            allowClear
            showArrow
            getPopupContainer={(node: any) => node}
            showSearch
          >
            {list?.map((i: any) => {
              return (
                <Select.Option value={i.id} key={i.id} label={i.content}>
                  <MoreOptions type="project" name={i.content} img={i.icon} />
                </Select.Option>
              )
            })}
          </CustomSelect>
        </Form.Item>
        <Form.Item
          label="标题"
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input
            placeholder="请输入标题"
            maxLength={100}
            autoComplete="off"
            allowClear
          />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default AddQuickSprint
