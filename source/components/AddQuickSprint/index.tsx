// 快捷添加子事务

import { useDispatch, useSelector } from '@store/index'
import CommonModal from '../CommonModal'
import {
  setAddQuickSprintModal,
  setIsChangeDetailAffairs,
  setIsUpdateAddWorkItem,
} from '@store/project'
import { Form, Input, Select } from 'antd'
import CustomSelect from '../CustomSelect'
import { useTranslation } from 'react-i18next'
import MoreOptions from '../MoreOptions'
import styled from '@emotion/styled'
import { addQuickAffairs } from '@/services/affairs'
import { getMessage } from '../Message'
import { removeNull } from '@/tools'
import { AFFAIRS_CHILD_TYPE } from '@/constants'

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
  const { addQuickSprintModal, projectInfo, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { visible, params } = addQuickSprintModal
  const [form] = Form.useForm()

  //   关闭弹窗
  const onClose = () => {
    dispatch(setAddQuickSprintModal({ visible: false, params: {} }))
    form.resetFields()
  }

  //   创建子事务
  const onConfirm = async () => {
    await form.validateFields()
    await addQuickAffairs({
      ...form.getFieldsValue(),
      projectId: projectInfo.id,
      parent_id: params?.id,
    })
    getMessage({ type: 'success', msg: '创建成功' })
    onClose()
    // 需要更新子事务、链接事务详情及列表
    dispatch(setIsChangeDetailAffairs(true))
    dispatch(setIsUpdateAddWorkItem(true))
  }

  // 计算类别
  const computedCategory = () => {
    let allCategoryList: any = removeNull(projectInfoValues, 'category')
    let result = allCategoryList?.filter(
      (i: any) =>
        AFFAIRS_CHILD_TYPE[params?.work_type ?? 3]?.includes(i.work_type) &&
        i.status === 1,
    )
    return result
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
            <img src={params?.category_attachment} alt="" />
            <span>{params?.category}</span>
          </ParentWrap>
        </Form.Item>
        <Form.Item
          label="类别"
          name="category_id"
          rules={[{ required: true, message: '' }]}
        >
          <CustomSelect
            placeholder={t('common.searchProject')}
            allowClear
            showArrow
            getPopupContainer={(node: any) => node}
            showSearch
          >
            {computedCategory()?.map((i: any) => {
              return (
                <Select.Option value={i.id} key={i.id} label={i.name}>
                  <MoreOptions
                    type="project"
                    name={i.name}
                    dec={i.dec}
                    img={i.category_attachment}
                  />
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
