import { useEffect, useRef } from 'react'
import { MapContentBox } from '@/views/Encephalogram/styles'
import {
  delTaskForTable,
  haveHistoryData,
} from '@/views/Encephalogram/until/DbHelper'
import useProjectId from '@/views/Encephalogram/hook/useProjectId'
import useMapData from '../../hook/useMapData'
import init from '@/views/Encephalogram/until/MapFun'
import { getMapList, getMapStatisticInfo } from '@/services/map'
import { useDispatch, useSelector } from '@store/index'
import { type TreeGraph } from '@antv/g6'
import { setEncephalogramParams, setExtraInfo } from '@store/encephalogram'

const MapContent = () => {
  const { projectId } = useProjectId()
  const { encephalogramParams } = useSelector(store => store.encephalogram)
  const dispatch = useDispatch()
  const mapRef = useRef<any>(null)
  const mapBoxRef = useRef<HTMLDivElement>(null)
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
    return () => {
      dispatch(
        setEncephalogramParams({
          iterationVal: [],
          state: [],
          time: [],
          person: [],
          group_by: 'user',
          refresh: 0,
          num: 1,
          numType: '',
        }),
      )
    }
  }, [])
  useEffect(() => {
    if (
      !encephalogramParams.numType ||
      encephalogramParams.numType === 'wheel'
    ) {
      return
    }
    mapRef.current.zoomTo(
      Number(encephalogramParams.num),
      { x: 100, y: 100 },
      true,
    )
  }, [encephalogramParams.num, encephalogramParams.numType])
  useEffect(() => {
    if (data && mapRef.current) {
      mapRef.current.changeData(data)
      mapRef.current.fitCenter()
    }
  }, [JSON.stringify(data)])

  const observer = useRef(
    new ResizeObserver(e => {
      const map = mapRef.current as TreeGraph
      map.changeSize(
        mapBoxRef.current!.clientWidth,
        mapBoxRef.current!.clientHeight,
      )
    }),
  )

  useEffect(() => {
    if (!mapBoxRef.current) {
      return
    }
    observer.current.observe(mapBoxRef.current)
    return () => {
      observer.current.disconnect()
    }
  }, [])

  const getMapExtraInfo = async () => {
    const result = await getMapStatisticInfo({
      project_id: projectId,
    })
    if (result && result?.length) {
      dispatch(setExtraInfo(result))
    }
  }

  useEffect(() => {
    if (projectId) {
      getMapExtraInfo()
    }
    return () => {
      dispatch(setExtraInfo([]))
    }
  }, [projectId])

  return <MapContentBox ref={mapBoxRef} id="MapContentMountNode" />
}
export default MapContent
