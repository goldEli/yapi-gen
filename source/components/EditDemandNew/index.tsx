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
import { useModel } from '@/models'
import IconFont from '../IconFont'
import CommonModal from '../CommonModal'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { getTreeList } from '@/services/project/tree'
import moment from 'moment'
import { encryptPhp } from '@/tools/cryptoPhp'

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

const AddButtonWrap = styled.div({
  height: 32,
  boxSizing: 'border-box',
  borderRadius: 6,
  border: '1px solid #2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2877FF',
  padding: '0 16px',
  cursor: 'pointer',
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
}

const EditDemand = (props: Props) => {
  const [t] = useTranslation()
  const rightDom: any = createRef()
  const leftDom: any = createRef()
  const [isSaveParams, setIsSaveParams] = useState(false)
  // 需求类别切换提交表单
  const [changeCategoryForm] = Form.useForm()
  // 点击需求类别是否展示popover弹层
  const [isShowPop, setIsShowPop] = useState(false)
  // 点击需求类别弹出修改需求类别相应参数弹窗
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  // 头部显示的需求类别对象
  const [categoryObj, setCategoryObj] = useState<any>({})
  // 存储点击修改需求类别弹出确认按钮时提交的参数
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})
  // 当前操作的需求类别
  const [currentCategory, setCurrentCategory] = useState<any>({})
  // 项目id
  const [projectId, setProjectId] = useState(null)
  // 需求分类
  const [treeArr, setTreeArr] = useState([])
  // 父需求列表
  const [parentList, setParentList] = useState<any>([])
  const [fieldsList, setFieldsList] = useState<any>([])
  // 需求详情
  const [demandInfo, setDemandInfo] = useState<any>({})
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (!props?.notGetPath) {
    paramsData = getParamsData(searchParams)
  }
  const { getIterateSelectList } = useModel('iterate')
  const {
    colorList,
    getWorkflowList,
    workList,
    categoryEditList,
    getCategoryEditList,
    getMemberList,
    getFieldList,
    filterParamsModal,
    setFilterParamsModal,
    getPriorityList,
  } = useModel('project')
  const {
    setCreateCategory,
    setIsUpdateStatus,
    setIsOpenEditDemand,
    setIsUpdateChangeLog,
    getDemandList,
    createCategory,
    getDemandInfo,
    updateDemandCategory,
    updateDemand,
    addDemand,
  } = useModel('demand')
  const { setIsUpdateCreate } = useModel('mine')

  // 获取需求列表
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

  // 获取回填Info数据的下拉数据
  const getInit = async (value?: any, categoryId?: any) => {
    setIsOpenEditDemand(true)
    const [classTree, categoryData, fieldsData] = await Promise.all([
      getTreeList({ id: value || projectId, isTree: 1 }),
      // 获取全部的需求列表
      getCategoryEditList({ projectId: value || projectId, isEdit: true }),
      getFieldList({ projectId: value || projectId }),
      getList(value || projectId),
      getMemberList({
        all: true,
        projectId: value || projectId,
      }),
      getIterateSelectList({ projectId: value || projectId, all: true }),
      getPriorityList({ projectId: value || projectId, type: 'priority' }),
    ])
    setTreeArr(classTree)
    setFieldsList(fieldsData?.list)
    // 过滤掉未开启的类别
    const resultCategoryList = categoryData?.list?.filter(
      (i: any) => i.isCheck === 1,
    )

    //  没有需id时，则是创建需求
    if (props.demandId) {
      setCategoryObj({})
      const res = await getDemandInfo({
        projectId: value || projectId,
        id: props?.demandId,
      })
      setDemandInfo(res)
      if (
        resultCategoryList?.filter((j: any) => j.id === res.category)?.length
      ) {
        setCategoryObj(
          resultCategoryList?.filter((j: any) => j.id === res.category)[0],
        )
      } else {
        setCategoryObj(
          categoryData?.list?.filter((j: any) => j.id === res.category)[0],
        )
      }
    } else {
      setProjectId(value)
      // 如果是子需求的话，继承父级的需求类别
      if (props?.isChild) {
        // 判断父需求类别是否被关闭，是则取列表第一条
        const isExistence = resultCategoryList?.filter(
          (i: any) => i.id === props?.categoryId,
        )
        setCategoryObj(
          isExistence?.length ? isExistence[0] : resultCategoryList[0],
        )
      }
      // 如果是快速创建并且有缓存数据
      if (props?.isQuickCreate && categoryId) {
        setCategoryObj(
          resultCategoryList?.filter((i: any) => i.id === categoryId)[0],
        )
      }
      // 如果是快速创建没有缓存数据，取列表第一个
      if ((props?.isQuickCreate && !categoryId) || props.noDataCreate) {
        setCategoryObj(resultCategoryList[0])
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
          setCategoryObj(resultObj)
        } else {
          setCategoryObj(resultCategoryList[0])
        }
      }
    }
  }

  useEffect(() => {
    if (props?.visible) {
      setCategoryObj(createCategory)
      let resultValue
      if (props?.notGetPath) {
        resultValue = props?.isQuickCreate ? null : props?.projectId
      } else {
        resultValue = paramsData?.id
      }
      setProjectId(resultValue)
      if (!props?.isQuickCreate) {
        getInit(resultValue)
      }
    }
  }, [props?.visible])

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

  // 选择新的需求类别后，获取他的工作流列表
  const onChangeSelect = async (value: any) => {
    if (value) {
      setCurrentCategory(
        categoryEditList?.list
          ?.filter((i: any) => i.isCheck === 1)
          ?.filter((i: any) => i.id === value)[0],
      )
      await getWorkflowList({
        projectId,
        categoryId: value,
      })
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
      {categoryEditList?.list
        ?.filter((i: any) => i.isCheck === 1)
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
              <span className="title">{k.name}</span>
            </CanOperationCategory>
          </LiWrap>
        ))}
    </div>
  )

  // 关闭弹窗
  const onCancel = () => {
    leftDom.current?.reset()
    rightDom.current?.reset()
    props.onChangeVisible()
    setCreateCategory({})
    setChangeCategoryFormData({})
    setIsOpenEditDemand(false)
    setFilterParamsModal({})
    setIsSaveParams(false)
  }

  // 保存数据
  const onSaveDemand = async (values: any, hasNext?: any) => {
    if (props?.demandId) {
      await updateDemand({
        projectId,
        id: props?.demandId,
        ...values,
      })
      message.success(t('common.editSuccess'))
      setIsUpdateStatus(true)
      setIsUpdateChangeLog(true)
    } else {
      await addDemand({
        projectId,
        ...values,
      })
      message.success(t('common.createSuccess'))
    }
    // 更新父需求列表
    getList()
    // 是否是快捷创建，是则要刷新相应的列表接口
    if (props?.isQuickCreate) {
      setIsUpdateCreate(true)
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
      rightDom.current.update()
      setIsSaveParams(true)
    } else {
      setChangeCategoryFormData({})
      setCreateCategory({})
      setTimeout(() => {
        leftDom.current?.reset()
        rightDom.current?.reset()
      }, 100)
      props.onChangeVisible()
      setFilterParamsModal({})
      setIsSaveParams(false)
    }
  }

  // 先调用保存需求类别接口，再保存需求
  const onSaveCategory = async (hasNext?: number) => {
    const leftValues = await leftDom.current.confirm()
    const rightValues = rightDom.current.confirm()

    if (rightValues.startTime) {
      rightValues.expectedStart = moment(rightValues.startTime).format(
        'YYYY-MM-DD',
      )
    }
    if (rightValues.endTime) {
      rightValues.expectedEnd = moment(rightValues.endTime).format('YYYY-MM-DD')
    }

    if (props.iterateId) {
      rightValues.iterateId = props.iterateId
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

  // 左侧项目切换清除右侧form表单
  const onResetForm = () => {
    rightDom.current.reset()
    setCategoryObj({})
  }

  return (
    <>
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
              <span className="title">{categoryObj?.name}</span>
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
              options={categoryEditList?.list
                ?.filter((i: any) => i.isCheck === 1)
                ?.filter((i: any) => i.id !== categoryObj?.id)
                ?.map((k: any) => ({
                  label: k.name,
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
                      categoryEditList?.list
                        ?.filter((i: any) => i.isCheck === 1)
                        ?.filter((i: any) => i.id !== categoryObj.id)?.length <=
                      0
                        ? 'inherit'
                        : 'pointer',
                  }}
                  color={
                    categoryEditList?.list?.filter(
                      (i: any) => i.id === categoryObj?.id,
                    )[0]?.color
                  }
                  bgColor={
                    colorList?.filter(
                      (i: any) =>
                        i.key ===
                        categoryEditList?.list?.filter(
                          (k: any) => k.id === categoryObj?.id,
                        )[0]?.color,
                    )[0]?.bgColor
                  }
                >
                  <span className="title">
                    {
                      categoryEditList?.list?.filter(
                        (i: any) => i.id === categoryObj?.id,
                      )[0]?.name
                    }
                  </span>
                  {categoryEditList?.list
                    ?.filter((i: any) => i.isCheck === 1)
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
              projectId={projectId}
              onChangeProjectId={setProjectId}
              onGetDataAll={getInit}
              onResetForm={onResetForm}
              onRef={leftDom}
              demandId={props.demandId}
              demandInfo={demandInfo}
            />
            <EditDemandRIght
              projectId={projectId}
              demandId={props.demandId}
              parentList={parentList}
              onRef={rightDom}
              treeArr={treeArr}
              iterateId={props.iterateId}
              info={demandInfo}
              isChild={props.isChild}
              isSaveParams={isSaveParams}
              isQuickCreate={props?.isQuickCreate}
              fieldsList={fieldsList}
              parentId={props.parentId}
            />
          </ModalContent>
        )}

        <ModalFooter>
          <Space size={16}>
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            {!props?.demandId && (
              <AddButtonWrap onClick={() => onSaveCategory(1)}>
                {t('common.finishToAdd')}
              </AddButtonWrap>
            )}
            <Button type="primary" onClick={() => onSaveCategory()}>
              {props?.demandId ? t('common.confirm2') : t('newlyAdd.create')}
            </Button>
          </Space>
        </ModalFooter>
      </ModalWrap>
    </>
  )
}

export default EditDemand
