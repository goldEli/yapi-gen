/* eslint-disable no-undefined */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Form, Select, Switch } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfoValues } from '@store/project'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import {
  changeStoryConfigCategory,
  deleteStoryConfigCategory,
  getWorkflowList,
} from '@/services/project'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setStartUsing } from '@store/category'
import EditCategory from '@/components/AllSide/DemandSettingSide/EditCategory'
import { storyConfigCategoryList } from '@store/category/thunk'
import CommonModal from '@/components/CommonModal'

const HeaderWrap = styled.div`
  height: 66px;
  display: flex;
  margin: 0 24px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const LeftMsg = styled.div`
  display: flex;
  align-items: flex-start;
`
const RightOperate = styled.div`
  display: flex;
  align-items: center;
`
const MsgContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  div:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: 14px;
  }
  div:nth-child(2) {
    color: var(--neutral-n3);
    font-size: 12px;
  }
`
const SwitchStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  font-size: 14px;
`
const BtnStyle = styled.div`
  display: inline-block;
  width: auto;
  height: 32px;
  border-radius: 6px;
  background: var(--hover-d2);
  color: var(--neutral-n2);
  padding: 0 16px;
  margin-left: 16px;
  line-height: 32px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`

const HasDemandText = styled.div({
  marginTop: 8,
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

const Header = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { startUsing, activeCategory, categoryList } = useSelector(
    store => store.category,
  )
  const { projectInfo } = useSelector(store => store.project)
  const [checked, setChecked] = useState(startUsing)
  const [isDelete, setIsDelete] = useState(false)
  const [hasDeleteVisible, setHasDeleteVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })

  useEffect(() => {
    setChecked(startUsing ? true : false)
  }, [startUsing])

  // 删除需求类别
  const onDeleteConfirm = async () => {
    await deleteStoryConfigCategory({
      id: activeCategory.id,
      projectId: projectInfo.id,
    })
    await dispatch(storyConfigCategoryList({ projectId: projectInfo.id }))
  }

  // 点击跳转配置工作流
  const onSetWorkFlow = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo.id,
        pageIdx: 'work',
        categoryItem: activeCategory,
      }),
    )
    navigate(`/ProjectManagement/WorkFlow?data=${params}`)
  }

  // 编辑
  const editCategoryForm = () => {
    setIsVisible(true)
  }

  // 删除逻辑
  const onDelete = () => {
    if (activeCategory?.hasDemand) {
      setHasDeleteVisible(true)
    } else {
      setIsDelete(true)
    }
  }

  const onCloseHasDelete = () => {
    setHasDeleteVisible(false)
    setTimeout(() => {
      form.resetFields()
      setDisable(true)
    }, 100)
  }

  const onConfirmHasDelete = async () => {
    await form.validateFields()
    const params = form.getFieldsValue()
    params.projectId = projectInfo.id
    params.oldId = activeCategory.id
    try {
      await changeStoryConfigCategory(params)
      await onDeleteConfirm()
      onCloseHasDelete()
    } catch (error) {
      //
    }
  }

  const onChangeSelect = async (value: any) => {
    if (value) {
      const result = await getWorkflowList({
        projectId: projectInfo.id,
        categoryId: value,
      })
      setWorkList(result)
      setDisable(false)
      form.setFieldsValue({
        statusId: '',
      })
    } else {
      form.resetFields()
      setDisable(true)
    }
  }

  return (
    <HeaderWrap>
      {hasDeleteVisible && (
        <CommonModal
          isVisible={hasDeleteVisible}
          onClose={onCloseHasDelete}
          title={t('newlyAdd.historyMove')}
          onConfirm={onConfirmHasDelete}
        >
          <div style={{ padding: '0 16px 0 2px' }}>
            <HasDemandText>
              {t('newlyAdd.hasMoveType', {
                hasDemand: activeCategory?.hasDemand,
              })}
            </HasDemandText>
            <Form form={form} layout="vertical">
              <Form.Item
                label={t('newlyAdd.afterCategory')}
                name="newId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  placeholder={t('common.pleaseSelect')}
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  onChange={onChangeSelect}
                  options={categoryList
                    ?.filter(
                      (i: any) =>
                        i.id !== activeCategory?.id &&
                        i?.statusCount &&
                        i.isCheck === 1,
                    )
                    ?.map((k: any) => ({ label: k.name, value: k.id }))}
                />
              </Form.Item>
              <Form.Item
                label={t('newlyAdd.afterStatus')}
                name="statusId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  placeholder={t('common.pleaseSelect')}
                  disabled={disable}
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  options={workList?.list?.map((k: any) => ({
                    label: k.name,
                    value: k.statusId,
                  }))}
                />
              </Form.Item>
            </Form>
          </div>
        </CommonModal>
      )}
      <DeleteConfirm
        isVisible={isDelete}
        text={t('newlyAdd.confirmDelCategory')}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <LeftMsg>
        <CommonIconFont type="left" size={24} />
        <MsgContent>
          <div>{activeCategory?.name}</div>
          <div>{activeCategory?.remark || '--'}</div>
        </MsgContent>
      </LeftMsg>
      <RightOperate>
        <SwitchStyle>
          <span style={{ marginRight: '8px' }}>启用状态</span>
          <Switch
            checked={checked}
            onChange={e => {
              setChecked(e), dispatch(setStartUsing(e))
            }}
          />
        </SwitchStyle>
        <BtnStyle onClick={onSetWorkFlow}>配置工作流</BtnStyle>
        <BtnStyle onClick={() => editCategoryForm()}>编辑</BtnStyle>
        <BtnStyle onClick={onDelete}>删除</BtnStyle>
        {/* <BtnStyle onClick={() => setIsDelete(true)}>删除</BtnStyle> */}
      </RightOperate>
      <EditCategory
        item={activeCategory}
        onClose={() => setIsVisible(false)}
        onUpdate={() => 123}
        isVisible={isVisible}
      />
    </HeaderWrap>
  )
}
export default Header
