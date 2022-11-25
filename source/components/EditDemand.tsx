// 创建需求和编辑需求的弹窗

/* eslint-disable react/jsx-max-depth */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import {
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  TreeSelect,
  DatePicker,
  Popover,
} from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import TagComponent from '@/views/Project/Detail/Demand/components/TagComponent'
import Editor from '@/components/Editor'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { getNestedChildren, getParamsData, getTypeComponent } from '@/tools'
import {
  PriorityWrap,
  SliderWrap,
  AddWrap,
  ProgressWrapUpload,
  CloseWrap,
} from '@/components/StyleCommon'
import { getTreeList } from '@/services/project/tree'
import { decryptPhp, encryptPhp } from '@/tools/cryptoPhp'
import CommonModal from './CommonModal'

const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: '#2877ff',
})

const ModalWrap = styled(Modal)({
  '.ant-modal-header': {
    display: 'none',
  },
})

const FormWrap = styled(Form)({
  padding: '0 20px 0 2px',
  '.labelIcon': {
    display: 'flex',
    alignItems: 'flex-start',
    svg: {
      fontSize: 16,
      color: '#969799',
      margin: '3px 8px 0 0',
    },
  },
  '.ant-form-item-label': {
    '> label::after': {
      display: 'none',
    },
    '> label': {
      display: 'flex',
      alignItems: 'flex-start',
    },
    '.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after':
      {
        display: 'inline-block',
        color: '#ff4d4f',
        fontSize: 14,
        content: "'*'",
      },
    '> label::before': {
      display: 'none!important',
    },
  },
  '.ant-form-item': {
    width: '100%',
  },
  '.ant-form-item-control-input': {
    minHeight: 'inherit',
  },
})

const ModalHeader = styled.div({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 0,
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
const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 410px)',
})
const RightWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 406,
  paddingLeft: 24,
  borderLeft: '1px solid #EBEDF0',
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

const StatusTag = styled.div<{ color?: string; bgColor?: string }>(
  {
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    cursor: 'pointer',
    marginRight: 8,
    width: 'fit-content',
  },
  ({ color, bgColor }) => ({
    color,
    background: bgColor,
  }),
)

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
  demandId?: any
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
}

const EditDemand = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [changeCategoryForm] = Form.useForm()
  const [attachList, setAttachList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [demandInfo, setDemandInfo] = useState<any>()
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (!props?.notGetPath) {
    paramsData = getParamsData(searchParams)
  }
  const [projectId, setProjectId] = useState(null)
  const [priorityDetail, setPriorityDetail] = useState<any>({})
  const {
    addDemand,
    getDemandInfo,
    updateDemand,
    getDemandList,
    setIsShowProgress,
    percentShow,
    percentVal,
    uploadStatus,
    createCategory,
    setCreateCategory,
    updateDemandCategory,
    setIsUpdateStatus,
    setIsOpenEditDemand,
    setIsUpdateChangeLog,
  } = useModel('demand')
  const {
    memberList,
    projectInfo,
    getMemberList,
    getProjectInfo,
    getFieldList,
    fieldList,
    getCategoryList,
    categoryList,
    colorList,
    getWorkflowList,
    workList,
    selectAllStaffData,
  } = useModel('project')
  const { getIterateSelectList, selectIterate } = useModel('iterate')
  const { userInfo } = useModel('user')
  const { getProjectList, setIsUpdateCreate } = useModel('mine')
  const inputRefDom = useRef<HTMLInputElement>(null)
  const LeftDom = useRef<HTMLInputElement>(null)
  const [parentList, setParentList] = useState<any>([])
  const [isShow, setIsShow] = useState(false)
  const [classTreeData, setClassTreeData] = useState<any>([])
  const [schedule, setSchedule] = useState(0)
  const [projectList, setProjectList] = useState<any>([])
  const [isShowPop, setIsShowPop] = useState(false)
  const [categoryObj, setCategoryObj] = useState<any>(createCategory)
  const [isShowFields, setIsShowFields] = useState(false)
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>({})
  const [allDemandList, setAllDemandList] = useState<any>([])
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})

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
    setDemandList(arr)
    setParentList(arr)
    return arr
  }

  const getFieldData = async (value?: any) => {
    await getFieldList({ projectId: value || projectId })
  }

  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr.length) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res.length ? res.map((i: any) => i.id) : []
  }

  const getInfo = async (
    id: any,
    treeArr?: any,
    categoryData?: any,
    allDemandArr?: any,
  ) => {
    const res = await getDemandInfo({ projectId: id, id: props?.demandId })
    setDemandInfo(res)
    if (res) {
      form.setFieldsValue(res)
      setSchedule(res?.schedule)
      const form1Obj: any = {}
      for (const key in res?.customField) {
        form1Obj[key] =
          res?.customField[key]?.attr === 'date'
            ? res?.customField[key]?.value
              ? moment(res?.customField[key]?.value)
              : ''
            : res?.customField[key]?.value
      }
      form1.setFieldsValue(form1Obj)
      // console.log(res?.attachment)

      setPriorityDetail(res.priority)
      setAttachList(
        res?.attachment.map((i: any) => ({
          url: i.attachment.path,
          id: i.id,
          size: i.attachment.size,
          time: i.created_at,
          name: i.attachment.name,
          suffix: i.attachment.ext,
        })),
      )
      setTagList(
        res?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )
      if (res?.expectedStart) {
        form.setFieldsValue({
          startTime: moment(res.expectedStart || 0),
        })
      }

      if (res?.expectedEnd) {
        form.setFieldsValue({
          endTime: moment(res.expectedStart || 0),
        })
      }

      const resultIterate = selectIterate?.list?.filter(
        (k: any) => k.status === 1,
      )
      const parentArr = demandList
      if (categoryData?.find((j: any) => j.id === res.category)?.length) {
        setCategoryObj({})
      } else {
        setCategoryObj(
          categoryData?.filter((i: any) => i.id === res.category)[0],
        )
      }
      form.setFieldsValue({
        copySendIds: getCommonUser(
          res?.copySend?.map((i: any) => i.copysend),
          selectAllStaffData,
        ),
        attachments: res?.attachment.map((i: any) => i.attachment.path),
        userIds: getCommonUser(
          res?.user?.map((i: any) => i.user),
          memberList,
        ),
        tagIds: res?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
        iterateId: resultIterate.filter((i: any) => i.id === res?.iterateId)
          .length
          ? res?.iterateId
          : null,
        parentId: allDemandArr?.filter((i: any) => i.value === res?.parentId)
          .length
          ? res?.parentId
          : null,
        class: treeArr?.filter((j: any) => j.id === res.class)?.length
          ? res.class
          : res.class === 0
          ? 0
          : null,
      })
    } else {
      form.resetFields()
      form1.resetFields()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }

  const getInit = async (value?: any, categoryId?: any) => {
    setIsOpenEditDemand(true)
    const [classTree, categoryData, allDemandArr] = await Promise.all([
      getTreeList({ id: value || projectId, isTree: 1 }),
      getCategoryList({ projectId: value || projectId, isSelect: true }),
      getList(value || projectId),
      getFieldData(value || projectId),
      getMemberList({
        all: true,
        projectId: value || projectId,
      }),
      getIterateSelectList({ projectId: value || projectId, all: true }),
    ])
    setAllDemandList(allDemandArr)
    setClassTreeData([
      ...[
        {
          title: t('newlyAdd.unclassified'),
          key: 0,
          value: 0,
          children: [],
        },
      ],
      ...getNestedChildren(classTree, 0),
    ])
    if (props?.isQuickCreate || props?.notGetPath) {
      getProjectInfo({ projectId: value || projectId })
    }

    if (props?.demandId) {
      setCategoryObj({})
      getInfo(value || projectId, classTree, categoryData?.list, allDemandArr)
    } else {
      form.setFieldsValue({
        projectId: value,
      })
      setProjectId(value)
      if (props?.isChild) {
        form.setFieldsValue({
          parentId: allDemandArr?.filter(
            (i: any) => i.value === Number(paramsData?.demandId),
          )[0]?.value,
        })
        setCategoryObj(
          categoryData?.list?.filter((i: any) => i.id === props?.categoryId)[0],
        )
      }
      if (props?.isQuickCreate) {
        if (categoryId) {
          setCategoryObj(
            categoryData?.list?.filter((i: any) => i.id === categoryId)[0],
          )
          form.setFieldsValue({
            type: 'need',
          })
        } else {
          setCategoryObj(categoryData?.list[0])
        }
      }
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }

  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    setProjectList(res.data)
    let hisCategoryData: any
    if (localStorage.getItem('quickCreateData')) {
      hisCategoryData = JSON.parse(
        decryptPhp(localStorage.getItem('quickCreateData') as any),
      )
      getInit(hisCategoryData?.projectId, hisCategoryData?.categoryId)
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
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
      if (props?.isQuickCreate) {
        getProjectData()
      } else {
        getInit(resultValue)
      }
    }
  }, [props?.visible])

  const onSaveDemand = async (values: any, hasNext?: any) => {
    if (props?.demandId) {
      await updateDemand({
        projectId,
        id: demandInfo.id,
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
    setAttachList([])
    setTagList([])
    setPriorityDetail({})
    getList()
    setIsShowFields(false)
    setIsOpenEditDemand(false)
    if (props?.isQuickCreate) {
      setIsUpdateCreate(true)
    } else {
      props.onUpdate?.()
    }
    if (hasNext) {
      form.resetFields()
      form.setFieldsValue({
        projectId,
        type: 'need',
      })
      form1.resetFields()
      if (props?.isChild) {
        form.setFieldsValue({
          parentId: allDemandList?.filter(
            (i: any) => i.value === Number(paramsData?.demandId),
          )[0]?.value,
        })
      }
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    } else {
      setChangeCategoryFormData({})
      setCreateCategory({})
      props.onChangeVisible()
      setTimeout(() => {
        form.resetFields()
        form1.resetFields()
      }, 100)
    }

    if (props.isQuickCreate) {
      localStorage.setItem(
        'quickCreateData',
        encryptPhp(
          JSON.stringify({
            projectId,
            type: 'need',
            categoryId: categoryObj?.id,
          }),
        ),
      )
    }
  }

  const onSaveCategory = async (hasNext?: number) => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const values1 = form1.getFieldsValue()

    if (values.startTime) {
      values.expectedStart = moment(values.startTime).format('YYYY-MM-DD')
    }
    if (values.endTime) {
      values.expectedEnd = moment(values.endTime).format('YYYY-MM-DD')
    }

    if (props.iterateId) {
      values.iterateId = props.iterateId
    }

    if (values.priority?.id) {
      values.priority = values.priority?.id
    }

    Object.keys(values1)?.forEach((k: any) => {
      values1[k] = values1[k] ? values1[k] : ''
      const obj = fieldList?.list?.filter((i: any) => k === i.content)[0]
      if (obj?.type?.attr === 'date' && values1[k]) {
        values1[obj.content] = moment(values1[obj.content]).format(
          obj?.type?.value[0] === 'datetime'
            ? 'YYYY-MM-DD HH:mm:ss'
            : 'YYYY-MM-DD',
        )
      } else if (
        obj?.type?.attr === 'select_checkbox' ||
        obj?.type?.attr === 'checkbox'
      ) {
        values1[obj.content] = values1[obj.content]?.length
          ? values1[obj.content]
          : []
      }
    })
    values.category = categoryObj?.id
    values.customField = values1
    if (props?.demandId && JSON.stringify(changeCategoryFormData) !== '{}') {
      try {
        await updateDemandCategory({
          projectId,
          id: demandInfo?.id,
          ...changeCategoryFormData,
        })
        setCurrentCategory({})
        onSaveDemand(values, hasNext)
      } catch (error) {
        //
      }
    } else {
      onSaveDemand(values, hasNext)
    }
  }

  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item,
    })
  }

  const onChangeAttachment = (result: any) => {
    const arr = result.map((i: any) => {
      return {
        url: i.url,
        name: i.name,
        size: i.size,
        ext: i.ext,
        ctime: i.ctime,
      }
    })

    form.setFieldsValue({
      attachments: arr,
    })
  }

  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tagIds: [...(form.getFieldValue('tagIds') || []), ...[result]],
      })
      setTagList([...tagList, ...[result]])
    } else {
      const arr = tagList
      const comResult = arr.filter(
        (i: any) => !(i.name === result.content && i.color === result.color),
      )
      form.setFieldsValue({
        tagIds: comResult,
      })
      setTagList(comResult)
    }
  }

  const onChangeSetSchedule = (val: any) => {
    setSchedule(val)
    form.setFieldsValue({
      schedule: val,
    })
  }

  const onSelectProjectName = (value: any) => {
    form.resetFields(['parentId', 'iterate_id'])
    form1.resetFields()
    form.setFieldsValue({
      users: [],
    })
    getInit(value)
  }

  const onClearProjectId = () => {
    setProjectId(null)
    setCategoryObj({})
    form.resetFields()
    form1.resetFields()
    form.setFieldsValue({
      users: [],
    })
  }

  const onCancel = () => {
    setIsShowProgress(false)
    props.onChangeVisible()
    form.resetFields()
    form1.resetFields()
    setAttachList([])
    setTagList([])
    setPriorityDetail({})
    setCreateCategory({})
    setChangeCategoryFormData({})
    setIsShowFields(false)
    setIsOpenEditDemand(false)
  }

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

  const onChangeSelect = async (value: any) => {
    if (value) {
      setCurrentCategory(
        categoryList?.list.filter((i: any) => i.id === value)[0],
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

  const changeStatus = (
    <div
      style={{
        padding: '4px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {categoryList?.list
        ?.filter((i: any) => (props.demandId ? i.id !== categoryObj.id : i))
        ?.map((k: any) => (
          <LiWrap
            key={k.id}
            color={colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor}
            onClick={() => onClickCategory(k)}
          >
            <StatusTag
              style={{ marginRight: 0 }}
              color={k.color}
              bgColor={
                colorList?.filter((i: any) => i.key === k.color)[0]?.bgColor
              }
            >
              {k.name}
            </StatusTag>
          </LiWrap>
        ))}
    </div>
  )

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onCloseCategory = () => {
    setIsShowChangeCategory(false)
    setTimeout(() => {
      changeCategoryForm.resetFields()
    }, 100)
  }

  const onConfirmCategory = async () => {
    await changeCategoryForm.validateFields()
    setIsShowChangeCategory(false)
    setCategoryObj(currentCategory)
    setChangeCategoryFormData(changeCategoryForm.getFieldsValue())
    setTimeout(() => {
      changeCategoryForm.resetFields()
    }, 100)
  }

  return (
    <>
      {isShowChangeCategory && (
        <CommonModal
          isVisible={isShowChangeCategory}
          onClose={onCloseCategory}
          title={t('newlyAdd.changeCategory')}
          onConfirm={onConfirmCategory}
        >
          <FormWrap
            form={changeCategoryForm}
            layout="vertical"
            style={{ padding: '0 20px 0 2px' }}
          >
            <Form.Item label={t('newlyAdd.beforeCategory')}>
              <StatusTag
                color={categoryObj?.color}
                bgColor={
                  colorList?.filter((i: any) => i.key === categoryObj?.color)[0]
                    ?.bgColor
                }
              >
                <>{categoryObj?.name}</>
              </StatusTag>
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
                options={categoryList?.list
                  ?.filter((i: any) => i.id !== categoryObj.id)
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
          </FormWrap>
        </CommonModal>
      )}
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
                <StatusTag
                  color={
                    categoryList?.list?.filter(
                      (i: any) => i.id === categoryObj?.id,
                    )[0]?.color
                  }
                  bgColor={
                    colorList?.filter(
                      (i: any) =>
                        i.key ===
                        categoryList?.list?.filter(
                          (k: any) => k.id === categoryObj?.id,
                        )[0]?.color,
                    )[0]?.bgColor
                  }
                >
                  <>
                    {
                      categoryList?.list?.filter(
                        (i: any) => i.id === categoryObj?.id,
                      )[0]?.name
                    }
                  </>
                  <IconFont
                    type="down-icon"
                    style={{
                      fontSize: 12,
                      marginLeft: 4,
                      color: '43BA9A',
                    }}
                  />
                </StatusTag>
              </Popover>
            )}
          </div>
          <CloseWrap width={60} height={52} onClick={onCancel}>
            <IconFont type="close" />
          </CloseWrap>
        </ModalHeader>
        <ModalContent>
          <LeftWrap ref={LeftDom}>
            <FormWrap layout="vertical" form={form}>
              {props?.isQuickCreate && (
                <div style={{ display: 'flex' }}>
                  <Form.Item
                    label={
                      <div style={{ fontWeight: 'bold' }}>
                        {t('common.createProject')}
                      </div>
                    }
                    name="projectId"
                    style={{ marginRight: 24 }}
                    rules={[{ required: true, message: '' }]}
                  >
                    <Select
                      onSelect={onSelectProjectName}
                      placeholder={t('common.searchProject')}
                      allowClear
                      showArrow
                      onClear={onClearProjectId}
                      optionFilterProp="label"
                      getPopupContainer={node => node}
                      showSearch
                      options={projectList?.map((k: any) => ({
                        label: k.name,
                        value: k.id,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div style={{ fontWeight: 'bold' }}>
                        {t('mine.createType')}
                      </div>
                    }
                    name="type"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Select
                      placeholder={t('common.selectType')}
                      showArrow
                      optionFilterProp="label"
                      getPopupContainer={node => node}
                    >
                      <Select.Option value="need">
                        {t('common.demand')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              )}
              <Form.Item
                label={
                  <div style={{ fontWeight: 'bold' }}>
                    {t('common.demandName')}
                  </div>
                }
                name="name"
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  autoComplete="off"
                  ref={inputRefDom as any}
                  placeholder={t('common.pleaseDemandName')}
                  maxLength={50}
                  autoFocus
                />
              </Form.Item>
              <Form.Item
                label={
                  <div style={{ fontWeight: 'bold' }}>
                    {t('mine.demandInfo')}
                  </div>
                }
                name="info"
              >
                <Editor height={292} />
              </Form.Item>
              {projectId &&
                projectInfo.projectPermissions?.length > 0 &&
                projectInfo.projectPermissions?.filter(
                  (i: any) => i.name === '编辑需求',
                )?.length > 0 && (
                  <Form.Item
                    label={
                      <div style={{ fontWeight: 'bold' }}>
                        {t('common.tag')}
                      </div>
                    }
                    name="tagIds"
                  >
                    <TagComponent
                      defaultList={tagList}
                      onChangeTag={onChangeTag}
                      isQuick={props.isQuickCreate}
                      addWrap={
                        <AddWrap hasDash>
                          <IconFont type="plus" />
                        </AddWrap>
                      }
                    />
                  </Form.Item>
                )}
              {projectId && (
                <Form.Item
                  label={
                    <div style={{ fontWeight: 'bold' }}>
                      {t('common.attachment')}
                    </div>
                  }
                  name="attachments"
                >
                  <UploadAttach
                    defaultList={attachList}
                    onChangeAttachment={onChangeAttachment}
                    onBottom={onBottom}
                    addWrap={
                      <AddWrap
                        style={{
                          marginBottom: '20px',
                        }}
                        hasColor
                      >
                        <IconFont type="plus" />
                        <div>{t('common.add23')}</div>
                      </AddWrap>
                    }
                  />
                </Form.Item>
              )}
            </FormWrap>
          </LeftWrap>
          <RightWrap>
            <FormWrap layout="vertical" form={form}>
              {props?.demandId && (
                <Form.Item label={t('newlyAdd.demandProgress')} name="schedule">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SliderWrap
                      style={{ width: 330 }}
                      value={schedule}
                      tipFormatter={(value: any) => `${value}%`}
                      onChange={value => onChangeSetSchedule(value)}
                      disabled={
                        !(
                          demandInfo?.user
                            ?.map((i: any) => i.user.id)
                            ?.includes(userInfo?.id) &&
                          demandInfo.status.is_start !== 1 &&
                          demandInfo.status.is_end !== 1
                        )
                      }
                    />
                    <span
                      style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}
                    >
                      {schedule}%
                    </span>
                  </div>
                </Form.Item>
              )}
              <Form.Item label={t('common.dealName')} name="userIds">
                <Select
                  style={{ width: '100%' }}
                  showArrow
                  mode="multiple"
                  disabled={!projectId}
                  showSearch
                  placeholder={t('common.searchDeal')}
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  options={memberList?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                />
              </Form.Item>
              <Form.Item label={t('common.expectedStart')} name="startTime">
                <DatePicker
                  getPopupContainer={node => node}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label={t('common.expectedEnd')} name="endTime">
                <DatePicker
                  getPopupContainer={node => node}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label={t('newlyAdd.demandClass')} name="class">
                <TreeSelect
                  style={{ width: '100%' }}
                  showArrow
                  showSearch
                  placeholder={t('newlyAdd.pleaseClass')}
                  getPopupContainer={node => node}
                  allowClear
                  treeData={classTreeData}
                  disabled={!projectId}
                />
              </Form.Item>
              <Form.Item label={t('common.parentDemand')} name="parentId">
                <Select
                  style={{ width: '100%' }}
                  showArrow
                  showSearch
                  placeholder={t('common.pleaseParentDemand')}
                  disabled={!projectId}
                  options={
                    props?.demandId
                      ? parentList?.filter(
                          (k: any) =>
                            k.value !== props?.demandId &&
                            k.parentId !== props?.demandId &&
                            k.parentId !== demandInfo?.parentId,
                        )
                      : parentList
                  }
                  getPopupContainer={node => node}
                  optionFilterProp="label"
                  allowClear
                />
              </Form.Item>
              <Form.Item label={t('common.priority')} name="priority">
                <PopConfirm
                  content={({ onHide }: { onHide(): void }) => {
                    return (
                      projectId && (
                        <LevelContent
                          onHide={onHide}
                          record={{ project_id: projectId }}
                          onCurrentDetail={onCurrentDetail}
                        />
                      )
                    )
                  }}
                >
                  {projectId ? (
                    <PriorityWrap>
                      <IconFont
                        className="priorityIcon"
                        type={priorityDetail?.icon}
                        style={{
                          fontSize: 20,
                          color: priorityDetail?.color,
                        }}
                      />
                      <div>
                        <span>{priorityDetail?.content_txt || '--'}</span>
                        <IconFont className="icon" type="down-icon" />
                      </div>
                    </PriorityWrap>
                  ) : (
                    <span style={{ cursor: 'not-allowed' }}>--</span>
                  )}
                </PopConfirm>
              </Form.Item>
              <Form.Item label={t('common.iterate')} name="iterateId">
                <Select
                  placeholder={t('common.pleaseSelect')}
                  showSearch
                  showArrow
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  disabled={!projectId}
                  options={selectIterate?.list
                    ?.filter((k: any) => k.status === 1)
                    ?.map((i: any) => ({
                      label: i.name,
                      value: i.id,
                    }))}
                />
              </Form.Item>
              <Form.Item label={t('common.copySend')} name="copySendIds">
                <Select
                  style={{ width: '100%' }}
                  showArrow
                  mode="multiple"
                  showSearch
                  placeholder={t('common.pleaseChooseCopySend')}
                  getPopupContainer={node => node}
                  optionFilterProp="label"
                  options={selectAllStaffData}
                />
              </Form.Item>
            </FormWrap>
            {fieldList?.list && (
              <>
                {!isShowFields && fieldList?.list?.length > 0 && (
                  <ShowLabel onClick={() => setIsShowFields(true)}>
                    {t('newlyAdd.open')}
                  </ShowLabel>
                )}
                <FormWrap
                  layout="vertical"
                  form={form1}
                  style={{ display: isShowFields ? 'block' : 'none' }}
                >
                  {fieldList?.list?.map((i: any) => (
                    <div style={{ display: 'flex' }} key={i.content}>
                      <Form.Item label={i.name} name={i.content}>
                        {getTypeComponent({
                          ...i.type,
                          ...{ remarks: i.remarks },
                        })}
                      </Form.Item>
                    </div>
                  ))}
                </FormWrap>
                {isShowFields && fieldList?.list?.length > 0 && (
                  <ShowLabel onClick={() => setIsShowFields(false)}>
                    {t('newlyAdd.close')}
                  </ShowLabel>
                )}
              </>
            )}
          </RightWrap>
        </ModalContent>
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
