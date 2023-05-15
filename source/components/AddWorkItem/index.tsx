import styled from '@emotion/styled'
import CommonModal from '../CommonModal'
import { Space } from 'antd'
import CommonButton from '../CommonButton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { createRef, useEffect, useState } from 'react'
import {
  getProjectInfoValues,
  getProjectList,
  getProjectRecent,
} from '@/services/project'
import {
  addDemand,
  getDemandInfo,
  getDemandList,
  updateDemand,
} from '@/services/demand'
import {
  setProjectInfoValues,
  setAddWorkItemModal,
  setFilterParamsModal,
} from '@store/project'
import { removeNull } from '@/tools'
import {
  setCreateCategory,
  setIsUpdateChangeLog,
  setIsUpdateDemand,
  setIsUpdateStatus,
} from '@store/demand'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getMessage } from '../Message'
import { setIsUpdateCreate } from '@store/mine'

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  paddingRight: 24,
})

const AddWorkItem = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const { addWorkItemModal } = useSelector(store => store.project)
  const { params, visible } = addWorkItemModal
  const [isCreateWorkItem, setIsCreateWorkItem] = useState<any>({})
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
  const [newCategory, setNewCategory] = useState<any>({})
  //   是否是完成并创建下一个 -- 用于提交参数后回填
  const [isSaveParams, setIsSaveParams] = useState(false)

  // 关闭弹窗
  const onCancel = () => {
    dispatch(setAddWorkItemModal({ visible: false }))
    // 清除创建需求点击的下拉需求类别 -- 需求
    dispatch(setCreateCategory({}))
    setIsSaveParams(false)
    setProjectId('')
    setFieldList([])
    setNewCategory({})
    setTimeout(() => {
      leftDom.current?.reset()
      rightDom.current?.reset()
    }, 100)
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
    if (params?.editId) {
      const demandResponse = await getDemandInfo({
        projectId: params?.projectId,
        id: params?.editId,
      })
      setDemandInfo(demandResponse)
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

  const onSaveDemand = async (values: any, hasNext?: any) => {
    if (params?.editId) {
      await updateDemand({
        projectId,
        id: params?.editId,
        ...values,
      })
      getMessage({ msg: t('common.editSuccess'), type: 'success' })
      dispatch(setIsUpdateStatus(true))
      dispatch(setIsUpdateChangeLog(true))
    } else {
      await addDemand({
        projectId,
        ...values,
      })
      getMessage({ msg: t('common.createSuccess'), type: 'success' })
    }
    // 保存数据后更新项目信息-用于更新标签
    if (projectId) {
      const result = await getProjectInfoValues({ projectId })
      dispatch(setProjectInfoValues(result))
    }
    // 是否是快捷创建，是则要刷新相应的列表接口
    if (params?.isQuickCreate) {
      dispatch(setIsUpdateCreate(true))
    } else {
      // 更新列表
      dispatch(setIsUpdateDemand(true))
    }

    // 如果是快速创建，相应数据存缓存
    if (params?.isQuickCreate) {
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
      dispatch(setAddWorkItemModal({ visible: false }))
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

  useEffect(() => {
    if (visible) {
      getProjectData()
      if (params?.projectId) {
        getInit(params?.projectId)
        setProjectId(params?.projectId)
      }
      // 全局创建和快速创建获取最近项目
      if (!params?.projectId) {
        getRecentlyList()
      }
    }
  }, [visible])

  return (
    <CommonModal
      title={params?.title ?? '添加工作项'}
      isVisible={visible}
      onClose={onCancel}
      width="88%"
      hasFooter={
        <ModalFooter>
          <Space size={16}>
            <CommonButton type="light" onClick={onCancel}>
              {t('common.cancel')}
            </CommonButton>
            {!params?.editId && (
              <CommonButton
                isDisable={!isCreateWorkItem}
                type="light"
                onClick={() => onSaveCategory(1)}
              >
                {t('common.finishToAdd')}
              </CommonButton>
            )}
            <CommonButton
              isDisable={!isCreateWorkItem}
              type="primary"
              onClick={() => onSaveCategory()}
            >
              {params?.editId ? t('common.confirm2') : t('newlyAdd.create')}
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
        23
      </div>
    </CommonModal>
  )
}

export default AddWorkItem
