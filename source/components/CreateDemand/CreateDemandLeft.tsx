/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
import { getProjectInfo } from '@/services/project'
import { getCategoryConfigList } from '@/services/demand'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo } from '@store/project'
import { Form, Input, Select } from 'antd'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import RichEditor from '../RichEditor'
import { AddWrap } from '../StyleCommon'
import TagComponent from '../TagComponent'
import UploadAttach from '../UploadAttach'
import { decryptPhp } from '@/tools/cryptoPhp'
import { removeNull } from '@/tools'

const LeftWrap = styled.div({
  height: '100%',
  overflow: 'auto',
  width: 'calc(100% - 390px)',
  padding: '0 20px 0 16px',
  '.ant-space-item': {
    width: '50%',
  },
})

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
}

const CreateDemandLeft = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const leftDom = useRef<HTMLInputElement>(null)
  const [attachList, setAttachList] = useState<any>([])
  const [tagCheckedList, setTagCheckedList] = useState<any>([])
  const { projectInfo, filterParamsModal, projectInfoValues } = useSelector(
    store => store.project,
  )
  const { createDemandProps } = useSelector(store => store.demand)

  // 提交参数
  const onConfirm = () => {
    form.validateFields()
    form.validateFields().then(() => {
      const values = form.getFieldsValue()
      values.tagIds = tagCheckedList?.map((i: any) => ({
        name: i.name,
        color: i.color,
      }))
      return { ...values }
    })
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
    form.resetFields()
    setAttachList([])
    setTagCheckedList([])
    dispatch(setProjectInfo({}))
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

  // 获取项目信息
  const getProjectInfoData = async (id: any) => {
    const result = await getProjectInfo({ projectId: id })
    dispatch(setProjectInfo(result))
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
    //清除右侧数据
    props.onResetForm()
    props.onGetDataAll(value)
    props.onGetFieldList([])
  }

  // 删除项目
  const onClearProjectId = () => {
    onReset()
    props.onChangeProjectId('')
    props.onResetForm()
    props.onGetFieldList([])
  }

  // 切换需求类别
  const onSelectCategory = async (value: any) => {
    const result = await getCategoryConfigList({
      projectId: props.projectId,
      categoryId: value,
    })
    props.onGetFieldList(result)
  }

  // 删除需求类别
  const onClearCategory = () => {
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
      <Form layout="vertical" form={form}>
        <div style={{ display: 'flex' }}>
          <Form.Item
            label={t('common.createProject')}
            name="projectId"
            style={{ marginRight: 24, width: '50%' }}
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
              options={props.projectList
                ?.filter((i: any) => i.status === 1)
                ?.map((k: any) => ({
                  label: k.name,
                  value: k.id,
                }))}
            />
          </Form.Item>
          <Form.Item
            label="需求类别"
            name="category_id"
            style={{ width: '50%' }}
            rules={[{ required: true, message: '' }]}
          >
            <Select
              onSelect={onSelectCategory}
              onClear={onClearCategory}
              placeholder={t('common.selectType')}
              allowClear
              showArrow
              optionFilterProp="label"
              getPopupContainer={node => node}
              showSearch
              options={props.allCategoryList
                ?.filter((i: any) => i.status === 1)
                ?.map((k: any) => ({
                  label: k.content,
                  value: k.id,
                }))}
            >
              <Select.Option value="need">{t('common.demand')}</Select.Option>
            </Select>
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
          <RichEditor />
        </Form.Item>
        {props.projectId &&
          projectInfo.projectPermissions?.length > 0 &&
          projectInfo.projectPermissions?.filter(
            (i: any) => i.name === '编辑需求',
          )?.length > 0 && (
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
