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
    isPublic: '',
    all: '',
    status: 1,
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
    data.self = type !== 1
    getList(data)
  }

  const onChangeHidden = (hidden: boolean) => {
    data.status = hidden ? 2 : 1
    getList(data)
  }

  const onChangeSort = (value: string) => {
    setSort(value)
    data.orderKey = value
    getList(data)
  }

  const onChangeSearch = (value: string) => {
    data.searchValue = value
    getList(data)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteProject({ id: operationDetail.id })
      message.success('删除成功')
      setIsDelete(false)
      setOperationDetail({})
    } catch (error) {

      //
    }
  }

  const onEndOrOpen = async (item: any) => {
    try {
      if (operationDetail.status === 1) {
        await stopProject({ id: item.id })
      } else {
        await openProject({ id: item.id })
      }
      message.success(operationDetail.status === 1 ? '结束成功' : '开启成功')
      setOperationDetail({})
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
      />
      <div style={{ position: 'sticky', top: 0, zIndex: 9 }}>
        <SearchWrap>
          <SearchComponent
            placeholder="搜索项目或任务"
            text="创建项目"
            onChangeSearch={onChangeSearch}
            onChangeVisible={() => setIsVisible(true)}
          />
        </SearchWrap>
        <Filter
          show
          total={projectList.list?.length}
          sort={sort}
          isGrid={isGrid}
          activeType={activeType}
          onChangeSort={onChangeSort}
          onChangeFormat={() => setIsGrid(!isGrid)}
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
          />
        ) : (
          <MainTable
            onChangeOperation={onChangeOperation}
            projectList={projectList}
          />
        )}
      </Content>
    </div>
  )
}

export default Project
