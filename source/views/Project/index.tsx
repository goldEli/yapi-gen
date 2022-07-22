import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import Filter from './components/Filter'
import MainGrid from './components/MainGrid'
import MainTable from './components/MainTable'
import EditProject from './components/EditProject'
import { useState } from 'react'

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
  const [visible, setVisible] = useState(false)
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
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      <div style={{ position: 'sticky', top: 0, zIndex: 9 }}>
        <SearchWrap>
          <SearchComponent
            placeholder="搜索项目或任务"
            text="创建项目"
            onChangeSearch={onChangeSearch}
            onChangeVisible={() => setVisible(true)}
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
                onChangeVisible={() => setVisible(true)}
                onChangeOperation={onChangeOperation}
              />
            )
          : <MainTable onChangeOperation={onChangeOperation} />
        }
      </Content>
    </div>
  )
}

export default Project
