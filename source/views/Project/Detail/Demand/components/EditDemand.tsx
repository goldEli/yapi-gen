/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
/* eslint-disable no-negated-condition */
/* eslint-disable max-lines */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Progress,
  Tooltip,
  TreeSelect,
} from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { LevelContent } from '@/components/Level'
import PopConfirm from '@/components/Popconfirm'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import TagComponent from './TagComponent'
import UploadAttach from './UploadAttach'
import Editor from '@/components/Editor'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { getNestedChildren, getParamsData, getTypeComponent } from '@/tools'
import { PriorityWrap, SliderWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import { getTreeList } from '@/services/project/tree'

const FormWrap = styled(Form)({
  paddingRight: 16,
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
        content: '\'*\'',
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

const ModalFooter = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const AddButtonWrap = styled.div<{ isEdit?: boolean }>(
  {
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
  },
  ({ isEdit }) => ({
    visibility: isEdit ? 'hidden' : 'visible',
  }),
)

interface Props {
  visible: boolean
  onChangeVisible(): void
  id?: any
  onUpdate?(): void
  isIterateId?: any
  preId?: any
}

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 4,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
      ? '1px dashed #969799'
      : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed #2877ff' : '',
      '.anticon': {
        svg: {
          color: '#2877ff',
        },
      },
      div: {
        color: '#2877ff',
      },
    },
  }),
)

const ProgressWrap = styled(Progress)({
  '.ant-progress-status-exception .ant-progress-bg': {
    backgroundColor: '#ff5c5e',
    height: '2px !important',
  },
  '.ant-progress-status-exception .ant-progress-text': {
    color: '#ff5c5e',
  },
  '.ant-progress-success-bg .ant-progress-bg': {
    backgroundColor: '#2877ff',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-bg': {
    backgroundColor: '#43ba9a',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-text': {
    color: '#43ba9a',
  },
  '.ant-progress-inner': {
    height: '2px !important',
    minWidth: 200,
  },
  '.ant-progress-small.ant-progress-line,.ant-progress-small.ant-progress-line .ant-progress-text .anticon':
    {
      fontSize: 10,
    },
})

const EditDemand = (props: Props) => {
  const [t, i18n] = useTranslation()
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [html, setHtml] = useState('')
  const [attachList, setAttachList] = useState<any>([])
  const [tagList, setTagList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [demandInfo, setDemandInfo] = useState<any>()
  const [searchParams] = useSearchParams()
  let projectId: any
  if (props?.preId) {
    projectId = props.preId
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
  }

  const {
    memberList,
    projectInfo,
    getMemberList,
    getProjectInfo,
    getFieldList,
    fieldList,
    getCategoryList,
    categoryList,
  } = useModel('project')
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
  } = useModel('demand')
  const { selectIterate } = useModel('iterate')
  const inputRef = useRef<HTMLInputElement>(null)
  const [parentList, setParentList] = useState<any>([])
  const [isShow, setIsShow] = useState(false)
  const [classTreeData, setClassTreeData] = useState<any>([])
  const [schedule, setSchedule] = useState(0)

  const getList = async () => {
    const result = await getDemandList({ projectId, all: true })
    const arr = result.map((i: any) => ({
      label: i.name,
      value: i.id,
      parentId: i.parentId,
    }))
    setDemandList(arr)
    setParentList(arr)
  }

  const getFieldData = async () => {
    await getFieldList({ projectId })
  }

  const getCommonUser = (arr: any, memberArr: any) => {
    let res: any[] = []
    if (arr.length) {
      res = memberArr?.filter((i: any) => arr.some((k: any) => k.id === i.id))
    }
    return res.length ? res.map((i: any) => i.id) : []
  }

  const getInfo = async (treeArr?: any) => {
    const res = await getDemandInfo({ projectId, id: props?.id })
    setDemandInfo(res)
    getProjectInfo({ projectId: res.projectId })
    const memberArr = await getMemberList({
      all: true,
      projectId: res.projectId,
    })
    if (res) {
      form.setFieldsValue(res)
      setSchedule(res?.schedule)
      if (treeArr?.find((j: any) => j.id === res.class)?.length) {
        form.setFieldsValue({
          'class': '',
        })
      }
      if (categoryList?.list?.find((j: any) => j.id === res.category)?.length) {
        form.setFieldsValue({
          category: '',
        })
      }
      const form1Obj: any = {}
      for (const key in res?.customField) {
        form1Obj[key]
          = res?.customField[key]?.attr === 'date'
            ? res?.customField[key]?.value
              ? moment(res?.customField[key]?.value)
              : ''
            : res?.customField[key]?.value
      }
      form1.setFieldsValue(form1Obj)
      setPriorityDetail(res.priority)
      setHtml(res.info)
      setAttachList(
        res?.attachment.map((i: any) => ({
          path: i.attachment.path,
          id: i.id,
        })),
      )
      setTagList(
        res?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      )
      if (res?.expectedStart || res?.expectedEnd) {
        form.setFieldsValue({
          times: [
            moment(res.expectedStart || 0),
            moment(res.expectedEnd || 1893427200),
          ],
        })
      }

      const parentArr = demandList

      form.setFieldsValue({
        copySendIds: getCommonUser(
          res?.copySend?.map((i: any) => i.copysend),
          memberArr,
        ),
        attachments: res?.attachment.map((i: any) => i.attachment.path),
        userIds: getCommonUser(
          res?.user?.map((i: any) => i.user),
          memberArr,
        ),
        tagIds: res?.tag?.map((i: any) => ({
          id: i.id,
          color: i.tag?.color,
          name: i.tag?.content,
        })),
      })
      if (
        selectIterate?.list?.filter((i: any) => i.id === res?.iterateId).length
      ) {
        form.setFieldsValue({
          iterateId: res?.iterateId,
        })
      }
      if (parentArr?.filter((i: any) => i.value === res?.parentId).length) {
        form.setFieldsValue({
          parentId: res?.parentId,
        })
      }
    } else {
      form.resetFields()
      form1.resetFields()
    }
  }

  const getInit = async () => {
    await getList()
    await getFieldData()
    await getList()
    await getCategoryList({ projectId, isSelect: true })
    const classTree = await getTreeList({ id: projectId, isTree: 1 })
    setClassTreeData([
      ...[
        {
          title: '未分类',
          key: 0,
          value: 0,
          children: [],
        },
      ],
      ...getNestedChildren(classTree, 0),
    ])
    if (props?.id) {
      getInfo(classTree)
    } else {
      form.resetFields()
      form1.resetFields()
    }
  }

  useEffect(() => {
    if (props?.visible) {
      getInit()
    }
  }, [props?.visible])

  useEffect(() => {
    if (!props?.id) {
      form.setFieldsValue({
        category: createCategory?.id,
      })
    }
  }, [categoryList])

  const onSaveDemand = async (hasNext?: number) => {
    await form.validateFields()
    const values = form.getFieldsValue()
    const values1 = form1.getFieldsValue()
    if (values.times && values.times[0]) {
      values.expectedStart = moment(values.times[0]).format('YYYY-MM-DD')
    }
    if (values.times && values.times[1]) {
      values.expectedEnd = moment(values.times[1]).format('YYYY-MM-DD')
    }

    if (props.isIterateId) {
      values.iterateId = props.isIterateId
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
            ? 'YYYY-MM-DD hh:mm:ss'
            : 'YYYY-MM-DD',
        )
      }
    })

    values.customField = values1

    try {
      if (props.id) {
        await updateDemand({
          projectId,
          id: demandInfo.id,
          ...values,
        })
        message.success(t('common.editSuccess'))
      } else {
        await addDemand({
          projectId,
          ...values,
        })
        message.success(t('common.createSuccess'))
      }
      setAttachList([])
      setTagList([])
      setHtml('')
      setPriorityDetail({})
      getList()
      setCreateCategory({})
      props.onUpdate?.()
      if (!hasNext) {
        props.onChangeVisible()
        setTimeout(() => {
          form.resetFields()
          form1.resetFields()
        }, 100)
      } else {
        form.resetFields()
        form1.resetFields()
      }
    } catch (error) {

      //
    }
  }

  const titleText = () => {
    if (props?.id) {
      return t('project.editDemand')
    }
    return t('common.createDemand')
  }

  const onCurrentDetail = (item: any) => {
    setPriorityDetail(item)
    form.setFieldsValue({
      priority: item,
    })
  }

  const onChangeAttachment = (result: any, type: string) => {
    if (type === 'add') {
      result.path = result.url
      form.setFieldsValue({
        attachments: [
          ...form.getFieldValue('attachments') || [],
          ...[result.url],
        ],
      })
      setAttachList([...attachList, ...[result]])
    } else {
      const arr = attachList
      const comResult = arr.filter((i: any) => i.id !== result.uid)
      form.setFieldsValue({
        attachments: comResult.map((i: any) => i.path),
      })
      setAttachList(comResult)
    }
  }

  const onCancel = () => {
    setIsShowProgress(false)
    props.onChangeVisible()
    form.resetFields()
    form1.resetFields()
    setAttachList([])
    setTagList([])
    setHtml('')
    setPriorityDetail({})
    setCreateCategory({})
  }

  const onChangeTag = (result: any, type: string) => {
    if (type === 'add') {
      form.setFieldsValue({
        tagIds: [...form.getFieldValue('tagIds') || [], ...[result]],
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

  const onAdd = () => {
    message.warning(t('common.pleaseProject'))
  }

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      times: _values,
    })
  }

  useEffect(() => {
    if (props.visible) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [props.visible])

  const Children = (item: any) => {
    return (
      <ProgressWrap
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none' }}
      />
    )
  }

  const onChangeSetSchedule = (val: any) => {
    setSchedule(val)
    form.setFieldsValue({
      schedule: val,
    })
  }

  return (
    <Modal
      visible={props.visible}
      width={524}
      footer={false}
      title={titleText()}
      onCancel={onCancel}
      bodyStyle={{
        padding: '16px 24px',
        position: 'relative',
      }}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
    >
      <div style={{ maxHeight: 600, overflow: 'auto' }}>
        <FormWrap
          form={form}
          labelCol={{ span: i18n.language === 'zh' ? 4 : 6 }}
        >
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="category" />
            <Form.Item
              label="需求类别"
              name="category"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                style={{ width: '100%' }}
                showArrow
                showSearch
                placeholder="请选择需求类别"
                disabled={props?.id}
                getPopupContainer={node => node}
                options={categoryList?.list?.map((k: any) => ({
                  label: k.name,
                  value: k.id,
                }))}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="apartment" />
            <Form.Item
              label={t('common.demandName')}
              name="name"
              rules={[{ required: true, message: '' }]}
            >
              <Input
                autoComplete="off"
                ref={inputRef as any}
                placeholder={t('common.pleaseDemandName')}
                maxLength={100}
                autoFocus
              />
            </Form.Item>
          </div>
          {props?.id ? (
            <div style={{ display: 'flex' }}>
              <IconFont className="labelIcon" type="plan" />
              <Form.Item label="需求进度" name="schedule">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <SliderWrap
                    style={{ width: 330 }}
                    value={schedule}
                    tipFormatter={(value: any) => `${value}%`}
                    onChange={value => onChangeSetSchedule(value)}
                  />
                  <span
                    style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}
                  >
                    {schedule}%
                  </span>
                </div>
              </Form.Item>
            </div>
          ) : null}
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="edit-square" />
            <Form.Item label={t('mine.demandInfo')} name="info">
              <Editor />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="user" />
            <Form.Item label={t('common.dealName')} name="userIds">
              <Select
                style={{ width: '100%' }}
                showArrow
                mode="multiple"
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
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="carryout" />
            <Form.Item label={t('common.estimatedTime')} name="times">
              <RangePicker
                isShowQuick={false}
                value={form.getFieldValue('times')}
                onChange={(_values: any) => onChangePicker(_values)}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="gold" />
            <Form.Item label="需求分类" name="class">
              <TreeSelect
                style={{ width: '100%' }}
                showArrow
                showSearch
                placeholder="请选择需求分类"
                getPopupContainer={node => node}
                allowClear
                treeData={classTreeData}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="apartment" />
            <Form.Item label={t('common.parentDemand')} name="parentId">
              <Select
                style={{ width: '100%' }}
                showArrow
                showSearch
                placeholder={t('common.pleaseParentDemand')}
                options={
                  props?.id
                    ? parentList?.filter(
                        (k: any) => k.value !== props?.id
                          && k.parentId !== props?.id
                          && k.parentId !== demandInfo?.parentId,
                      )
                    : parentList
                }
                getPopupContainer={node => node}
                optionFilterProp="label"
                allowClear
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="carryout" />
            <Form.Item label={t('common.priority')} name="priority">
              <PopConfirm
                content={({ onHide }: { onHide(): void }) => {
                  return (
                    <LevelContent
                      onHide={onHide}
                      record={{ project_id: projectId }}
                      onCurrentDetail={onCurrentDetail}
                    />
                  )
                }}
              >
                <PriorityWrap>
                  <IconFont
                    className="priorityIcon"
                    type={priorityDetail?.icon}
                    style={{
                      fontSize: 16,
                      color: priorityDetail?.color,
                    }}
                  />
                  <div>
                    <span>{priorityDetail?.content_txt || '--'}</span>
                    <IconFont className="icon" type="down-icon" />
                  </div>
                </PriorityWrap>
              </PopConfirm>
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="interation" />
            <Form.Item label={t('common.iterate')} name="iterateId">
              <Select
                placeholder={t('common.pleaseSelect')}
                showSearch
                showArrow
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                options={selectIterate?.list
                  ?.filter((k: any) => k.status === 1)
                  ?.map((i: any) => ({
                    label: i.name,
                    value: i.id,
                  }))}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="id-card" />
            <Form.Item label={t('common.copySend')} name="copySendIds">
              <Select
                style={{ width: '100%' }}
                showArrow
                mode="multiple"
                showSearch
                placeholder={t('common.pleaseChooseCopySend')}
                getPopupContainer={node => node}
                optionFilterProp="label"
                options={memberList?.map((i: any) => ({
                  label: i.name,
                  value: i.id,
                }))}
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="app-store-add" />
            <Form.Item label={t('common.tag')} name="tagIds">
              <TagComponent
                defaultList={tagList}
                onChangeTag={onChangeTag}
                addWrap={
                  <AddWrap hasDash>
                    <IconFont type="plus" />
                  </AddWrap>
                }
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex' }}>
            <IconFont className="labelIcon" type="attachment" />
            <Form.Item label={t('common.attachment')} name="attachments">
              {!projectInfo?.projectPermissions?.filter(
                (i: any) => i.name === '附件上传',
              ).length ? (
                <AddWrap onClick={onAdd}>
                  <IconFont type="plus" />
                  <div>{t('common.add23')}</div>
                </AddWrap>
              ) : (
                <UploadAttach
                  child={isShow ? <Children /> : ''}
                  onChangeShow={setIsShow}
                  defaultList={attachList}
                  onChangeAttachment={onChangeAttachment}
                  addWrap={
                    <AddWrap>
                      <IconFont type="plus" />
                      <div>{t('common.add23')}</div>
                    </AddWrap>
                  }
                />
              )}
            </Form.Item>
          </div>
        </FormWrap>
        <FormWrap
          form={form1}
          labelCol={{ span: i18n.language === 'zh' ? 4 : 6 }}
        >
          {fieldList?.list?.map((i: any) => (
            <div style={{ display: 'flex' }} key={i.content}>
              <IconFont className="labelIcon" type="edit" />
              <Form.Item
                label={
                  <Tooltip>
                    <OmitText width={i18n.language === 'zh' ? 80 : 100}>
                      {i.name}
                    </OmitText>
                  </Tooltip>
                }
                name={i.content}
              >
                {getTypeComponent(i.type)}
              </Form.Item>
            </div>
          ))}
        </FormWrap>
      </div>
      <ModalFooter>
        <AddButtonWrap isEdit={props?.id} onClick={() => onSaveDemand(1)}>
          {t('common.finishToAdd')}
        </AddButtonWrap>
        <Space size={16}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" onClick={() => onSaveDemand()}>
            {t('common.confirm2')}
          </Button>
        </Space>
      </ModalFooter>
    </Modal>
  )
}

export default EditDemand
