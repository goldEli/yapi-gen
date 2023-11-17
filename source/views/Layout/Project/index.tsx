/* eslint-disable no-undefined */
import { useState, useEffect } from 'react'
import HeaderFilter from './components/HeaderFilter'
import { ProjectWrap, ProjectIndexWrap } from './style'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { Spin } from 'antd'
import MainGrid from '@/components/MainGrid/MainGrid'
import MainTable from '@/components/MainTable/MainTable'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'
import {
  deleteProject,
  getProjectList,
  openProject,
  stopProject,
  suspendProject,
  setProjectSort,
} from '@/services/project'
import DeleteConfirm from '@/components/DeleteConfirm'
import GuideModal from '@/components/GuideModal'
import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { getLoginDetail } from '@store/user/user.thunk'

const ProjectIndex = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { isUpdateProject } = useSelector(store => store.createProject)
  // 缩略图还是列表
  const [isSpinning, setIsSpinning] = useState(false)
  // 开始、关闭、暂停的弹窗状态
  const [isStatusState, setIsStatusState] = useState(false)
  // 是否删除项目
  const [isDelete, setIsDelete] = useState(false)
  // 当前操作的数据
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  // 筛选条件默认值
  const [filterParams, setFilterParams] = useState({
    // 状态
    status: 0,
    // 搜索值
    keyword: '',
    // 项目周期
    time: [],
    //其他的类型(迭代，冲刺、我参与的)
    otherType: [1, 2, 3],
    pageObj: { page: 1, size: 30 },
    order: { value: '', key: '' },
    isGrid: false,
  })

  const inform = [
    {
      key: 0,
      title: t('project.stepTitle1'),
      desc: t('project.stepDesc1'),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/iteration/guide_1.jpg',
    },
    {
      key: 1,
      title: t('project.stepTitle2'),
      desc: t('project.stepDesc2'),
      extra: t('project.stepExtra'),
      img: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/iteration/guide_2.jpg',
    },
  ]

  // 获取数据
  const getList = async (params: any, notSpin?: boolean) => {
    setIsSpinning(notSpin ? false : true)
    const paramsObj: any = {
      searchValue: params?.keyword,
      orderKey: params?.order?.key,
      order: params?.order?.value,
      status: params.status,
      project_types: params.otherType,
      time: params.time,
    }
    if (params?.isGrid) {
      paramsObj.all = true
    } else {
      paramsObj.page = params.pageObj.page
      paramsObj.pageSize = params.pageObj.size
    }

    const result = await getProjectList(paramsObj)
    setDataList(result)
    setIsSpinning(false)
  }

  //   筛选条件变化后更新数据 或者是 刷新
  const onChangeParamsUpdate = (params: any, notSpin?: boolean) => {
    setFilterParams(params)
    getList(params, notSpin)
  }

  //  修改分页
  const onChangePageNavigation = (item: any) => {
    onChangeParamsUpdate({
      ...filterParams,
      pageObj: {
        page: item.page,
        size: item.size,
      },
    })
  }

  // 修改排序值
  const onUpdateOrderKey = (item: any) => {
    onChangeParamsUpdate({
      ...filterParams,
      order: item,
      pageObj: {
        page: 1,
        size: filterParams?.pageObj.size,
      },
    })
  }

  // 删除确认
  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      setIsDelete(false)
      setOperationDetail({})
      onChangeParamsUpdate(filterParams, true)
    } catch (error) {
      //
    }
  }

  // 操作项目
  const onOperationProject = async () => {
    // 关闭
    if (operationDetail?.clickType === 'close') {
      await stopProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.endSuccess'),
        type: 'success',
      })
    } else if (operationDetail.status === 1) {
      await suspendProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.pausedSuccess'),
        type: 'success',
      })
    } else {
      await openProject({ id: operationDetail.id })
      getMessage({
        msg: t('common.openSuccess'),
        type: 'success',
      })
    }

    setOperationDetail({})
    setIsStatusState(false)
    onChangeParamsUpdate(filterParams, true)
  }

  // 操作更多 例-开始等
  const onChangeOperation = (type: string, item: any, e?: any) => {
    if (e) {
      e.stopPropagation()
    }
    setOperationDetail({ ...item, ...{ clickType: type } })
    // item.status 1-开启 2-结束 3-已暂停 4-未开启
    if (type === 'delete') {
      setIsDelete(true)
    } else {
      // 结束、已暂停状态，则开始项目
      setIsStatusState(true)
    }
  }

  // 项目列表点击快捷添加
  const onAddClick = () => {
    dispatch({ type: 'createProject/changeCreateVisible', payload: true })
    setOperationDetail({})
  }

  // 拖拽列表
  const onDragDataList = async (arr: any, idx: number) => {
    setDataList(arr)
    await setProjectSort({
      projectId: arr?.list[idx]?.id,
      sort: idx + 1,
      page: filterParams.pageObj.page,
      pageSize: filterParams.pageObj.size,
    })
  }

  useEffect(() => {
    if (isUpdateProject) {
      getList(filterParams, false)
    }
  }, [isUpdateProject])

  return (
    <ProjectIndexWrap>
      {/* 删除项目 */}
      <DeleteConfirm
        text={t('mark.delP')}
        isVisible={isDelete}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      {/* 关闭或者和是开启、暂停项目 */}
      <DeleteConfirm
        title={t('p2.toast')}
        text={
          operationDetail?.clickType === 'close'
            ? t('mark.endP')
            : operationDetail?.status === 1
            ? t('mark.suspendP')
            : t('mark.startP')
        }
        isVisible={isStatusState}
        onChangeVisible={() => setIsStatusState(!isStatusState)}
        onConfirm={onOperationProject}
      />
      <HeaderFilter
        filterParamsAll={filterParams}
        statistics={dataList?.statistics}
        onChangeParamsUpdate={onChangeParamsUpdate}
      />
      <ProjectWrap>
        <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
          {filterParams?.isGrid ? (
            <MainGrid
              onChangeOperation={onChangeOperation}
              onAddClick={onAddClick}
              hasFilter={
                filterParams?.keyword?.length > 0 ||
                filterParams?.time?.length > 0 ||
                filterParams?.status > 0 ||
                filterParams?.otherType?.length > 0
              }
              projectList={dataList}
            />
          ) : (
            <MainTable
              onChangeOperation={onChangeOperation}
              onChangePageNavigation={onChangePageNavigation}
              onUpdateOrderKey={onUpdateOrderKey}
              order={filterParams?.order}
              onAddClick={onAddClick}
              hasFilter={
                filterParams?.keyword?.length > 0 ||
                filterParams?.time?.length > 0 ||
                filterParams?.status > 0 ||
                filterParams?.otherType?.length > 0
              }
              projectList={dataList}
              onChangeProjectList={onDragDataList}
              filterParams={filterParams}
            />
          )}
        </Spin>
      </ProjectWrap>
      {userPreferenceConfig?.guidePageConfig?.project_list === 1 &&
      filterParams?.isGrid ? (
        <GuideModal
          width={784}
          height={700}
          inform={inform}
          close={async () => {
            await updateCompanyUserPreferenceConfig({
              id: userPreferenceConfig?.id,
              previewModel: userPreferenceConfig.previewModel,
              guidePageConfig: {
                project_list: 2,
              },
            })
            dispatch(getLoginDetail())
          }}
        />
      ) : null}
    </ProjectIndexWrap>
  )
}

export default ProjectIndex
