import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import KanBanDefault from '../KanBanDefault'
import KanBanSortByPerson from '../KanBanSortByPerson'
import KanBanSortByCategory from '../KanBanSortByCategory'
import KanBanSortByPriority from '../KanBanSortByPriority'
import useControlScrollPlane from '@/views/ProjectSetting/components/KanBanSetting/hooks/useControlScrollPlane'

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
  const { kanbanConfig } = useSelector(store => store.kanBan)

  const { ControlScrollPlane, containerRef } = useControlScrollPlane(
    kanbanConfig?.columns?.length ?? 0,
  )

  return (
    <Container ref={containerRef}>
      <KanBanSortByPerson />
      <ControlScrollPlane />
    </Container>
  )
}

export default Board
