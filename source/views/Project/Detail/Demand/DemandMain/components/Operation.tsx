import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useState } from 'react'

const OperationWrap = styled.div({
  minHeight: 52,
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StickyWrap = styled.div({
  padding: '0 24px',
  background: 'white',
  position: 'sticky',
  top: 64,
  zIndex: 2,
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(): void
}

export default (props: Props) => {
  const [filterState, setFilterState] = useState(true)
  const onChangeSearch = (value: string) => {
    console.log(value, '搜索任务或项目')
  }
  return (
    <StickyWrap>
      <OperationWrap>
        <SearchComponent
          onChangeVisible={props.onChangeVisible}
          onChangeSearch={onChangeSearch}
          placeholder="搜索项目或任务"
          text="创建需求"
        />
        <OperationGroup
          onChangeFilter={() => setFilterState(!filterState)}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
        />
      </OperationWrap>
      <TableFilter showForm={filterState} />
    </StickyWrap>
  )
}
