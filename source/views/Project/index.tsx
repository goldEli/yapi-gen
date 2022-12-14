/* eslint-disable react/jsx-no-leaked-render */
// 项目主页

/* eslint-disable max-params */
/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import Filter from './components/Filter'
import MainGrid from './components/MainGrid'
import MainTable from './components/MainTable'
import EditProject from './components/EditProject'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import DeleteConfirm from '@/components/DeleteConfirm'
import { message, Spin } from 'antd'
import PermissionWrap from '@/components/PermissionWrap'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/Loading'
import WrapLeftBox from './components/WrapLeft'
import useSetTitle from '@/hooks/useSetTitle'

const Content = styled.div<{ isGrid: boolean }>(
  {
    background: '#F5F7FA',
    height: 'calc(100% - 64px)',
  },
  ({ isGrid }) => ({
    padding: isGrid ? '24px 24px 24px 18px' : '16px 16px 0 16px',
  }),
)

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const WrapRight = styled.div`
  width: calc(100% - 220px);
`

const Project = () => {
  const [t] = useTranslation()
  const asyncSetTtile = useSetTitle()
  asyncSetTtile(t('title.project'))
  const [isGrid, setIsGrid] = useState(true)
  const [isStop, setIsStop] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const [groupId, setGroupId] = useState<any>()
  const {
    getProjectList,
    projectList,
    getProjectCoverList,
    deleteProject,
    stopProject,
    openProject,
    setIsRefreshGroup,
  } = useModel('project')
  const { userInfo } = useModel('user')
  const [isSpinning, setIsSpinning] = useState(false)

  const getList = async (
    active: number,
    isTable: boolean,
    isDisable: boolean,
    val: string,
    sortVal: any,
    pageVal: any,
    groupIdVal?: any,
  ) => {
    setIsSpinning(true)
    const params: any = {
      searchValue: val,
      orderKey: sortVal.key,
      order: sortVal.value,
      status: isDisable ? 1 : 0,
      groupId: groupIdVal,
    }
    if (isTable) {
      params.all = true
    }
    if (!isTable) {
      params.page = pageVal.page
      params.pageSize = pageVal.size
    }
    if (!groupIdVal) {
      params.self = active !== 1
      if (active) {
        params.isPublic = 1
      }
    }
    await getProjectList(params)
    setIsSpinning(false)
  }

  const init = async () => {
    getList(activeType, isGrid, isHidden, searchVal, order, pageObj, groupId)
    await getProjectCoverList()
    setLoadingState(true)
  }
  useEffect(() => {
    init()
  }, [])

  const onChangeType = (type: number) => {
    setActiveType(type)
    setGroupId(null)
    getList(type, isGrid, isHidden, searchVal, order, {
      page: 1,
      size: pageObj.size,
    })
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    getList(
      activeType,
      isGrid,
      hidden,
      searchVal,
      order,
      {
        page: 1,
        size: pageObj.size,
      },
      groupId,
    )
  }

  const onChangeSort = (str: string) => {
    setOrder({ value: 'asc', key: str })
    getList(
      activeType,
      isGrid,
      isHidden,
      searchVal,
      { value: 'asc', key: str },
      { page: 1, size: pageObj.size },
      groupId,
    )
  }

  const onChangeSearch = (value: string) => {
    setSearchVal(value)
    getList(
      activeType,
      isGrid,
      isHidden,
      value,
      order,
      {
        page: 1,
        size: pageObj.size,
      },
      groupId,
    )
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      message.success(t('common.deleteSuccess'))
      setIsDelete(false)
      setOperationDetail({})
      getList(activeType, isGrid, isHidden, searchVal, order, pageObj, groupId)
      setIsRefreshGroup(true)
    } catch (error) {
      //
    }
  }

  const onEndOrOpen = async (item: any) => {
    try {
      if (item.status === 1) {
        await stopProject({ id: item.id })
      } else {
        await openProject({ id: item.id })
      }
      message.success(
        item.status === 1 ? t('common.endSuccess') : t('common.openSuccess'),
      )
      setOperationDetail({})
      setIsStop(false)
      getList(activeType, isGrid, isHidden, searchVal, order, pageObj, groupId)
    } catch (error) {
      //
    }
  }

  const onChangeOperation = (type: string, item: any, e?: any) => {
    if (e) {
      e.stopPropagation()
    }
    setOperationDetail(item)
    if (type === 'delete') {
      setIsDelete(true)
    } else if (type === 'edit') {
      setIsVisible(true)
    } else if (item.status === 1) {
      setIsStop(true)
    } else {
      onEndOrOpen(item)
    }
  }

  const onStopProject = () => {
    onEndOrOpen(operationDetail)
  }

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    getList(
      activeType,
      val,
      isHidden,
      searchVal,
      order,
      {
        page: 1,
        size: pageObj.size,
      },
      groupId,
    )
  }

  const onAddClick = () => {
    setIsVisible(true)
    setOperationDetail({})
  }

  const onChangePageNavigation = (item: any) => {
    setPageObj({
      page: item.page,
      size: item.size,
    })
    getList(
      activeType,
      isGrid,
      isHidden,
      searchVal,
      order,
      {
        page: item.page,
        size: item.size,
      },
      groupId,
    )
  }

  const onUpdateOrderKey = (item: any) => {
    setOrder(item)
    getList(
      activeType,
      isGrid,
      isHidden,
      searchVal,
      item,
      {
        page: 1,
        size: pageObj.size,
      },
      groupId,
    )
  }

  // 切换分组查询列表
  const onChangeGroup = (id: number) => {
    setGroupId(id)
    setActiveType(-1)
    getList(-1, isGrid, isHidden, searchVal, order, pageObj, id)
  }

  if (!loadingState) {
    return <Loading />
  }

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <DeleteConfirm
        title={t('mark.endP')}
        text={t('common.stopProjectToast', { name: operationDetail?.name })}
        isVisible={isStop}
        onChangeVisible={() => setIsStop(!isStop)}
        onConfirm={onStopProject}
      />
      <PermissionWrap
        auth="b/project/get"
        permission={userInfo?.company_permissions}
      >
        <DeleteConfirm
          text={t('mark.delP')}
          isVisible={isDelete}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />

        <EditProject
          activeType={activeType}
          groupId={groupId}
          visible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          details={operationDetail}
          onUpdate={() =>
            getList(
              activeType,
              isGrid,
              isHidden,
              searchVal,
              order,
              pageObj,
              groupId,
            )
          }
        />

        <Wrap>
          <WrapLeftBox
            onAddClick={onAddClick}
            onChangeType={onChangeType}
            activeType={activeType}
            onChangeGroup={onChangeGroup}
            isPermission={getIsPermission(
              userInfo?.company_permissions,
              'b/project/save',
            )}
          />
          <WrapRight>
            <Filter
              sort={order.key}
              isGrid={isGrid}
              activeType={activeType}
              onChangeSort={onChangeSort}
              onChangeFormat={onChangeGrid}
              onChangeHidden={onChangeHidden}
              onChangeSearch={onChangeSearch}
            />
            <Content isGrid={isGrid}>
              <Spin spinning={isSpinning}>
                {isGrid ? (
                  <MainGrid
                    projectList={projectList}
                    onChangeVisible={() => setIsVisible(true)}
                    onChangeOperation={onChangeOperation}
                    onAddClear={() => setOperationDetail({})}
                  />
                ) : (
                  <MainTable
                    onChangeOperation={(e, type, item) =>
                      onChangeOperation(e, type, item)
                    }
                    projectList={projectList}
                    onChangePageNavigation={onChangePageNavigation}
                    onUpdateOrderKey={onUpdateOrderKey}
                    order={order}
                    onAddClick={onAddClick}
                  />
                )}
              </Spin>
            </Content>
          </WrapRight>
        </Wrap>
      </PermissionWrap>
    </div>
  )
}

export default Project
