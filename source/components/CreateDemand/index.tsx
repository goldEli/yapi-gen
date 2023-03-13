import {
  addDemand,
  getDemandInfo,
  getDemandList,
  updateDemand,
} from '@/services/demand'
import {
  getProjectInfoValues,
  getProjectList,
  getProjectRecent,
} from '@/services/project'
import { removeNull } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import {
  setCreateCategory,
  setIsCreateDemandVisible,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
  setIsUpdateDemand,
  setDemandDetailDrawerProps,
} from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateCreate } from '@store/mine'
import { setFilterParamsModal, setProjectInfoValues } from '@store/project'
import { message, Space } from 'antd'
import { createRef, useEffect, useState } from 'react'
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
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const { createDemandProps, isCreateDemandVisible } = useSelector(
    store => store.demand,
  )
  //   是否是完成并创建下一个 -- 用于提交参数后回填
  const [isSaveParams, setIsSaveParams] = useState(false)
  // 父需求列表
  const [parentList, setParentList] = useState<any>([])
  // 项目列表
  const [projectList, setProjectList] = useState<any>([])
  // 所有的类别列表
  const [allCategoryList, setAllCategoryList] = useState<any>([])
  // 项目id
  const [projectId, setProjectId] = useState('')
  // 需求详情-编辑回填
  const [demandInfo, setDemandInfo] = useState<any>({})
  const [fieldList, setFieldList] = useState<any>([])
  const [workStatusList, setWorkStatusList] = useState([])
  const [isCreateDemand, setIsCreateDemand] = useState<any>({})

  // 获取头部标题
  const titleText = () => {
    let text: any
    if (createDemandProps?.isQuickCreate) {
      text = t('mine.quickCreate')
    } else if (createDemandProps?.isChild) {
      text = createDemandProps?.demandId
        ? t('project.editChildDemand')
        : t('common.createChildDemand')
    } else {
      text = createDemandProps?.demandId
        ? t('project.editDemand')
        : t('common.createDemand')
    }
    return text
  }

  // 关闭创建需求
  const onCancel = () => {
    dispatch(setIsCreateDemandVisible(false))
    // 清除创建需求点击的下拉需求类别 -- 需求
    dispatch(setCreateCategory({}))
    setIsSaveParams(false)
    setProjectId('')
    setFieldList([])
    setTimeout(() => {
      leftDom.current?.reset()
      rightDom.current?.reset()
    }, 100)
  }

  // 左侧项目切换清除右侧form表单
  const onResetForm = () => {
    rightDom?.current.reset()
  }

  // 获取父需求列表
  const getList = async (value?: any) => {
    const result = await getDemandList({
      projectId: value,
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

  // 获取项目列表
  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    setProjectList(res.list)
    // 如果有需求id则获取详情
    if (createDemandProps.demandId) {
      const demandResponse = await getDemandInfo({
        projectId: createDemandProps.projectId,
        id: createDemandProps?.demandId,
      })
      setDemandInfo(demandResponse)
    }
  }

  const onSaveDemand = async (values: any, hasNext?: any) => {
    if (createDemandProps?.demandId) {
      await updateDemand({
        projectId,
        id: createDemandProps?.demandId,
        ...values,
      })
      message.success(t('common.editSuccess'))
      dispatch(setIsUpdateStatus(true))
      dispatch(setIsUpdateChangeLog(true))
    } else {
      await addDemand({
        projectId,
        ...values,
      })
      message.success(t('common.createSuccess'))
    }
    // 保存数据后更新项目信息-用于更新标签
    if (projectId) {
      const result = await getProjectInfoValues({ projectId })
      dispatch(setProjectInfoValues(result))
    }
    // 是否是快捷创建，是则要刷新相应的列表接口
    if (createDemandProps?.isQuickCreate) {
      dispatch(setIsUpdateCreate(true))
    } else {
      // 更新列表
      dispatch(setIsUpdateDemand(true))
    }

    // 如果是快速创建，相应数据存缓存
    if (createDemandProps.isQuickCreate) {
      const saveParams = values
      saveParams.name = ''
      saveParams.info = ''
      saveParams.attachments = []

      localStorage.setItem(
        'quickCreateData',
        encryptPhp(JSON.stringify(saveParams)),
      )
    }

    // 是否是完成并创建下一个
    if (hasNext) {
      leftDom.current.update()
      setIsSaveParams(true)
    } else {
      dispatch(setCreateCategory({}))
      dispatch(setIsCreateDemandVisible(false))
      setIsSaveParams(false)
      setTimeout(() => {
        leftDom.current?.reset()
        rightDom.current?.reset()
        dispatch(setFilterParamsModal({}))
      }, 100)
    }
  }

  // 点击保存，hasNext是否是完成并下一个
  const onSaveCategory = async (hasNext?: number) => {
    const leftValues = await leftDom.current.confirm()
    const rightValues = await rightDom.current.confirm()
    if (leftValues && rightValues) {
      await onSaveDemand({ ...leftValues, ...rightValues }, hasNext)
    }
  }

  //   切换项目id获取初始展示数据
  const getInit = async (value?: any) => {
    setAllCategoryList([])
    setWorkStatusList([])
    const [projectInfoData] = await Promise.all([
      getProjectInfoValues({ projectId: value }),
      getList(value),
    ])
    dispatch(setProjectInfoValues(projectInfoData))
    const allCategory = removeNull(projectInfoData, 'category')
    // 更新所有需求类别列表
    setAllCategoryList(allCategory)
  }

  // 获取最近项目列表 -- 使用列表的第一个
  const getRecentlyList = async () => {
    const data = await getProjectRecent()
    setProjectId(data[0]?.id || '')
    if (data[0]?.id) {
      getInit(data[0]?.id)
    }
  }

  useEffect(() => {
    if (isCreateDemandVisible) {
      getProjectData()
      if (createDemandProps.projectId) {
        getInit(createDemandProps.projectId)
        setProjectId(createDemandProps.projectId)
      }
      // 全局创建和快速创建获取最近项目
      if (!createDemandProps?.projectId) {
        getRecentlyList()
      }
    }
  }, [isCreateDemandVisible])

  return (
    <CommonModal
      title={titleText()}
      isVisible={isCreateDemandVisible}
      onClose={onCancel}
      width="88%"
      hasFooter={
        <ModalFooter>
          <Space size={16}>
            <CommonButton type="light" onClick={onCancel}>
              {t('common.cancel')}
            </CommonButton>
            {!createDemandProps.demandId && (
              <CommonButton
                isDisable={!isCreateDemand}
                type="secondary"
                onClick={() => onSaveCategory(1)}
              >
                {t('common.finishToAdd')}
              </CommonButton>
            )}
            <CommonButton
              isDisable={!isCreateDemand}
              type="primary"
              onClick={() => onSaveCategory()}
            >
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
          projectList={projectList}
          onRef={leftDom}
          allCategoryList={allCategoryList}
          projectId={projectId}
          onChangeProjectId={setProjectId}
          demandDetail={demandInfo}
          onGetFieldList={setFieldList}
          onResetForm={onResetForm}
          onGetDataAll={getInit}
          onChangeWorkStatusList={setWorkStatusList}
          onGetCreateDemand={setIsCreateDemand}
        />
        <CreateDemandRight
          projectId={projectId}
          parentList={parentList}
          onRef={rightDom}
          fieldsList={fieldList}
          demandDetail={demandInfo}
          isSaveParams={isSaveParams}
          workStatusList={workStatusList}
          isCreateDemand={isCreateDemand}
        />
      </div>
    </CommonModal>
  )
}

export default CreateDemand
