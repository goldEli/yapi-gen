/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react/jsx-no-leaked-render */
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import RichEditor from '../RichEditor'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo } from '@store/project'
import { Form, Input, Select, Space } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProjectList } from '@/services/mine'
import { getProjectInfo } from '@/services/project'
import { removeNull } from '@/tools'
import { decryptPhp } from '@/tools/cryptoPhp'
import { AddWrap } from '@/components/StyleCommon'
import UploadAttach from '../UploadAttach'
import TagComponent from '../TagComponent'

interface Props {
  // 是否来自快速创建
  isQuickCreate?: boolean
  // 项目id
  projectId: any
  // 修改项目id
  onChangeProjectId(value: any): void
  // 修改项目id后更新相应数据
  onGetDataAll(values: any, categoryId?: any): void
  // 清除右侧的form表单
  onResetForm(): void
  onRef: any
  demandId?: any
  isAllProject?: any
  demandDetail?: any
  allCategoryList?: any
  categoryParams?: any
}

const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 390px)',
  padding: '0 20px 0 16px',
  '.ant-space-item': {
    width: '50%',
  },
})

const CreateDemandLeft = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const leftDom = useRef<HTMLInputElement>(null)
  const [projectList, setProjectList] = useState<any>([])
  const { projectInfo, filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )

  const [attachList, setAttachList] = useState<any>([])
  const [tagCheckedList, setTagCheckedList] = useState<any>([])
  // 切换需求类别下的工作流
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  // 点击需求类别弹出修改需求类别相应参数弹窗
  const [isShowChangeCategory, setIsShowChangeCategory] = useState(false)
  // 存储点击修改需求类别弹出确认按钮时提交的参数
  const [changeCategoryFormData, setChangeCategoryFormData] = useState<any>({})
  const dispatch = useDispatch()

  // 清空左侧参数
  const onReset = () => {
    form.resetFields()
    setAttachList([])
    setTagCheckedList([])
  }

  // 提交参数
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.tagIds = tagCheckedList?.map((i: any) => ({
      name: i.name,
      color: i.color,
    }))
    values.changeCategoryFormData = changeCategoryFormData
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

  useImperativeHandle(props.onRef, () => {
    return {
      confirm: onConfirm,
      reset: onReset,
      update: onSubmitUpdate,
    }
  })

  // 获取项目信息
  const getProjectInfoData = async (id: any) => {
    const result = await getProjectInfo({ projectId: id })
    dispatch(setProjectInfo(result))
  }

  // 获取项目数据
  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    setProjectList(res.data)
    // 获取上次缓存的快速创建参数
    if (localStorage.getItem('quickCreateData')) {
      const hisCategoryData = JSON.parse(
        decryptPhp(localStorage.getItem('quickCreateData') as any),
      )
      form.setFieldsValue(hisCategoryData)
      getProjectInfoData(hisCategoryData?.projectId)
      // 项目更新项目下的所有关联数据
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

    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }

  useEffect(() => {
    getProjectData()
    // 如果是所有项目调用项目信息
    if (props?.isAllProject) {
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
    if (props?.demandId && props?.demandId === props?.demandDetail?.id) {
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
  }, [props?.demandId, props?.demandDetail])

  // 切换项目
  const onSelectProjectName = async (value: any) => {
    onReset()
    getProjectInfoData(value)
    form.setFieldsValue({
      projectId: value,
    })
    props.onChangeProjectId(value)
    props.onGetDataAll(value)
    props.onResetForm()
  }

  // 删除项目
  const onClearProjectId = () => {
    onReset()
    props.onChangeProjectId(null)
    props.onResetForm()
  }

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

  // 监听需求类别的变化
  useEffect(() => {
    form.setFieldsValue({
      category: props.categoryParams.id,
    })
  }, [props.categoryParams])

  return (
    <LeftWrap ref={leftDom}>
      <Form layout="vertical" form={form}>
        <Space style={{ display: 'flex' }}>
          <Form.Item
            label="选择项目"
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
              options={projectList
                ?.filter((i: any) => i.status === 1)
                ?.map((k: any) => ({
                  label: k.name,
                  value: k.id,
                }))}
            />
          </Form.Item>
          <Form.Item
            label="需求类别"
            name="category"
            rules={[{ required: true, message: '' }]}
          >
            <Select
              value={props.categoryParams.id}
              placeholder="请选择需求类别"
              showArrow
              allowClear
              optionFilterProp="label"
              getPopupContainer={node => node}
              options={props.allCategoryList
                ?.filter((i: any) => i.status === 1)
                ?.map((i: any) => ({ label: i.content, value: i.id }))}
            />
          </Form.Item>
        </Space>
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
          <RichEditor height={292} />
        </Form.Item>
        {props.projectId &&
          projectInfo.projectPermissions?.length > 0 &&
          projectInfo.projectPermissions?.filter(
            (i: any) => i.name === '编辑需求',
          )?.length > 0 && (
            <Form.Item
              name="tagIds"
              label={
                <div style={{ fontWeight: 'bold' }}>{t('common.tag')}</div>
              }
            >
              <TagComponent
                defaultList={tagCheckedList}
                onChangeTag={onChangeTag}
                isQuick={props.isQuickCreate}
                addWrap={
                  <AddWrap hasDash>
                    <CommonIconFont type="plus" />
                  </AddWrap>
                }
              />
            </Form.Item>
          )}
        {props.projectId &&
          projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          )?.length > 0 && (
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
                    <CommonIconFont type="plus" />
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
