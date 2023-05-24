import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import KanBanDefault from '../KanBanDefault'
import KanBanSortByPerson from '../KanBanSortByPerson'
import KanBanSortByCategory from '../KanBanSortByCategory'
import KanBanSortByPriority from '../KanBanSortByPriority'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  height: 0;
  overflow: auto;
  /* height: 0; */
`

const Board = () => {
  const { sortByGroupOptions } = useSelector(store => store.sprintKanBan)
  const ele = React.useMemo(() => {
    const type = sortByGroupOptions?.find(item => item.check)?.key
    switch (type) {
      case 'none':
        return <KanBanDefault />
      case 'person':
        return <KanBanSortByPerson />
      case 'category':
        return <KanBanSortByCategory />
      case 'priority':
        return <KanBanSortByPriority />

      default:
        return <></>
    }
  }, sortByGroupOptions)
  return <Container>{ele}</Container>
}

export default Board
