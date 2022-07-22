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

export default () => {
  const [isGrid, setIsGrid] = useState(true)
  const [sort, setSort] = useState('name')
  const [isHidden, setIsHidden] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [visible, setVisible] = useState(false)
  const onChangeOperation = (type: string, id: number) => {
    console.log(type)
  }
  const onChangeType = (type: number) => {
    setActiveType(type)
    console.log('调用接口-企业和我参与的')
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    console.log('调用接口-隐藏结束项目')
  }

  const onChangeSort = (value: string) => {
    setSort(value)
    console.log('调用接口-排序')
  }

  const onChangeSearch = (value: string) => {
    console.log(
      value,
      '搜索任务或项目',
    )
  }

  return (
    <div style={{ height: '100%',
      overflow: 'auto' }}>
      <EditProject
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      <div style={{ position: 'sticky',
        top: 0,
        zIndex: 9 }}>
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
