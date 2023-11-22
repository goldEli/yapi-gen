import { useEffect, useRef } from 'react'
import { MapContentBox } from '@/views/Encephalogram/styles'
import {
  delTaskForTable,
  haveHistoryData,
} from '@/views/Encephalogram/until/DbHelper'
import useProjectId from '@/views/Encephalogram/hook/useProjectId'
import useMapData from '../../hook/useMapData'
import init from '@/views/Encephalogram/until/MapFun'
import { getMapList } from '@/services/map'
import { useSelector } from '@store/index'

const MapContent = () => {
  const { projectId } = useProjectId()
  const { fullScreen } = useSelector(store => store.kanBan)
  const { encephalogramParams } = useSelector(store => store.encephalogram)
  const mapRef = useRef<any>(null)
  const { data } = useMapData()

  const addTask = async () => {
    const hasId: any = await haveHistoryData(
      projectId,
      encephalogramParams.group_by,
    )
    if (!hasId) {
      await getMapList({
        project_id: projectId,
        group_by: encephalogramParams.group_by,
      })
    }
  }

  const refreshData = async () => {
    await delTaskForTable(projectId, encephalogramParams.group_by)
    await getMapList({
      project_id: projectId,
      group_by: encephalogramParams.group_by,
    })
  }

  useEffect(() => {
    if (encephalogramParams.refresh > 0) {
      refreshData()
    }
  }, [encephalogramParams.refresh])

  useEffect(() => {
    if (projectId) {
      addTask()
    }
  }, [projectId, encephalogramParams.group_by])

  useEffect(() => {
    const graph = init()
    mapRef.current = graph
    graph.data({ name: '', style: { fontSize: 18 } })
    graph.render()
  }, [])

  useEffect(() => {
    mapRef.current.zoomTo(
      Number(encephalogramParams.num),
      { x: 100, y: 100 },
      true,
    )
  }, [encephalogramParams.num])
  useEffect(() => {
    if (data && mapRef.current) {
      mapRef.current.changeData(data)
      mapRef.current.fitCenter()
    }
  }, [JSON.stringify(data)])

  return <MapContentBox id="MapContentMountNode" />
}
export default MapContent
