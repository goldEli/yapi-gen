/* eslint-disable react/no-unstable-nested-components */
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
import UploadAttach from '@/views/Project/Detail/Demand/components/UploadAttach'
import TagComponent from '@/views/Project/Detail/Demand/components/TagComponent'
import Editor from '@/components/Editor'
import { useEffect, useRef, useState } from 'react'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'
import { getNestedChildren, getParamsData, getTypeComponent } from '@/tools'
import { PriorityWrap, SliderWrap, AddWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import { getTreeList } from '@/services/project/tree'

const ModalWrap = styled(Modal)({
  '.ant-modal-header': {
    display: 'none',
  },
})

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

const ModalHeader = styled.div({
  height: 54,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  div: {
    display: 'flex',
    alignItems: 'center',
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

  // 我的-快速创建
  isQuickCreate?: any
}

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
  if (props?.projectId) {
    projectId = props.projectId
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
  }
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
  const { selectIterate } = useModel('iterate')
  const { setIsRefresh } = useModel('user')
  const inputRefDom = useRef<HTMLInputElement>(null)
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

    //
  }

  const getInit = async () => {
    const [classTree] = await Promise.all([
      getTreeList({ id: projectId, isTree: 1 }),
      getList(),
      getFieldData(),
      getCategoryList({ projectId, isSelect: true }),
    ])
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
    if (props?.demandId) {
      getInfo(classTree)
    } else {
      form.resetFields()
      form1.resetFields()
      form.setFieldsValue({
        category: createCategory?.id,
      })
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }

  useEffect(() => {
    if (props?.visible) {
      getInit()
    }
  }, [props?.visible])

  const onSaveDemand = async (hasNext?: number) => {

    //
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

  const Children = () => {
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

  const titleText = () => {
    let text: any
    if (props?.isChild) {
      text = props?.demandId ? '编辑子需求' : '创建子需求'
    } else {
      text = props?.demandId
        ? t('project.editDemand')
        : t('common.createDemand')
    }
    return text
  }

  return (
    <ModalWrap
      visible={props.visible}
      width="96%"
      footer={false}
      bodyStyle={{
        padding: '16px 24px',
        position: 'relative',
      }}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      closable={false}
    >
      <ModalHeader>
        <div>
          <span>{titleText()}</span>
          <div>
            <span>需求类别</span>
            <IconFont type="tableDown" />
          </div>
        </div>
      </ModalHeader>
    </ModalWrap>
  )
}

export default EditDemand
