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

interface Props {
  text: string
}

export default (props: Props) => {
  const keys = ['columnar', 'table', 'Lattice', 'filter', 'sort', 'set']
  const [filterState, setFilterState] = useState(true)
  return (
    <div style={{ background: 'white', padding: '0 24px' }}>
      <Wrap>
        <SearchComponent text={props.text} placeholder="222" />
        <OperationGroup
          keys={keys}
          onChangeFilter={() => setFilterState(!filterState)}
        />
      </Wrap>
      <TableFilter showForm={filterState} />
    </div>
  )
}
