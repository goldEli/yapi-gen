/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
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

const SearchWrap = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 24,
  background: 'white',
})

const Content = styled.div({
  padding: '16px 16px 0 16px',
  background: '#F5F7FA',
  height: 'calc(100% - 116px)',
})

const Project = () => {
  const [t] = useTranslation()
  const [isGrid, setIsGrid] = useState(true)
  const [isStop, setIsStop] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [searchVal, setSearchVal] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const {
    getProjectList,
    projectList,
    getProjectCoverList,
    deleteProject,
    stopProject,
    openProject,
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
  ) => {
    setIsSpinning(true)
    const params: any = {
      searchValue: val,
      orderKey: sortVal.key,
      order: sortVal.value,
      status: isDisable ? 1 : 0,
      self: active !== 1,
    }
    if (isTable) {
      params.all = true
    }
    if (!isTable) {
      params.page = pageVal.page
      params.pageSize = pageVal.size
    }
    if (active) {
      params.isPublic = 1
    }
    await getProjectList(params)
    setIsSpinning(false)
  }

  const init = async () => {
    getList(activeType, isGrid, isHidden, searchVal, order, pageObj)
    await getProjectCoverList()
    setLoadingState(true)
  }
  useEffect(() => {
    init()
  }, [])
  const onChangeType = (type: number) => {
    setActiveType(type)
    getList(type, isGrid, isHidden, searchVal, order, pageObj)
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    getList(activeType, isGrid, hidden, searchVal, order, pageObj)
  }

  const onChangeSort = (str: string) => {
    setOrder({ value: 'asc', key: str })
    getList(
      activeType,
      isGrid,
      isHidden,
      searchVal,
      { value: 'asc', key: str },
      pageObj,
    )
  }

  const onChangeSearch = (value: string) => {
    setSearchVal(value)
    getList(activeType, isGrid, isHidden, value, order, pageObj)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      message.success(t('common.deleteSuccess'))
      setIsDelete(false)
      setOperationDetail({})
      getList(activeType, isGrid, isHidden, searchVal, order, pageObj)
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
      getList(activeType, isGrid, isHidden, searchVal, order, pageObj)
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
    getList(activeType, val, isHidden, searchVal, order, pageObj)
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
    getList(activeType, isGrid, isHidden, searchVal, order, {
      page: item.page,
      size: item.size,
    })
  }

  const onUpdateOrderKey = (item: any) => {
    setOrder(item)
    getList(activeType, isGrid, isHidden, searchVal, item, pageObj)
  }
  if (!loadingState) {
    return <Loading />
  }
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <DeleteConfirm
        title={t('mark.endP')}
        text={`结束项目[${operationDetail?.name}]后，该项目将不能创建新的需求迭代，原有数据将保留。`}
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
          visible={isVisible}
          onChangeVisible={() => setIsVisible(!isVisible)}
          details={operationDetail}
          onUpdate={() => getList(activeType, isGrid, isHidden, searchVal, order, pageObj)
          }
        />
        <div style={{ position: 'sticky', top: 0, zIndex: 9 }}>
          <SearchWrap>
            <SearchComponent
              placeholder={t('mark.searchP')}
              text={t('common.createProject')}
              onChangeSearch={onChangeSearch}
              onChangeVisible={onAddClick}
              isPermission={getIsPermission(
                userInfo?.company_permissions,
                'b/project/save',
              )}
            />
          </SearchWrap>
          <Filter
            show
            total={projectList.list?.length}
            sort={order.key}
            isGrid={isGrid}
            activeType={activeType}
            onChangeSort={onChangeSort}
            onChangeFormat={onChangeGrid}
            onChangeHidden={onChangeHidden}
            onChangeType={onChangeType}
          />
        </div>
        <Content>
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
                onChangeOperation={(e, type, item) => onChangeOperation(e, type, item)
                }
                projectList={projectList}
                onChangePageNavigation={onChangePageNavigation}
                onUpdateOrderKey={onUpdateOrderKey}
                order={order}
              />
            )}
          </Spin>
        </Content>
      </PermissionWrap>
    </div>
  )
}

export default Project
