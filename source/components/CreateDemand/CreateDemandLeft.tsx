/* eslint-disable no-undefined */
/* eslint-disable complexity */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
import { getProjectInfo, getWorkflowList } from '@/services/project'
import { getCategoryConfigList, updateDemandCategory } from '@/services/demand'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Form, Input, Select } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import { AddWrap } from '../StyleCommon'
import TagComponent from '../TagComponent'
import UploadAttach from '../UploadAttach'
import { decryptPhp } from '@/tools/cryptoPhp'
import { removeNull } from '@/tools'
import CommonModal from '../CommonModal'
import MoreOptions from '../MoreOptions'
import { Editor, EditorRef } from '@xyfe/uikit'
import { uploadFileToKey } from '@/services/cos'
import CustomSelect from '../CustomSelect'

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
  demandDetail?: any
  onGetFieldList(list: []): void
  onResetForm(): void
  // 修改项目id
  onChangeProjectId(value: any): void
  // 修改项目id后更新相应数据
  onGetDataAll(values: any, categoryId?: any): void
  // 需求类别对应的需求状态下拉列表
  onChangeWorkStatusList(values: any): void
  onGetCreateDemand(state: boolean): void
  // 修改需求类别同步给右侧
  onChangeCategory(value: any): void
}

export const uploadFile = (file: File, editorRef: any) => {
  const key = uploadFileToKey(
    file,
    file.name,
    `richEditorFiles_${new Date().getTime()}`,
    false,
    data => {
      editorRef?.notifyUploaded(data.key, data.url)
    },
  )
  return key
}

const CreateDemandLeft = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const editorRef = useRef<EditorRef>(null)
  const inputRefDom = useRef<HTMLInputElement>(null)
  const leftDom = useRef<HTMLInputElement>(null)
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
  const { filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { createDemandProps, createCategory } = useSelector(
    store => store.demand,
  )
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
    if (
      createDemandProps.demandId &&
      JSON.stringify(changeCategoryFormData) !== '{}'
    ) {
      await updateDemandCategory({
        projectId: props.projectId,
        id: createDemandProps?.demandId,
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
    if (result?.projectPermissions?.length <= 0) {
      onClearProjectId()
    } else {
      // 是否有创建需求权限
      isCreateDemand = result?.projectPermissions?.filter(
        (i: any) =>
          i.identity ===
          (createDemandProps?.demandId ? 'b/story/update' : 'b/story/save'),
      )?.length

      props.onGetCreateDemand(isCreateDemand)
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

  // 切换需求类别
  const onSelectCategory = async (value: any) => {
    if (value === categoryObj?.id) {
      return
    }
    if (createDemandProps.demandId) {
      changeCategoryForm.setFieldsValue({
        categoryId: value,
      })
      onChangeSelect(value)
      setIsShowChangeCategory(true)
    } else {
      setCategoryObj(
        props.allCategoryList?.filter((i: any) => i.id === value)[0],
      )
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
    props.onResetForm()
    props.onGetFieldList([])
    setCategoryObj({})
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

  useEffect(() => {
    if (categoryObj?.id) {
      form.setFieldsValue({
        requiredCategory: categoryObj?.id,
      })
      getCategoryField(categoryObj?.id)
      getStatusList(categoryObj?.id)
    }
  }, [categoryObj])

  useEffect(() => {
    if (props.projectId && props.allCategoryList?.length > 0) {
      // 过滤掉未开启的类别
      const resultCategoryList = props.allCategoryList?.filter(
        (i: any) => i.status === 1,
      )
      // 如果有需求id
      if (createDemandProps.demandId) {
        //    如果可使用的能查到详情中的需求类别，则使用详情的， 反之使用列表的第一个
        if (
          resultCategoryList?.filter(
            (j: any) => j.id === props.demandDetail.category,
          )?.length
        ) {
          setCategoryObj(
            resultCategoryList?.filter(
              (j: any) => j.id === props.demandDetail.category,
            )[0],
          )
        } else {
          // 反之查所有中的需求类别，做展示用
          setCategoryObj(
            props.allCategoryList?.filter(
              (j: any) => j.id === props.demandDetail.category,
            )[0],
          )
        }
      } else {
        let hisCategoryData: any
        // 如果是快速创建并且有缓存
        if (
          createDemandProps.isQuickCreate &&
          localStorage.getItem('quickCreateData')
        ) {
          hisCategoryData = JSON.parse(
            decryptPhp(localStorage.getItem('quickCreateData') as any),
          )
        }
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
        if (createDemandProps?.isQuickCreate && hisCategoryData?.categoryId) {
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
          (createDemandProps?.isQuickCreate && !hisCategoryData?.categoryId) ||
          createDemandProps.noDataCreate ||
          createDemandProps.overallCreate
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
        // 如果是需求下的选择创建
        if (createCategory.id) {
          resultCategory = createCategory
        }
        //   如果有修改
        if (resultCategory?.id) {
          setCategoryObj(resultCategory)
        }
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
    if (createDemandProps?.isQuickCreate) {
      getProjectData()
    }
    // 如果是所有项目调用项目信息
    if (createDemandProps?.isAllProject) {
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

  // 需求详情返回后给标签及附件数组赋值
  useEffect(() => {
    // 需求id为真并且与需求详情id匹配
    if (
      createDemandProps?.demandId &&
      createDemandProps?.demandId === props?.demandDetail?.id
    ) {
      setTagCheckedList(
        props?.demandDetail?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )
      setAttachList(
        props?.demandDetail?.attachment?.map((i: any) => ({
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
        name: props?.demandDetail?.name,
        info: props?.demandDetail?.info,
        category_id: props.demandDetail?.categoryId,
        tagIds: props?.demandDetail?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      })
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [createDemandProps?.demandId, props?.demandDetail])

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
              <span>{categoryObj.name}</span>
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
              optionLabelProp="label"
              onSelect={onSelectProjectName}
              placeholder={t('common.searchProject')}
              allowClear
              showArrow
              disabled={createDemandProps.projectId}
              onClear={onClearProjectId}
              optionFilterProp="label"
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
            label={t('categoryOfNeeds')}
            name="requiredCategory"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '' }]}
          >
            <CustomSelect
              optionLabelProp="label"
              onSelect={onSelectCategory}
              onClear={onClearCategory}
              placeholder={t('common.selectType')}
              allowClear
              showArrow
              optionFilterProp="label"
              getPopupContainer={(node: any) => node}
              showSearch
              value={categoryObj?.id}
            >
              {props.allCategoryList
                ?.filter((i: any) => i.status === 1)
                ?.map((i: any) => {
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
        </div>
        <Form.Item
          getValueFromEvent={event => {
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
          label={t('common.demandName')}
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder={t('common.pleaseDemandName')}
            maxLength={100}
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
            (i: any) => i.name === '编辑需求',
          )?.length > 0 ||
            projectInfo.projectPermissions?.filter(
              (i: any) => i.name === '创建需求',
            )?.length > 0) && (
            <Form.Item name="tagIds" label={t('common.tag')}>
              <TagComponent
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
