/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-no-leaked-render */
import Editor from '@/components/Editor'
import IconFont from '@/components/IconFont'
import { AddWrap, FormWrapDemand } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { decryptPhp } from '@/tools/cryptoPhp'
import TagComponent from '@/views/Project/Detail/Demand/components/TagComponent'
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import styled from '@emotion/styled'
import { Form, Input, Select } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 410px)',
})

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
  // 需求详情
  demandInfo?: any
}

const EditDemandLeft = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const leftDom = useRef<HTMLInputElement>(null)
  const [projectList, setProjectList] = useState<any>([])
  const {
    projectInfo,
    getProjectInfo,
    setFieldList,
    filterParamsModal,
    getTagList,
    projectInfoValues,
  } = useModel('project')
  const { getProjectList } = useModel('mine')
  const [attachList, setAttachList] = useState<any>([])
  const [tagCheckedList, setTagCheckedList] = useState<any>([])

  // 提交参数
  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.tagIds = tagCheckedList?.map((i: any) => ({
      name: i.name,
      color: i.color,
    }))
    return { ...values }
  }

  // 清空左侧参数
  const onReset = () => {
    form.resetFields()
    setAttachList([])
    setTagCheckedList([])
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

  // 获取项目数据
  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    setProjectList(res.data)
    if (localStorage.getItem('quickCreateData')) {
      const hisCategoryData = JSON.parse(
        decryptPhp(localStorage.getItem('quickCreateData') as any),
      )
      form.setFieldsValue(hisCategoryData)
      getProjectInfo({ projectId: hisCategoryData?.projectId })
      const resultList = await getTagList({
        projectId: hisCategoryData?.projectId,
      })
      props.onChangeProjectId(hisCategoryData?.projectId)
      props.onGetDataAll(
        hisCategoryData?.projectId,
        hisCategoryData?.categoryId,
      )
      setTagCheckedList(
        resultList
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
    if (props?.isQuickCreate) {
      getProjectData()
    }
    // 创建回填筛选数据 --- 标签
    if (filterParamsModal?.tagIds?.length) {
      const resultArr = filterParamsModal?.tagIds?.filter((i: any) => i !== -1)
      setTagCheckedList(
        projectInfoValues
          ?.filter((i: any) => i.key === 'tag')[0]
          ?.children?.filter((k: any) => k.id !== -1)
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
    if (props?.demandId && props?.demandId === props?.demandInfo?.id) {
      setTagCheckedList(
        props.demandInfo?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )

      setAttachList(
        props.demandInfo?.attachment?.map((i: any) => ({
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
        name: props.demandInfo?.name,
        info: props.demandInfo?.info,
        tagIds: props.demandInfo?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      })
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props?.demandId, props.demandInfo])

  // 切换项目
  const onSelectProjectName = async (value: any) => {
    onReset()
    setFieldList({ list: undefined })
    getProjectInfo({ projectId: value })
    await getTagList({
      projectId: value,
    })
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
    setFieldList({ list: undefined })
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

  return (
    <LeftWrap ref={leftDom}>
      <FormWrapDemand layout="vertical" form={form}>
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
                options={projectList
                  ?.filter((i: any) => i.status === 1)
                  ?.map((k: any) => ({
                    label: k.name,
                    value: k.id,
                  }))}
              />
            </Form.Item>
            <Form.Item
              label={
                <div style={{ fontWeight: 'bold' }}>{t('mine.createType')}</div>
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
                <Select.Option value="need">{t('common.demand')}</Select.Option>
              </Select>
            </Form.Item>
          </div>
        )}
        <Form.Item
          getValueFromEvent={event => {
            // eslint-disable-next-line require-unicode-regexp
            return event.target.value.replace(/\s+/g, '')
          }}
          label={
            <div style={{ fontWeight: 'bold' }}>{t('common.demandName')}</div>
          }
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
        <Form.Item
          label={
            <div style={{ fontWeight: 'bold' }}>{t('mine.demandInfo')}</div>
          }
          name="info"
        >
          <Editor height={292} />
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
      </FormWrapDemand>
    </LeftWrap>
  )
}

export default EditDemandLeft
