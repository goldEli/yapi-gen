import { useState } from 'react'
import styled from '@emotion/styled'
import SearchComponent from './SearchComponent'
import OperationGroup from './OperationGroup'
import TableFilter from './TableFilter'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export default () => {
  const keys = ['columnar', 'table', 'Lattice', 'filter', 'sort', 'set']
  const [filterState, setFilterState] = useState(true)
  return (
    <div>
      <Wrap>
        <SearchComponent text="添加需求" />
        <OperationGroup
          keys={keys}
          onChangeFilter={() => setFilterState(!filterState)}
        />
      </Wrap>
      <TableFilter showForm={filterState} />
    </div>
  )
}
