import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import KanBanStatusBoard from '../KanBanStatusBoard'
import useControlScrollPlane from '../hooks/useControlScrollPlane'
import { useSelector } from '@store/index'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  /* height: 0; */
`

const KanBan = () => {
  const { columnList } = useSelector(store => store.KanbanConfig)
  const containRight = useSelector(store => store.kanBan.containRight)
  const { ControlScrollPlane, containerRef } = useControlScrollPlane(
    columnList.length,
  )
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    containerRef!.current.scrollLeft =
      containerRef!.current.scrollWidth - containerRef!.current.clientWidth
  }, [containRight])

  return (
    <Container ref={containerRef}>
      <KanBanStatusBoard />
      <ControlScrollPlane />
    </Container>
  )
}

export default KanBan
