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
import { message } from 'antd'

const SearchWrap = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 24,
  background: 'white',
})

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
})

const Project = () => {
  const [isGrid, setIsGrid] = useState(true)
  const [activeType, setActiveType] = useState(0)
  const [isHidden, setIsHidden] = useState(false)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 10 })
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

  const getList = (
    active: number,
    isTable: boolean,
    isDisable: boolean,
    val: string,
    sortVal: any,
    pageVal: any,
  ) => {
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
    getProjectList(params)
  }

  useEffect(() => {
    getList(activeType, isGrid, isHidden, searchVal, order, pageObj)
    getProjectCoverList()
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
      message.success('删除成功')
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
      message.success(item.status === 1 ? '结束成功' : '开启成功')
      setOperationDetail({})
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
    } else {
      onEndOrOpen(item)
    }
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

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <DeleteConfirm
        text="确认删除该项目？"
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
            placeholder="搜索项目或任务"
            text="创建项目"
            onChangeSearch={onChangeSearch}
            onChangeVisible={onAddClick}
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
      </Content>
    </div>
  )
}

export default Project
