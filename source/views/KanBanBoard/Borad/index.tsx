import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import KanBanDefault from '../KanBanDefault'
import KanBanSortByPerson from '../KanBanSortByPerson'
import KanBanSortByCategory from '../KanBanSortByCategory'
import KanBanSortByPriority from '../KanBanSortByPriority'
import useControlScrollPlane from '@/views/ProjectSetting/components/KanBanSetting/hooks/useControlScrollPlane'

const Container = styled.div<{ padding: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  /* flex: 1; */
  height: 100%;
  /* height: 0; */
  overflow: auto;
  background-color: var(--neutral-white-d2);
  /* height: 0; */
  padding: ${props => props.padding}px;
`

const Board = () => {
  const { kanbanConfig, fullScreen } = useSelector(store => store.kanBan)

  const { ControlScrollPlane, containerRef } = useControlScrollPlane(
    kanbanConfig?.columns?.length ?? 0,
  )

  return (
    <Container
      padding={fullScreen ? 24 : 0}
      id="kanbanContainer"
      ref={containerRef}
    >
      <KanBanSortByPerson />
      <ControlScrollPlane />
    </Container>
  )
}

export default Board
