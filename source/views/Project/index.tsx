/* eslint-disable react-hooks/exhaustive-deps */
import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import Filter from './components/Filter'
import MainGrid from './components/MainGrid'
import MainTable from './components/MainTable'
import EditProject from './components/EditProject'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'

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
  const [isHidden, setIsHidden] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const { getProjectList, projectList } = useModel('project')

  useEffect(() => {
    getProjectList()
  }, [])

  const onChangeOperation = () => {

    //
  }
  const onChangeType = (type: number) => {
    setActiveType(type)

    //
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)

    //
  }

  const onChangeSort = (value: string) => {
    setSort(value)

    //
  }

  const onChangeSearch = () => {

    //
  }

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <span>{isHidden}</span>
      <EditProject
        visible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
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
          total={31}
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
        {isGrid
          ? (
              <MainGrid
                projectList={projectList}
                onChangeVisible={() => setIsVisible(true)}
                onChangeOperation={onChangeOperation}
              />
            )
          : (
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
