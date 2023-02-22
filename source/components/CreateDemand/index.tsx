/* eslint-disable no-undefined */
import { getDemandList } from '@/services/demand'
import styled from '@emotion/styled'
import {
  setCreateCategory,
  setCreateDemandProps,
  setIsCreateDemandVisible,
} from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { Form, Space } from 'antd'
import { createRef, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../CommonButton'
import CommonModal from '../CommonModal'
import CreateDemandLeft from './CreateDemandLeft'
import CreateDemandRight from './CreateDemandRight'

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  paddingRight: 24,
})

const CreateDemand = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isCreateDemandVisible, createDemandParams, createDemandProps } =
    useSelector(store => store.demand)
  const inputRef = useRef<HTMLInputElement>(null)
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const [demandInfo, setDemandInfo] = useState<any>({})
  // 切换需求类别下的工作流
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  // 项目id
  const [projectId, setProjectId] = useState(null)
  // 父需求列表
  const [parentList, setParentList] = useState<any>([])
  // 自定义字段列表
  const [fieldsList, setFieldsList] = useState<any>([])
  const [allCategoryList, setAllCategoryList] = useState<any>([])
  // 点击需求类别弹出修改需求类别相应参数弹窗
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  // 存储点击修改需求类别弹出确认按钮时提交的参数
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})
  //   是否是完成并创建下一个 -- 用于提交参数后回填
  const [isSaveParams, setIsSaveParams] = useState(false)
  const { colorList, filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { createCategory } = useSelector(store => store.demand)

  // 获取头部标题
  const titleText = () => {
    let text: any
    if (createDemandProps.isQuickCreate) {
      text = t('mine.quickCreate')
    } else if (createDemandProps.isChild) {
      text = createDemandProps.demandId
        ? t('project.editChildDemand')
        : t('common.createChildDemand')
    } else {
      text = createDemandProps.demandId
        ? t('project.editDemand')
        : t('common.createDemand')
    }
    return text
  }

  // 获取父需求列表
  const getList = async (value?: any) => {
    const result = await getDemandList({
      projectId: value || projectId,
      all: true,
    })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
      parentId: i.parentId,
    }))
    setParentList(arr)
    return arr
  }

  // 关闭弹窗
  const onCancel = () => {
    dispatch(setCreateDemandProps({}))
    dispatch(setIsCreateDemandVisible(false))
    // 清除创建需求点击的下拉需求类别 -- 需求
    dispatch(setCreateCategory({}))
    // setChangeCategoryFormData({})
    // dispatch(setFilterParamsModal({}))
    // setIsSaveParams(false)
    // setTimeout(() => {
    //   leftDom.current?.reset()
    //   rightDom.current?.reset()
    // }, 100)
  }

  // 快速创建切换项目获取初始值
  const getQuickInit = () => {
    //
  }

  // 左侧项目切换清除右侧form表单
  const onResetForm = () => {
    setAllCategoryList([])
    rightDom?.current.reset()
  }

  return (
    <CommonModal
      width="88%"
      title={titleText()}
      isVisible={isCreateDemandVisible}
      onClose={onCancel}
      hasFooter={
        <ModalFooter>
          <Space size={16}>
            <CommonButton type="light" onClick={onCancel}>
              {t('common.cancel')}
            </CommonButton>
            {!createDemandProps.demandId && (
              <CommonButton type="secondary">
                {t('common.finishToAdd')}
              </CommonButton>
            )}
            <CommonButton type="primary">
              {createDemandProps.demandId
                ? t('common.confirm2')
                : t('newlyAdd.create')}
            </CommonButton>
          </Space>
        </ModalFooter>
      }
    >
      <div
        style={{
          height: 'calc(90vh - 136px)',
          padding: '0 4px 0 8px',
          display: 'flex',
        }}
      >
        <CreateDemandLeft
          isQuickCreate={createDemandProps.isQuickCreate}
          isAllProject={createDemandProps.isAllProject}
          projectId={projectId}
          onChangeProjectId={setProjectId}
          onGetDataAll={getQuickInit}
          onResetForm={onResetForm}
          onRef={leftDom}
          demandId={createDemandProps.demandId}
          demandDetail={demandInfo}
        />
        <CreateDemandRight
          projectId={projectId}
          demandId={createDemandProps.demandId}
          parentList={parentList}
          onRef={rightDom}
          iterateId={createDemandProps.iterateId}
          isChild={createDemandProps.isChild}
          isSaveParams={isSaveParams}
          isQuickCreate={createDemandProps.isQuickCreate}
          fieldsList={fieldsList}
          parentId={createDemandProps.parentId}
          demandDetail={demandInfo}
        />
      </div>
    </CommonModal>
  )
}

export default CreateDemand
