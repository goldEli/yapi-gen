/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
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
  const [sort, setSort] = useState('name')
  const [activeType, setActiveType] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [operationDetail, setOperationDetail] = useState<any>({})
  const {
    getProjectList,
    projectList,
    getProjectCoverList,
    deleteProject,
    stopProject,
    openProject,
  } = useModel('project')

  const data = {
    pageSize: 10,
    page: 1,
    orderKey: 'name',
    order: 'asc',
    self: true,
    searchValue: '',
    isPublic: 0,
    all: true,
    status: 0,
  }

  const getList = (params: any) => {
    getProjectList(params)
  }

  useEffect(() => {
    getList(data)
    getProjectCoverList()
  }, [])

  const onChangeType = (type: number) => {
    setActiveType(type)
    if (type === 1) {
      data.isPublic = 1
      data.self = false
    } else {
      data.self = true
    }
    getList(data)
  }

  const onChangeHidden = (hidden: boolean) => {
    data.status = hidden ? 1 : 0
    if (activeType === 1) {
      data.isPublic = 1
    } else {
      data.self = true
    }
    getList(data)
  }

  const onChangeSort = (value: string) => {
    setSort(value)
    data.orderKey = value
    if (activeType === 1) {
      data.isPublic = 1
    } else {
      data.self = true
    }
    getList(data)
  }

  const onChangeSearch = (value: string) => {
    data.searchValue = value
    if (activeType === 1) {
      data.isPublic = 1
    } else {
      data.self = true
    }
    getList(data)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      message.success('删除成功')
      setIsDelete(false)
      setOperationDetail({})
      if (activeType === 1) {
        data.isPublic = 1
      } else {
        data.self = true
      }
      getList(data)
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
      if (activeType === 1) {
        data.isPublic = 1
      } else {
        data.self = true
      }
      getList(data)
    } catch (error) {

      //
    }
  }

  const onChangeOperation = (type: string, item: any) => {
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
    data.all = false
    if (activeType === 1) {
      data.isPublic = 1
    } else {
      data.self = true
    }
    getList(data)
  }

  const onAddClick = () => {
    setIsVisible(true)
    setOperationDetail({})
  }

  const onChangePageNavigation = (item: any) => {
    data.page = item.page
    data.pageSize = item.size
    if (activeType === 1) {
      data.isPublic = 1
    } else {
      data.self = true
    }
    getList(data)
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
        onUpdate={() => getList(data)}
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
          sort={sort}
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
            onChangeOperation={onChangeOperation}
            projectList={projectList}
            onChangePageNavigation={onChangePageNavigation}
          />
        )}
      </Content>
    </div>
  )
}

export default Project
