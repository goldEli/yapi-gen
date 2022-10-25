/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import EditLeft from './components/EditLeft'
import EditRight from './components/EditRight'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, getNestedChildren } from '@/tools'
import { useState, useEffect, createRef } from 'react'
import { Button, message, Modal, Space } from 'antd'
import IconFont from '../IconFont'
import { useModel } from '@/models'
import { decryptPhp, encryptPhp } from '@/tools/cryptoPhp'
import { getTreeList } from '@/services/project/tree'

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
  paddingRight: 24,
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
  const [t, i18n] = useTranslation()
  const {
    addDemand,
    getDemandInfo,
    updateDemand,
    setIsShowProgress,
    createCategory,
    setCreateCategory,
    getDemandList,
  } = useModel('demand')
  const { getProjectList, setIsUpdateCreate } = useModel('mine')
  const {
    getProjectInfo,
    getCategoryList,
    categoryList,
    colorList,
    getFieldList,
    getMemberList,
  } = useModel('project')
  const { setIsRefresh } = useModel('user')
  const [searchParams] = useSearchParams()
  let paramsData: any
  if (!props?.notGetPath) {
    paramsData = getParamsData(searchParams)
  }
  const [projectId, setProjectId] = useState(null)
  const [demandInfo, setDemandInfo] = useState<any>()
  const [categoryObj, setCategoryObj] = useState<any>({})
  const [projectList, setProjectList] = useState<any>([])
  const [demandList, setDemandList] = useState<any>([])
  const [parentList, setParentList] = useState<any>([])
  const [classTreeData, setClassTreeData] = useState<any>([])
  const [allMemberArr, setAllMemberArr] = useState<any>([])
  const [allDemandList, setAllDemandList] = useState<any>([])
  const ChildRefLeft: any = createRef()
  const ChildRefRight: any = createRef()

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

  const onCancel = () => {
    setIsShowProgress(false)
    props.onChangeVisible()
    setCreateCategory({})
    ChildRefLeft?.current?.reset()
    ChildRefRight?.current?.reset()
  }

  const onSaveDemand = async (hasNext?: number) => {
    const leftValue = await ChildRefLeft?.current?.confirm()
    const rightValue = await ChildRefRight?.current?.confirm()
    leftValue.category = categoryObj?.id
    const params = { ...leftValue, ...rightValue }
    try {
      if (props?.demandId) {
        await updateDemand({
          projectId,
          id: demandInfo.id,
          ...params,
        })
        message.success(t('common.editSuccess'))
      } else {
        await addDemand({
          projectId,
          ...params,
        })
        message.success(t('common.createSuccess'))
      }
      ChildRefLeft?.current?.reset()
      ChildRefRight?.current?.reset()
      setIsRefresh(true)
      getList()
      if (props?.isQuickCreate) {
        setIsUpdateCreate(true)
      } else {
        props.onUpdate?.()
      }
      if (hasNext) {
        ChildRefLeft?.current?.cleared()
        ChildRefRight?.current?.createNext()
      } else {
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
        setCreateCategory({})
        props.onChangeVisible()
      }
    } catch (error) {

      //
    }
  }

  const getFieldData = async (value?: any) => {
    await getFieldList({ projectId: value || projectId })
  }

  const getInfo = async (id: any, categoryData?: any) => {
    const res = await getDemandInfo({ projectId: id, id: props?.demandId })
    setDemandInfo(res)
    const memberArr = await getMemberList({
      all: true,
      projectId: res.projectId,
    })
    setAllMemberArr(memberArr)
    if (categoryData?.find((j: any) => j.id === res.category)?.length) {
      setCategoryObj({})
    } else {
      setCategoryObj(categoryData?.filter((i: any) => i.id === res.category)[0])
    }
  }

  const getInit = async (value?: any, categoryId?: any) => {
    const [classTree, categoryData, allDemandArr, memberArr]
      = await Promise.all([
        getTreeList({ id: value || projectId, isTree: 1 }),
        getCategoryList({ projectId: value || projectId, isSelect: true }),
        getList(value || projectId),
        getMemberList({
          all: true,
          projectId: value || projectId,
        }),
        getFieldData(value || projectId),
      ])
    setAllDemandList(allDemandArr)
    setAllMemberArr(memberArr)
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
    if (props?.isQuickCreate) {
      getProjectInfo({ projectId: value || projectId })
    }

    if (props?.demandId) {
      setCategoryObj({})
      getInfo(value || projectId, categoryData?.list)
    } else {
      setProjectId(value)
      if (props?.isChild) {
        setCategoryObj(
          categoryData?.list?.filter((i: any) => i.id === props?.categoryId)[0],
        )
      }

      if (props?.isQuickCreate) {
        if (categoryId) {
          setCategoryObj(
            categoryData?.list?.filter((i: any) => i.id === categoryId)[0],
          )
        } else {
          setCategoryObj(categoryData?.list[0])
        }
      }
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
  }

  useEffect(() => {
    if (props?.visible) {

      // 创建需求带入的需求类别
      setCategoryObj(createCategory)
      let value: any
      if (props?.notGetPath) {
        value = props?.isQuickCreate ? null : props?.projectId
      } else {
        value = paramsData?.id
      }
      setProjectId(value)
      if (props?.isQuickCreate) {
        getProjectData()
      } else {
        getInit(value)
      }
    }
  }, [props?.visible])

  const titleText = () => {
    let text: any
    if (props?.isChild) {
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

  // 修改项目 type:1-修改项目，2-清除项目，value: 项目id
  const onChangeProject = (type: any, value?: any) => {
    if (type === 1 && value) {
      getInit(value)
      ChildRefRight?.current?.reset()
    } else {
      setCategoryObj({})
      setProjectId(null)
      ChildRefLeft?.current?.reset()
      ChildRefRight?.current?.reset()
    }
  }

  return (
    <ModalWrap
      visible={props.visible}
      width="96%"
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
          <span className="label">{titleText()}11</span>
          {
            categoryList?.list?.filter((i: any) => i.id === categoryObj?.id)[0]
              ?.name
          }
        </div>
        <IconFont type="close" onClick={onCancel} />
      </ModalHeader>
      <ModalContent>
        <EditLeft
          isQuickCreate={props?.isQuickCreate}
          projectId={projectId}
          projectList={projectList}
          demandInfo={demandInfo}
          onRefLeft={ChildRefLeft}
          onChangeProject={onChangeProject}
        />
        <EditRight
          demandId={props?.demandId}
          demandInfo={demandInfo}
          projectId={projectId}
          memberList={allMemberArr}
          demandList={demandList}
          parentList={parentList}
          classTreeData={classTreeData}
          allDemandList={allDemandList}
          onRefRight={ChildRefRight}
          iterateId={props.iterateId}
          isChild={props.isChild}
          isChildParentId={props.isChild ? paramsData.demandId : null}
        />
      </ModalContent>
      <ModalFooter>
        <Space size={16}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          {!props?.demandId && (
            <AddButtonWrap onClick={() => onSaveDemand(1)}>
              {t('common.finishToAdd')}
            </AddButtonWrap>
          )}
          <Button type="primary" onClick={() => onSaveDemand()}>
            {props?.demandId ? t('common.confirm2') : t('newlyAdd.create')}
          </Button>
        </Space>
      </ModalFooter>
    </ModalWrap>
  )
}

export default EditDemand
