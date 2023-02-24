/* eslint-disable complexity */
import {
  addDemand,
  getDemandInfo,
  getDemandList,
  updateDemand,
  updateDemandCategory,
} from '@/services/demand'
import { getProjectInfoValues, storyConfigField } from '@/services/project'
import { getParamsData, removeNull } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import {
  setCreateCategory,
  setCreateDemandProps,
  setIsCreateDemandVisible,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateCreate } from '@store/mine'
import { setFilterParamsModal, setProjectInfoValues } from '@store/project'
import { Form, message, Space } from 'antd'
import moment from 'moment'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
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
  //   获取地址参数
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (!createDemandProps?.notGetPath && isCreateDemandVisible) {
    paramsData = getParamsData(searchParams)
  }
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const [demandInfo, setDemandInfo] = useState<any>({})
  // 需求类别对象
  const [categoryObj, setCategoryObj] = useState<any>({})
  // 项目id
  const [projectId, setProjectId] = useState(null)
  // 父需求列表
  const [parentList, setParentList] = useState<any>([])
  // 自定义字段列表
  const [fieldsList, setFieldsList] = useState<any>([])
  const [allCategoryList, setAllCategoryList] = useState<any>([])
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
    dispatch(setFilterParamsModal({}))
    setIsSaveParams(false)
    setTimeout(() => {
      leftDom.current?.reset()
      rightDom.current?.reset()
    }, 100)
  }

  //   获取初始值
  const getInit = async (value?: any, categoryId?: any) => {
    let relyData: any = {}
    // 如果是我的/他的并且是全部项目时，更新项目信息及项目下拉
    if (createDemandProps.notGetPath && createDemandProps.isAllProject) {
      const [fieldsData, projectInfoData] = await Promise.all([
        storyConfigField({ projectId: value || projectId }),
        getProjectInfoValues({ projectId: value || projectId }),
        getList(value || projectId),
      ])
      relyData = { fieldsData, projectInfoData }
    } else {
      // 项目模块下的
      const [fieldsData] = await Promise.all([
        storyConfigField({ projectId: value || projectId }),
        getList(value || projectId),
      ])
      relyData = { fieldsData }
    }
    // 更新自定义字段列表
    setFieldsList(relyData.fieldsData?.list)
    const allCategory = removeNull(
      relyData?.projectInfoData ?? projectInfoValues,
      'category',
    )
    // 更新所有需求类别列表
    setAllCategoryList(allCategory)
    // 过滤掉未开启的类别
    const resultCategoryList = allCategory?.filter((i: any) => i.status === 1)
    // 需求id存在则是编辑
    if (createDemandProps.demandId) {
      // 重置需求类别
      setCategoryObj({})
      const res = await getDemandInfo({
        projectId: value || projectId,
        id: createDemandProps?.demandId,
      })
      setDemandInfo(res)
      //    如果可使用的能查到详情中的需求类别，则使用详情的， 反之使用列表的第一个
      if (
        resultCategoryList?.filter((j: any) => j.id === res.category)?.length
      ) {
        setCategoryObj(
          resultCategoryList?.filter((j: any) => j.id === res.category)[0],
        )
      } else {
        // 反之查所有中的需求类别，做展示用
        setCategoryObj(
          allCategory?.filter((j: any) => j.id === res.category)[0],
        )
      }
    } else {
      setProjectId(value)
      let resultCategory: any = {}
      // 如果是子需求的话，继承父级的需求类别
      if (createDemandProps?.isChild) {
        // 判断父需求类别是否被关闭，是则取列表第一条
        const isExistence = resultCategoryList?.filter(
          (i: any) => i.id === createDemandProps?.categoryId,
        )
        resultCategory = isExistence?.length
          ? isExistence[0]
          : resultCategoryList[0]
      }
      // 如果是快速创建并且有缓存数据
      if (createDemandProps?.isQuickCreate && categoryId) {
        // 判断需求类别是否被关闭，是则取列表第一条
        const isExistence = resultCategoryList?.filter(
          (i: any) => i.id === categoryId,
        )
        resultCategory = isExistence?.length
          ? isExistence[0]
          : resultCategoryList[0]
      }
      // 如果是快速创建没有缓存数据，取列表第一个
      if (
        (createDemandProps?.isQuickCreate && !categoryId) ||
        createDemandProps.noDataCreate
      ) {
        resultCategory = resultCategoryList[0]
      }
      // 迭代创建 ,当前只有迭代是需要做筛选类别回填
      if (createDemandProps?.iterateId) {
        // 如果是有筛选条件的，回填筛选条件
        if (filterParamsModal?.category_id?.length) {
          const resultId = filterParamsModal?.category_id?.filter(
            (i: any) => i !== -1,
          )?.[0]
          // 如果筛选条件存在需求类别列表，则填入，无则列表第一个
          const resultObj = resultCategoryList?.filter(
            (i: any) => i.id === resultId,
          )[0]
          resultCategory = resultObj
        } else {
          resultCategory = resultCategoryList[0]
        }
      }
      //   如果有修改
      if (resultCategory?.id) {
        setCategoryObj(resultCategory)
      }
    }
  }

  // 快速创建切换项目获取初始值
  const getQuickInit = async (value?: any) => {
    const [fieldsData, projectInfoData] = await Promise.all([
      storyConfigField({ projectId: value || projectId }),
      getProjectInfoValues({ projectId: value || projectId }),
      getList(value || projectId),
    ])
    dispatch(setProjectInfoValues(projectInfoData))
    // 更新自定义字段列表
    setFieldsList(fieldsData?.list)
    const allCategory = removeNull(projectInfoData, 'category')
    // 更新所有需求类别列表
    setAllCategoryList(allCategory)
    // 过滤掉未开启的类别
    const resultCategoryList = allCategory?.filter((i: any) => i.status === 1)
    // 快速创建选择项目后默认获取需求类别列表第一条
    setCategoryObj(resultCategoryList[0])
  }

  // 左侧项目切换清除右侧form表单
  const onResetForm = () => {
    setCategoryObj({})
    setAllCategoryList([])
    rightDom?.current.reset()
  }

  // 保存数据
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
      // 编辑操作更新
    }
    // 如果是快速创建，相应数据存缓存
    if (createDemandProps.isQuickCreate) {
      const saveParams = values
      saveParams.categoryId = categoryObj?.id
      saveParams.type = 'need'
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
      setTimeout(() => {
        leftDom.current?.reset()
        rightDom.current?.reset()
      }, 100)
      dispatch(setIsCreateDemandVisible(false))
      dispatch(setCreateDemandProps({}))
      dispatch(setFilterParamsModal({}))
      setIsSaveParams(false)
    }
  }

  // 先调用保存需求类别接口，再保存需求
  const onSaveCategory = async (hasNext?: number) => {
    return
    const leftValues = await leftDom.current.confirm()
    const rightValues = rightDom.current.confirm()

    if (rightValues?.startTime) {
      rightValues.expectedStart = rightValues?.startTime
        ? moment(rightValues?.startTime).format('YYYY-MM-DD')
        : null
    }
    if (rightValues?.endTime) {
      rightValues.expectedEnd = rightValues?.endTime
        ? moment(rightValues.endTime).format('YYYY-MM-DD')
        : null
    }

    if (rightValues.priority?.id) {
      rightValues.priority = rightValues.priority?.id
    }

    leftValues.category = categoryObj?.id

    if (
      createDemandProps?.demandId &&
      JSON.stringify(leftValues.changeCategoryFormData) !== '{}'
    ) {
      try {
        await updateDemandCategory({
          projectId,
          id: createDemandProps?.demandId,
          ...leftValues.changeCategoryFormData,
        })
        await onSaveDemand({ ...leftValues, ...rightValues }, hasNext)
      } catch (error) {
        //
      }
    } else {
      await onSaveDemand({ ...leftValues, ...rightValues }, hasNext)
    }
  }

  useEffect(() => {
    // 把需求创建选择的需求类别填入当前显示的
    setCategoryObj(createCategory)
    if (isCreateDemandVisible) {
      let resultValue
      if (createDemandProps?.notGetPath) {
        resultValue = createDemandProps?.isQuickCreate
          ? null
          : createDemandProps?.projectId
      } else {
        resultValue = paramsData?.id
      }
      //   更新项目id
      setProjectId(resultValue)
      // 如果不是快捷创建，则走获取初始值
      if (!createDemandProps?.isQuickCreate) {
        getInit(resultValue)
      }
    }
  }, [isCreateDemandVisible])

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
              <CommonButton type="secondary" onClick={() => onSaveCategory(1)}>
                {t('common.finishToAdd')}
              </CommonButton>
            )}
            <CommonButton type="primary" onClick={() => onSaveCategory()}>
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
          allCategoryList={allCategoryList}
          categoryParams={categoryObj}
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
