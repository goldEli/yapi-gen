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
  zIndex: 9,
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(e?: any): void
  onSearch(val: string): void
  settingState: boolean
  onChangeSetting(val: boolean): void
}

const Operation = (props: Props) => {
  const [filterState, setFilterState] = useState(true)

  const onChangeSearch = (val: string) => {
    props.onSearch(val)
  }

  return (
    <StickyWrap>
      <OperationWrap>
        <SearchComponent
          onChangeVisible={(e: any) => props.onChangeVisible?.(e)}
          onChangeSearch={onChangeSearch}
          placeholder="搜索名称或ID"
          text="创建需求"
        />
        <OperationGroup
          onChangeFilter={() => setFilterState(!filterState)}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
          settingState={props.settingState}
          onChangeSetting={() => props.onChangeSetting(!props.settingState)}
        />
      </OperationWrap>
      <TableFilter showForm={filterState} list={[]} />
    </StickyWrap>
  )
}

export default Operation
