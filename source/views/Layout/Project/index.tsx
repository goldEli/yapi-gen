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
import ActionTabs from './components/ActionTabs'
import { getProjectCatrgory } from '@store/project/project.thunk'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

const ProjectIndex = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
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
    pageObj: { page: 1, size: 30 },
    order: { value: '', key: '' },
    isGrid: 0,
  })
  const [activeKey, setActiveKey] = useState(1)
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()

  // 获取数据
  const getList = async (params: any, notSpin?: boolean) => {
    const paramsObj: any = {
      searchValue: params?.keyword,
      orderKey: params?.order?.key,
      order: params?.order?.value,
      status: params.status,
    }
    if (params?.isGrid === 1) {
      paramsObj.all = true
    } else {
      setIsSpinning(!notSpin)

      paramsObj.page = params.pageObj.page
      paramsObj.pageSize = params.pageObj.size
      const result = await getProjectList(paramsObj)
      setDataList(result)
      setIsSpinning(false)
    }
  }

  //   筛选条件变化后更新数据 或者是 刷新
  const onChangeParamsUpdate = (params: any, notSpin?: boolean) => {
    if (params?.isGrid !== filterParams?.isGrid) {
      setDataList({
        list: undefined,
      })
    }
    getList(params, notSpin)
    setFilterParams(params)
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
  useEffect(() => {
    dispatch(getProjectCatrgory({}))
  }, [])
  const onChangeTabs = (key: number) => {
    setActiveKey(key)
  }

  // 关注与取消关注 type：1 是关注，0是取消关注
  const onChangeStar = (type: number, row: any) => {
    //
  }

  const tabsHtml = () => {
    return (
      <>
        <HeaderFilter
          filterParamsAll={filterParams}
          statistics={dataList?.statistics}
          onChangeParamsUpdate={onChangeParamsUpdate}
        />
        <ProjectWrap>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            {filterParams?.isGrid === 1 ? (
              <MainGrid
                onChangeOperation={onChangeOperation}
                onAddClick={onAddClick}
                onChangeStar={onChangeStar}
                hasFilter={
                  filterParams?.keyword?.length > 0 || filterParams?.status > 0
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
                  filterParams?.keyword?.length > 0 || filterParams?.status > 0
                }
                projectList={dataList}
                onChangeProjectList={onDragDataList}
                filterParams={filterParams}
                onChangeStar={onChangeStar}
              />
            )}
          </Spin>
        </ProjectWrap>
      </>
    )
  }

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
      <ActionTabs
        activeKey={activeKey}
        onChange={onChangeTabs}
        open={open}
        items={[
          { label: '所有项目', id: 1, children: tabsHtml() },
          { label: '我关注的', id: 2, children: tabsHtml() },
          { label: '游戏项目', id: 3, children: tabsHtml() },
          { label: '所有项目', id: 4, children: tabsHtml() },
          { label: '我关注的', id: 5, children: tabsHtml() },
          { label: '游戏项目', id: 6, children: tabsHtml() },
          { label: '所有项目', id: 7, children: tabsHtml() },
          { label: '我关注的', id: 8, children: tabsHtml() },
          { label: '游戏项目游戏项目游戏项目', id: 9, children: tabsHtml() },
          { label: '所有项目', id: 10, children: tabsHtml() },
          { label: '所有项目', id: 11, children: tabsHtml() },
          {
            label: '所有项目所有项目所有项目所有项目所有项目',
            id: 12,
            children: tabsHtml(),
          },
          {
            label: '所有项目所有项目所有项目所有项目所有项目',
            id: 13,
            children: tabsHtml(),
          },
        ]}
      />
      <DeleteConfirmModal />
    </ProjectIndexWrap>
  )
}

export default ProjectIndex
