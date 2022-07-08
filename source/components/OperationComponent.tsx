import React from 'react'
import styled from '@emotion/styled'
import SearchComponent from './SearchComponent'
import OperationGroup from './OperationGroup'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export default () => {
  const keys = ['columnar', 'table', 'Lattice', 'filter', 'sort', 'set']
  return (
    <Wrap>
      <SearchComponent text="添加需求" />
      <OperationGroup keys={keys} />
    </Wrap>
  )
}
