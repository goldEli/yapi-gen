import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useSelector, useDispatch } from '@store/index'
import KanBanSortByPerson from '../KanBanSortByPerson'
import useControlScrollPlane from '@/views/ProjectSetting/components/KanBanSetting/hooks/useControlScrollPlane'
import { Spin } from 'antd'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { getKanbanByGroup, getKanbanConfig } from '@store/kanBan/kanBan.thunk'
import { getProjectIdByUrl } from '@/tools'
import useKanBanData from '../hooks/useKanBanData'
import NoData from '@/components/NoData'

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
  const { data } = useKanBanData()
  const { kanbanConfig, fullScreen } = useSelector(store => store.kanBan)
  const { spinning } = useSelector(state => state.kanBan)
  const { sortByRowAndStatusOptions } = useSelector(state => state.kanBan)
  // debugger
  const { ControlScrollPlane, containerRef } = useControlScrollPlane(
    kanbanConfig?.columns?.length ?? 0,
  )
  const { isUpdateAddWorkItem } = useSelector(state => state.project)
  const dispatch = useDispatch()
  const currentColumn = sortByRowAndStatusOptions?.find(item => item.check)
  useEffect(() => {
    if (!currentColumn) {
      return
    }
    const params = {
      id: parseInt(currentColumn?.key, 10) ?? 0,
      project_id: getProjectIdByUrl(),
    }
    dispatch(getKanbanByGroup())
    dispatch(getKanbanConfig(params))
  }, [isUpdateAddWorkItem])
  console.log(data, 'data')

  return (
    <Spin indicator={<NewLoadingTransition />} spinning={spinning}>
      {/* <CustomScreenFull> */}
      <Container
        padding={fullScreen ? 24 : 0}
        id="kanbanContainer"
        ref={containerRef}
      >
        {data[0]?.columns.length < 1 && <NoData />}
        <KanBanSortByPerson />
        <ControlScrollPlane />
      </Container>
      {/* </CustomScreenFull> */}
    </Spin>
  )
}

export default Board
