/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
/* eslint-disable require-unicode-regexp */
import { Form, Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { AddWrap } from '../StyleCommon'
import IconFont from '../IconFont'
import UploadAttach from '../UploadAttach'
import { Editor, EditorRef } from '@xyfe/uikit'
import CustomSelect from '../CustomSelect'
import MoreOptions from '../MoreOptions'
import CommonModal from '../CommonModal'
import styled from '@emotion/styled'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import { getProjectInfo, getWorkflowList } from '@/services/project'
import { getCategoryConfigList, updateDemandCategory } from '@/services/demand'
import { decryptPhp } from '@/tools/cryptoPhp'
import { removeNull } from '@/tools'
import { uploadFileToKey } from '@/services/cos'
import DemandTag from '../TagComponent/DemandTag'
import { getParentList } from '@store/project/project.thunk'
import CategoryDropdown from '../CategoryDropdown'
import { AFFAIRS_CHILD_TYPE } from '@/constants'

const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 390px)',
  padding: '0 20px 0 16px',
  '.ant-space-item': {
    width: '50%',
  },
})

const CategoryWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 24px;
  border-radius: 6px;
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

interface Props {
  projectList: any[]
  onRef: any
  allCategoryList: any[]
  projectId: string | number
  detail?: any
  onGetFieldList(list: []): void
  onResetForm(): void
  // 修改项目id
  onChangeProjectId(value: any): void
  // 修改项目id后更新相应数据
  onGetDataAll(values: any, categoryId?: any): void
  // 需求类别对应的需求状态下拉列表
  onChangeWorkStatusList(values: any): void
  onGetCreateWorkItem(state: boolean): void
  // 修改需求类别同步给右侧
  onChangeCategory(value: any): void
  onSaveProjectInfo(info: any): void
}

export const uploadFile = (file: File, editorRef: any, key2?: any) => {
  const key = uploadFileToKey(
    file,
    file.name,
    `richEditorFiles_${new Date().getTime()}`,
    false,
    data => {
      if (key2 === 'copy') {
        editorRef.past(data.url)
      }
      editorRef?.notifyUploaded(data.key, data.url)
    },
  )
  return key
}

const CreateDemandLeft = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const editorRef = useRef<EditorRef>(null)
  const inputRefDom = useRef<HTMLInputElement>(null)
  const leftDom = useRef<HTMLDivElement>(null)
  const [attachList, setAttachList] = useState<any>([])
  const [tagCheckedList, setTagCheckedList] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState<any>({})
  // 存储点击修改需求类别弹出确认按钮时提交的参数
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})
  // 需求类别切换提交表单
  const [changeCategoryForm] = Form.useForm()
  // 切换需求类别下的工作流
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  // 当前操作的需求类别
  const [currentCategory, setCurrentCategory] = useState<any>({})
  // 点击需求类别弹出修改需求类别相应参数弹窗
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  const [categoryObj, setCategoryObj] = useState<any>({})
  const { filterParamsModal, projectInfoValues, addWorkItemModal } =
    useSelector(store => store.project)
  const { params } = addWorkItemModal
  const { createCategory } = useSelector(store => store.project)
  let isCreateDemand = true

  // 获取工作流列表
  const getStatusList = async (value: any) => {
    const result = await getWorkflowList({
      projectId: props.projectId,
      categoryId: value,
    })
    setWorkList(result)
    props.onChangeWorkStatusList(result)
  }

  // 获取需求类别配置的字段
  const getCategoryField = async (id: any) => {
    const result = await getCategoryConfigList({
      projectId: props.projectId,
      categoryId: id,
    })
    props.onGetFieldList(result)
  }

  // 提交参数
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.category_id = categoryObj.id
    values.tagIds = tagCheckedList?.map((i: any) => ({
      name: i.name,
      color: i.color,
    }))
    // 如果是编辑需求并且切换了新的需求类别
    if (params?.editId && JSON.stringify(changeCategoryFormData) !== '{}') {
      await updateDemandCategory({
        projectId: props.projectId,
        id: params?.editId,
        ...changeCategoryFormData,
      })
      setCurrentCategory({})
    }
    return { ...values }
  }

  // 提交参数后的操作
  const onSubmitUpdate = () => {
    setAttachList([])
    form.setFieldsValue({
      info: '',
      name: '',
    })
    // 直接修改form，富文本字段值更新，视图未更新，所以先清除再赋值
    const formValues = form.getFieldsValue()
    form.resetFields()
    form.setFieldsValue(formValues)
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }

  // 清空左侧参数
  const onReset = () => {
    setCategoryObj({})
    form.resetFields()
    setAttachList([])
    setTagCheckedList([])
  }

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
      update: onSubmitUpdate,
    }
  })

  // 修改标签
  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tagIds: [...(form.getFieldValue('tagIds') || []), ...[result]],
      })
      setTagCheckedList([...tagCheckedList, ...[result]])
    } else {
      const arr = tagCheckedList
      const comResult = arr.filter(
        (i: any) => !(i.name === result.content && i.color === result.color),
      )
      form.setFieldsValue({
        tagIds: comResult,
      })
      setTagCheckedList(comResult)
    }
  }

  // 修改附件
  const onChangeAttachment = (result: any) => {
    form.setFieldsValue({
      attachments: result,
    })
  }

  // 附件上传置底
  const onBottom = () => {
    const dom: any = leftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  // 删除项目
  const onClearProjectId = () => {
    onReset()
    props.onChangeProjectId('')
    props.onResetForm()
    props.onGetFieldList([])
  }

  // 获取项目信息
  const getProjectInfoData = async (id: any) => {
    const result = await getProjectInfo({ projectId: id })
    setProjectInfo(result)
    props.onSaveProjectInfo(result)
    if (result?.projectPermissions?.length <= 0) {
      onClearProjectId()
    } else {
      const update =
        result.projectType === 1 ? 'b/story/update' : 'b/transaction/update'
      const save =
        result.projectType === 1 ? 'b/story/save' : 'b/transaction/save'
      // 是否有创建需求权限
      isCreateDemand = result?.projectPermissions?.filter(
        (i: any) => i.identity === (params?.editId ? update : save),
      )?.length

      props.onGetCreateWorkItem(isCreateDemand)
    }
  }

  // 切换项目
  const onSelectProjectName = async (value: any) => {
    onReset()
    form.setFieldsValue({
      projectId: value,
    })
    // 更新项目信息
    getProjectInfoData(value)
    props.onChangeProjectId(value)
    props.onGetFieldList([])
    //清除右侧数据
    props.onResetForm()
    props.onGetDataAll(value)
  }

  // 选择新的需求类别后，获取他的工作流列表
  const onChangeSelect = async (value: any) => {
    if (value) {
      setCurrentCategory(
        props.allCategoryList
          ?.filter((i: any) => i.status === 1)
          ?.filter((i: any) => i.id === value)[0],
      )
      getStatusList(value)
    } else {
      changeCategoryForm.resetFields()
      setCurrentCategory({})
    }
  }

  // 获取父需求列表
  const getParentData = (id: number) => {
    dispatch(
      getParentList({
        projectId: props.projectId,
        id: params?.editId,
        categoryId: id,
      }),
    )
  }

  // 切换需求类别
  const onSelectCategory = async (value: any) => {
    if (value === categoryObj?.id) {
      return
    }
    if (params?.editId) {
      changeCategoryForm.setFieldsValue({
        categoryId: value,
      })
      onChangeSelect(value)
      setIsShowChangeCategory(true)
    } else {
      const result = props.allCategoryList?.filter(
        (i: any) => i.id === value,
      )[0]
      setCategoryObj(result)
    }
  }

  // 修改需求类别的确认
  const onConfirmCategory = async () => {
    await changeCategoryForm.validateFields()
    setIsShowChangeCategory(false)
    setCategoryObj(currentCategory)
    setChangeCategoryFormData(changeCategoryForm.getFieldsValue())
    props.onChangeCategory(changeCategoryForm.getFieldsValue())
    setTimeout(() => {
      changeCategoryForm.resetFields()
    }, 100)
  }

  // 关闭修改需求类别
  const onCloseCategory = () => {
    form.setFieldsValue({
      requiredCategory: categoryObj.id,
    })
    setIsShowChangeCategory(false)
    setTimeout(() => {
      changeCategoryForm.resetFields()
      setChangeCategoryFormData({})
    }, 100)
  }

  // 删除需求类别
  const onClearCategory = () => {
    setCategoryObj({})
    props.onResetForm()
    props.onGetFieldList([])
  }

  // 获取项目数据
  const getProjectData = async () => {
    // 获取上次缓存的快速创建参数
    if (localStorage.getItem('quickCreateData')) {
      const hisCategoryData = JSON.parse(
        decryptPhp(localStorage.getItem('quickCreateData') as any),
      )
      form.setFieldsValue(hisCategoryData)
      getProjectInfoData(hisCategoryData?.projectId)
      // // 项目更新项目下的所有关联数据
      props.onGetDataAll(hisCategoryData?.projectId)
      props.onChangeProjectId(hisCategoryData?.projectId)
      setTagCheckedList(
        removeNull(projectInfoValues, 'tag')
          ?.filter((i: any) =>
            hisCategoryData?.tagIds
              ?.map((k: any) => k.name)
              .some((k: any) => k === i.content),
          )
          ?.map((i: any) => ({
            id: i.id,
            color: i.color,
            name: i.content,
          })),
      )
    }
  }

  // 计算类别
  const computedCategory = () => {
    let result: any = []
    if (params?.type) {
      // type=7的时候返回事务下所有类型，否则返回相应的
      result = props.allCategoryList?.filter((i: any) =>
        params.type === 7
          ? [3, 4, 5, 6].includes(i.work_type) && i.status === 1
          : i.work_type === params.type && i.status === 1,
      )
    } else {
      result = props.allCategoryList?.filter((i: any) => i.status === 1)
    }
    return result
  }

  useEffect(() => {
    if (categoryObj?.id) {
      form.setFieldsValue({
        requiredCategory: categoryObj?.id,
      })
      getCategoryField(categoryObj?.id)
      getStatusList(categoryObj?.id)
      getParentData(categoryObj.id)
      return
    }
    form.setFieldsValue({
      requiredCategory: '',
    })
  }, [categoryObj])

  useEffect(() => {
    if (props.projectId && props.allCategoryList?.length > 0) {
      // 过滤掉未开启的类别
      const resultCategoryList = props.allCategoryList?.filter(
        (i: any) => i.status === 1,
      )
      // 如果有需求id

      if (params?.editId) {
        //    如果可使用的能查到详情中的需求类别，则使用详情的， 反之使用列表的第一个
        if (
          resultCategoryList?.filter((j: any) => j.id === props.detail.category)
            ?.length
        ) {
          const resultObj = resultCategoryList?.filter(
            (j: any) => j.id === props.detail.category,
          )[0]
          setCategoryObj(resultObj)
        } else {
          const resultObj = props.allCategoryList?.filter(
            (j: any) => j.id === props.detail.category,
          )[0]
          // 反之查所有中的需求类别，做展示用
          setCategoryObj(resultObj)
        }
      } else {
        let hisCategoryData: any
        // 如果是快速创建并且有缓存
        if (params?.isQuickCreate && localStorage.getItem('quickCreateData')) {
          hisCategoryData = JSON.parse(
            decryptPhp(localStorage.getItem('quickCreateData') as any),
          )
        }
        let resultCategory: any = {}
        // 如果是创建子需求的话
        if (params?.isChild) {
          // 判断父需求类别是否被关闭，是则取列表第一条
          const isExistence = resultCategoryList?.filter(
            (i: any) => i.id === params?.categoryId,
          )
          resultCategory = isExistence?.length
            ? isExistence[0]
            : resultCategoryList[0]
        }
        // 如果是快速创建并且有缓存数据
        if (params?.isQuickCreate && hisCategoryData?.categoryId) {
          // 判断需求类别是否被关闭，是则取列表第一条
          const isExistence = resultCategoryList?.filter(
            (i: any) => i.id === hisCategoryData?.categoryId,
          )
          resultCategory = isExistence?.length
            ? isExistence[0]
            : resultCategoryList[0]
        }
        // 如果是快速创建没有缓存数据，取列表第一个
        if (
          (params?.isQuickCreate && !hisCategoryData?.categoryId) ||
          params?.noDataCreate ||
          params?.overallCreate
        ) {
          resultCategory = resultCategoryList[0]
        }
        // 迭代创建 ,当前只有迭代是需要做筛选类别回填
        if (params?.iterateId) {
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
        // 如果是需求下的选择创建
        if (createCategory.id) {
          resultCategory = createCategory
        }
        //   如果有修改
        if (resultCategory?.id) {
          setCategoryObj(resultCategory)
        }
      }
      if (params?.type === 4) {
        const resultObj = resultCategoryList?.filter(
          (j: any) => j.work_type === params?.type,
        )[0]
        setCategoryObj(resultObj)
      }
      if (params?.type === 2) {
        const resultObj = resultCategoryList?.filter(
          (j: any) => j.work_type === params?.type,
        )[0]
        setCategoryObj(resultObj)
      }
    }
  }, [props.projectId, props.allCategoryList])

  useEffect(() => {
    if (props.projectId) {
      form.setFieldsValue({
        projectId: props.projectId,
      })
      getProjectInfoData(props.projectId)
    }
  }, [props.projectId])

  useEffect(() => {
    // 是否是快捷创建
    if (params?.isQuickCreate) {
      getProjectData()
    }
    // 如果是所有项目调用项目信息
    if (params?.isAllProject) {
      getProjectInfoData(props?.projectId)
    }
    // 创建回填筛选数据 --- 标签
    if (filterParamsModal?.tagIds?.length) {
      const resultArr = filterParamsModal?.tagIds?.filter((i: any) => i !== -1)
      setTagCheckedList(
        removeNull(projectInfoValues, 'tag')
          ?.filter((i: any) => resultArr.some((k: any) => k === i.id))
          ?.map((i: any) => ({
            id: i.id,
            color: i.color,
            name: i.content,
          })),
      )
    }

    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [])

  const validateMaxNonEmptyLength = (_: any, value: any) => {
    if (value && value.includes(' ')) {
      return Promise.reject('不允许包含空格')
    }
    return Promise.resolve()
  }

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    // 需求id为真并且与需求详情id匹配
    if (params?.editId && params?.editId === props?.detail?.id) {
      setTagCheckedList(
        props?.detail?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )
      setAttachList(
        props?.detail?.attachment?.map((i: any) => ({
          url: i.attachment.path,
          id: i.id,
          size: i.attachment.size,
          time: i.created_at,
          name: i.attachment.name,
          suffix: i.attachment.ext,
          username: i.user_name ?? '--',
        })),
      )
      form.setFieldsValue({
        name: props?.detail?.name,
        info: props?.detail?.info,
        category_id: props.detail?.categoryId,
        tagIds: props?.detail?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      })
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [params?.editId, props?.detail])

  return (
    <LeftWrap ref={leftDom}>
      {/* 切换需求类别弹出 */}
      <CommonModal
        isVisible={isShowChangeCategory}
        onClose={onCloseCategory}
        title={t('newlyAdd.changeCategory')}
        onConfirm={onConfirmCategory}
      >
        <Form
          form={changeCategoryForm}
          layout="vertical"
          style={{ padding: '0 20px 0 24px' }}
        >
          <Form.Item label={t('newlyAdd.beforeCategory')}>
            <CategoryWrap>
              <img src={categoryObj?.category_attachment} alt="" />
              <span>{categoryObj?.name}</span>
            </CategoryWrap>
          </Form.Item>
          <Form.Item
            label={t('newlyAdd.afterCategory')}
            name="categoryId"
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              placeholder={t('common.pleaseSelect')}
              showArrow
              showSearch
              getPopupContainer={(node: any) => node}
              allowClear
              optionFilterProp="label"
              onChange={onChangeSelect}
              options={props.allCategoryList
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
            <CustomSelect
              placeholder={t('common.pleaseSelect')}
              showArrow
              showSearch
              getPopupContainer={(node: any) => node}
              allowClear
              disabled={!currentCategory.id}
              optionFilterProp="label"
              options={workList?.list?.map((k: any) => ({
                label: k.name,
                value: k.statusId,
              }))}
            />
          </Form.Item>
        </Form>
      </CommonModal>
      <Form layout="vertical" form={form} disabled={!isCreateDemand}>
        <div style={{ display: 'flex' }}>
          <Form.Item
            label={t('common.createProject')}
            name="projectId"
            style={{ marginRight: 24, width: '50%' }}
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              onSelect={onSelectProjectName}
              placeholder={t('common.searchProject')}
              allowClear
              showArrow
              disabled={params?.projectId}
              onClear={onClearProjectId}
              getPopupContainer={(node: any) => node}
              showSearch
            >
              {props.projectList
                ?.filter((i: any) => i.status === 1)
                ?.map((i: any) => {
                  return (
                    <Select.Option value={i.id} key={i.id} label={i.name}>
                      <MoreOptions
                        type="project"
                        name={i.name}
                        dec={i.dec}
                        img={i.cover}
                      />
                    </Select.Option>
                  )
                })}
            </CustomSelect>
          </Form.Item>
          <Form.Item
            label="类别"
            name="requiredCategory"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '' }]}
          >
            <CategoryDropdown
              footer={false}
              categoryList={computedCategory()?.map((i: any) => ({
                ...i,
                labelName: i.name,
                attachmentPath: i.category_attachment,
              }))}
              projectId={props.projectId as number}
              value={categoryObj?.id}
              onChangeCallBack={(val: number) => {
                //
                onSelectCategory(val)
              }}
              onClearCallback={() => {
                //
                onClearCategory()
              }}
              bordered
            />
            {/* {categoryObj?.id} */}
            {/* <CustomSelect
              onSelect={onSelectCategory}
              onClear={onClearCategory}
              placeholder={t('common.selectType')}
              allowClear
              showArrow
              getPopupContainer={(node: any) => node}
              showSearch
              value={categoryObj?.id}
              disabled={!props.projectId}
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
            </CustomSelect> */}
          </Form.Item>
        </div>
        <Form.Item
          getValueFromEvent={event => {
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
          label="标题"
          name="name"
          rules={[
            { required: true, message: '请输入内容' },
            { max: 100, message: '最大长度为100个字符' },
            { validator: validateMaxNonEmptyLength },
          ]}
        >
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder="请输入标题"
            autoFocus
          />
        </Form.Item>
        <Form.Item label={t('mine.demandInfo')} name="info">
          <Editor
            ref={editorRef}
            upload={uploadFile}
            getSuggestions={() => []}
          />
        </Form.Item>
        {props.projectId &&
          projectInfo.projectPermissions?.length > 0 &&
          (projectInfo.projectPermissions?.filter(
            (i: any) =>
              i.identity ===
              (projectInfo.projectType === 1
                ? 'b/story/update'
                : 'b/transaction/update'),
          )?.length > 0 ||
            projectInfo.projectPermissions?.filter(
              (i: any) =>
                i.identity ===
                (projectInfo.projectType === 1
                  ? 'b/story/save'
                  : 'b/transaction/save'),
            )?.length > 0) && (
            <Form.Item name="tagIds" label={t('common.tag')}>
              {/* 需判断是冲刺还是迭代 */}
              <DemandTag
                defaultList={tagCheckedList}
                onChangeTag={onChangeTag}
                isQuick
                addWrap={
                  <AddWrap hasDash>
                    <IconFont type="plus" />
                  </AddWrap>
                }
              />
            </Form.Item>
          )}
        {props.projectId &&
          projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          )?.length > 0 && (
            <Form.Item label={t('common.attachment')} name="attachments">
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
      </Form>
    </LeftWrap>
  )
}

export default CreateDemandLeft
