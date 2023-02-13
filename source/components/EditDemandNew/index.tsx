/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form, message, Modal, Popover, Select, Space } from 'antd'
import EditDemandLeft from './components/EditDemandLeft'
import EditDemandRIght from './components/EditDemandRIght'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useState } from 'react'
import { CanOperationCategory, CloseWrap, FormWrapDemand } from '../StyleCommon'
import IconFont from '../IconFont'
import CommonModal from '../CommonModal'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, removeNull } from '@/tools'
import moment from 'moment'
import { encryptPhp } from '@/tools/cryptoPhp'
import ThrottleButton from '../ThrottleButton'
import { useDispatch, useSelector } from '@store/index'
import { setIsUpdateCreate } from '@store/mine'
import {
  getProjectInfoValues,
  getWorkflowList,
  storyConfigField,
} from '@/services/project'
import { setFilterParamsModal, setProjectInfoValues } from '@store/project'
import {
  setCreateCategory,
  setIsUpdateChangeLog,
  setIsUpdateStatus,
} from '@store/demand'
import {
  addDemand,
  getDemandInfo,
  getDemandList,
  updateDemand,
  updateDemandCategory,
} from '@/services/project/demand'

const ModalWrap = styled(Modal)({
  '.ant-modal-header': {
    display: 'none',
  },
})

const ModalHeader = styled.div({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 16,
  div: {
    display: 'flex',
    alignItems: 'center',
    '.label': {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#323233',
      marginRight: 16,
    },
  },
})

const ModalContent = styled.div({
  display: 'flex',
  height: 'calc(90vh - 126px)',
  justifyContent: 'space-between',
})

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  paddingRight: 24,
})

const LiWrap = styled.div<{ color: any }>(
  {
    cursor: 'pointer',
    padding: '0 16px',
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    background: 'white',
  },
  ({ color }) => ({
    '&: hover': {
      background: color,
    },
  }),
)

interface Props {
  visible: boolean
  onChangeVisible(): void

  // 编辑需求传入的id
  demandId?: any

  // 操作成功后的更新
  onUpdate?(): void

  // 迭代-需求列表带入迭代id
  iterateId?: any

  // 我的模块 - 编辑带入项目id
  projectId?: any

  // 是否为子需求
  isChild?: any

  // 子需求列表
  childList?: any

  // 子需求延用父需求类别
  categoryId?: any

  // 我的-快速创建
  isQuickCreate?: any

  // 用于我的，他的，快速创建取项目id
  notGetPath?: any

  // 是否是需求详情，用于更新需求状态
  isInfo?: any

  // 父需求id --- 和isChild一起使用
  parentId?: any

  // 无数据创建
  noDataCreate?: any

  // 是否是所有项目
  isAllProject?: boolean
}

const EditDemand = (props: Props) => {
  const [t] = useTranslation()
  //   获取地址参数
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (!props?.notGetPath) {
    paramsData = getParamsData(searchParams)
  }
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const [demandInfo, setDemandInfo] = useState<any>({})
  // 切换需求类别下的工作流
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  // 头部显示的需求类别对象
  const [categoryObj, setCategoryObj] = useState<any>({})
  // 项目id
  const [projectId, setProjectId] = useState(null)
  // 父需求列表
  const [parentList, setParentList] = useState<any>([])
  // 自定义字段列表
  const [fieldsList, setFieldsList] = useState<any>([])
  const [allCategoryList, setAllCategoryList] = useState<any>([])
  // 需求类别切换提交表单
  const [changeCategoryForm] = Form.useForm()
  // 点击需求类别是否展示popover弹层
  const [isShowPop, setIsShowPop] = useState(false)
  // 点击需求类别弹出修改需求类别相应参数弹窗
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  // 当前操作的需求类别
  const [currentCategory, setCurrentCategory] = useState<any>({})
  // 存储点击修改需求类别弹出确认按钮时提交的参数
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})
  //   是否是完成并创建下一个 -- 用于提交参数后回填
  const [isSaveParams, setIsSaveParams] = useState(false)
  const { colorList, filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { createCategory } = useSelector(store => store.demand)
  const dispatch = useDispatch()

  // 获取头部标题
  const titleText = () => {
    let text: any
    if (props?.isQuickCreate) {
      text = t('mine.quickCreate')
    } else if (props?.isChild) {
      text = props?.demandId
        ? t('project.editChildDemand')
        : t('common.createChildDemand')
    } else {
      text = props?.demandId
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

  //   获取初始值
  const getInit = async (value?: any, categoryId?: any) => {
    let relyData: any = {}
    // 如果是我的/他的并且是全部项目时，更新项目信息及项目下拉
    if (props.notGetPath && props.isAllProject) {
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
    if (props.demandId) {
      // 重置需求类别
      setCategoryObj({})
      const res = await getDemandInfo({
        projectId: value || projectId,
        id: props?.demandId,
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
      if (props?.isChild) {
        // 判断父需求类别是否被关闭，是则取列表第一条
        const isExistence = resultCategoryList?.filter(
          (i: any) => i.id === props?.categoryId,
        )
        resultCategory = isExistence?.length
          ? isExistence[0]
          : resultCategoryList[0]
      }
      // 如果是快速创建并且有缓存数据
      if (props?.isQuickCreate && categoryId) {
        // 判断需求类别是否被关闭，是则取列表第一条
        const isExistence = resultCategoryList?.filter(
          (i: any) => i.id === categoryId,
        )
        resultCategory = isExistence?.length
          ? isExistence[0]
          : resultCategoryList[0]
      }
      // 如果是快速创建没有缓存数据，取列表第一个
      if ((props?.isQuickCreate && !categoryId) || props.noDataCreate) {
        resultCategory = resultCategoryList[0]
      }
      // 迭代创建 ,当前只有迭代是需要做筛选类别回填
      if (props?.iterateId) {
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

  // 修改需求类别的确认
  const onConfirmCategory = async () => {
    await changeCategoryForm.validateFields()
    setIsShowChangeCategory(false)
    setCategoryObj(currentCategory)
    setChangeCategoryFormData(changeCategoryForm.getFieldsValue())
    setTimeout(() => {
      changeCategoryForm.resetFields()
    }, 100)
  }

  // 关闭修改需求类别
  const onCloseCategory = () => {
    setIsShowChangeCategory(false)
    setTimeout(() => {
      changeCategoryForm.resetFields()
    }, 100)
  }

  // 选择新的需求类别后，获取他的工作流列表
  const onChangeSelect = async (value: any) => {
    if (value) {
      setCurrentCategory(
        allCategoryList
          ?.filter((i: any) => i.status === 1)
          ?.filter((i: any) => i.id === value)[0],
      )
      const result = await getWorkflowList({
        projectId,
        categoryId: value,
      })
      setWorkList(result)
    } else {
      changeCategoryForm.resetFields()
      setCurrentCategory({})
    }
  }

  // 切换需求类别
  const onClickCategory = (item: any) => {
    if (props.demandId) {
      changeCategoryForm.setFieldsValue({
        categoryId: item.id,
      })
      setCurrentCategory(item)
      onChangeSelect(item.id)
      setIsShowChangeCategory(true)
    } else {
      setCategoryObj(item)
      setIsShowPop(false)
    }
  }

  // 切换需求类别下拉选项
  const changeStatus = (
    <div
      style={{
        padding: '4px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {allCategoryList
        ?.filter((i: any) => i.status === 1)
        ?.filter((i: any) => i.id !== categoryObj?.id)
        ?.map((k: any) => (
          <LiWrap
            key={k.id}
            color={colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor}
            onClick={() => onClickCategory(k)}
          >
            <CanOperationCategory
              style={{ marginRight: 0, cursor: 'pointer' }}
              color={k.color}
              bgColor={
                colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor
              }
            >
              <span className="title">{k.content}</span>
            </CanOperationCategory>
          </LiWrap>
        ))}
    </div>
  )

  // 保存数据
  const onSaveDemand = async (values: any, hasNext?: any) => {
    if (props?.demandId) {
      await updateDemand({
        projectId,
        id: props?.demandId,
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
    if (props?.isQuickCreate) {
      dispatch(setIsUpdateCreate(true))
    } else {
      props.onUpdate?.()
    }
    // 如果是快速创建，相应数据存缓存
    if (props.isQuickCreate) {
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
      setChangeCategoryFormData({})
      dispatch(setCreateCategory({}))
      setTimeout(() => {
        leftDom.current?.reset()
        rightDom.current?.reset()
      }, 100)
      props.onChangeVisible()
      dispatch(setFilterParamsModal({}))
      setIsSaveParams(false)
    }
  }

  // 先调用保存需求类别接口，再保存需求
  const onSaveCategory = async (hasNext?: number) => {
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

    if (props?.demandId && JSON.stringify(changeCategoryFormData) !== '{}') {
      try {
        await updateDemandCategory({
          projectId,
          id: props?.demandId,
          ...changeCategoryFormData,
        })
        setCurrentCategory({})
        await onSaveDemand({ ...leftValues, ...rightValues }, hasNext)
      } catch (error) {
        //
      }
    } else {
      await onSaveDemand({ ...leftValues, ...rightValues }, hasNext)
    }
  }

  // 关闭弹窗
  const onCancel = () => {
    props.onChangeVisible()
    // 清除创建需求点击的下拉需求类别 -- 需求
    dispatch(setCreateCategory({}))
    setChangeCategoryFormData({})
    dispatch(setFilterParamsModal({}))
    setIsSaveParams(false)
    setTimeout(() => {
      leftDom.current?.reset()
      rightDom.current?.reset()
    }, 100)
  }

  // 左侧项目切换清除右侧form表单
  const onResetForm = () => {
    setCategoryObj({})
    setAllCategoryList([])
    rightDom?.current.reset()
  }

  useEffect(() => {
    if (props?.visible) {
      // 把需求创建选择的需求类别填入当前显示的
      setCategoryObj(createCategory)
      let resultValue
      if (props?.notGetPath) {
        resultValue = props?.isQuickCreate ? null : props?.projectId
      } else {
        resultValue = paramsData?.id
      }
      //   更新项目id
      setProjectId(resultValue)
      // 如果不是快捷创建，则走获取初始值
      if (!props?.isQuickCreate) {
        getInit(resultValue)
      }
    }
  }, [props?.visible])

  return (
    <>
      {/* 切换需求类别弹出 */}
      <CommonModal
        isVisible={isShowChangeCategory}
        onClose={onCloseCategory}
        title={t('newlyAdd.changeCategory')}
        onConfirm={onConfirmCategory}
      >
        <FormWrapDemand
          form={changeCategoryForm}
          layout="vertical"
          style={{ padding: '0 20px 0 2px' }}
        >
          <Form.Item label={t('newlyAdd.beforeCategory')}>
            <CanOperationCategory
              style={{ marginRight: 8, cursor: 'pointer' }}
              color={categoryObj?.color}
              bgColor={
                colorList?.filter((i: any) => i.key === categoryObj?.color)[0]
                  ?.bgColor
              }
            >
              <span className="title">{categoryObj?.content}</span>
            </CanOperationCategory>
          </Form.Item>
          <Form.Item
            label={t('newlyAdd.afterCategory')}
            name="categoryId"
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
              options={allCategoryList
                ?.filter((i: any) => i.status === 1)
                ?.filter((i: any) => i.id !== categoryObj?.id)
                ?.map((k: any) => ({
                  label: k.content,
                  value: k.id,
                }))}
            />
          </Form.Item>
          <Form.Item
            label={t('newlyAdd.afterStatus')}
            name="statusId"
            rules={[{ required: true, message: '' }]}
          >
            <Select
              placeholder={t('common.pleaseSelect')}
              showArrow
              showSearch
              getPopupContainer={node => node}
              allowClear
              disabled={!currentCategory.id}
              optionFilterProp="label"
              options={workList?.list?.map((k: any) => ({
                label: k.name,
                value: k.statusId,
              }))}
            />
          </Form.Item>
        </FormWrapDemand>
      </CommonModal>
      <ModalWrap
        visible={props.visible}
        width="88%"
        footer={false}
        bodyStyle={{
          padding: '0 4px 0 24px',
          position: 'relative',
          maxHeight: '90vh',
        }}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
        closable={false}
        wrapClassName="vertical-center-modal"
        focusTriggerAfterClose={false}
      >
        <ModalHeader>
          <div>
            <span className="label">{titleText()}</span>
            {categoryObj?.id && (
              <Popover
                key={isShowPop.toString()}
                trigger={['hover']}
                visible={isShowPop}
                placement="bottomLeft"
                content={changeStatus}
                getPopupContainer={node => node}
                onVisibleChange={visible => setIsShowPop(visible)}
              >
                <CanOperationCategory
                  style={{
                    marginRight: 8,
                    cursor:
                      // 没有已开启的需求类别
                      allCategoryList
                        ?.filter((i: any) => i.status === 1)
                        ?.filter((i: any) => i.id !== categoryObj.id)?.length <=
                      0
                        ? 'inherit'
                        : 'pointer',
                  }}
                  color={
                    allCategoryList?.filter(
                      (i: any) => i.id === categoryObj?.id,
                    )[0]?.color
                  }
                  bgColor={
                    colorList?.filter(
                      (i: any) =>
                        i.key ===
                        allCategoryList?.filter(
                          (k: any) => k.id === categoryObj?.id,
                        )[0]?.color,
                    )[0]?.bgColor
                  }
                >
                  <span className="title">
                    {
                      allCategoryList?.filter(
                        (i: any) => i.id === categoryObj?.id,
                      )[0]?.content
                    }
                  </span>
                  {allCategoryList
                    ?.filter((i: any) => i.status === 1)
                    ?.filter((i: any) => i.id !== categoryObj.id)?.length >
                    0 && (
                    <IconFont
                      type="down-icon"
                      style={{
                        fontSize: 12,
                        marginLeft: 4,
                        color: '43BA9A',
                      }}
                    />
                  )}
                </CanOperationCategory>
              </Popover>
            )}
          </div>
          <CloseWrap width={32} height={32} onClick={onCancel}>
            <IconFont type="close" style={{ fontSize: 20 }} />
          </CloseWrap>
        </ModalHeader>
        {props.visible && (
          <ModalContent>
            <EditDemandLeft
              isQuickCreate={props?.isQuickCreate}
              isAllProject={props?.isAllProject}
              projectId={projectId}
              onChangeProjectId={setProjectId}
              onGetDataAll={getQuickInit}
              onResetForm={onResetForm}
              onRef={leftDom}
              demandId={props.demandId}
              demandDetail={demandInfo}
            />
            <EditDemandRIght
              projectId={projectId}
              demandId={props.demandId}
              parentList={parentList}
              onRef={rightDom}
              iterateId={props.iterateId}
              isChild={props.isChild}
              isSaveParams={isSaveParams}
              isQuickCreate={props?.isQuickCreate}
              fieldsList={fieldsList}
              parentId={props.parentId}
              demandDetail={demandInfo}
            />
          </ModalContent>
        )}
        <ModalFooter>
          <Space size={16}>
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            {!props?.demandId && (
              <ThrottleButton thClick={() => onSaveCategory(1)} other>
                {t('common.finishToAdd')}
              </ThrottleButton>
            )}
            <ThrottleButton type="primary" thClick={() => onSaveCategory()}>
              {props?.demandId ? t('common.confirm2') : t('newlyAdd.create')}
            </ThrottleButton>
          </Space>
        </ModalFooter>
      </ModalWrap>
    </>
  )
}

export default EditDemand
