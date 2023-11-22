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
import {  useSelector } from '@store/index'
import { type TreeGraph } from '@antv/g6'
const MapContent = (props: any) => {
  const { projectId } = useProjectId()
  // const { fullScreen } = useSelector(store => store.kanBan)
  const { encephalogramParams } = useSelector(store => store.encephalogram)
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

  const datas = {
    id: '1',
    name: 'SLG框架开发',
    extra: [
      '美术组 12天（12天）',
      '3D设计组 4天（3天）',
      '服务器组 4天（-）',
      '客服端组 4天（-）',
      '客服端组 77天（-）',
      '客服端组 45天（-）',
    ],
    style: {
      color: '#323233',
      fontWeight: 500,
      fontFamily: 'SiYuanMedium',
      fontSize: 18,
      fill: '#FFFFFF',
    },
    children: [
      {
        id: '11',
        name: '主分类-英雄',
        style: {
          color: '#323233',
          fontWeight: 500,
          fontFamily: 'SiYuanMedium',
          fontSize: 16,
          fill: '#FFFFFF',
        },
        children: [
          {
            id: '111',
            name: '子分类-等级',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '111-1',
                name: '父级任务-英雄养成',
                style: {
                  fill: '#FFF383',
                },
                children: [
                  {
                    id: '1111-1',
                    name: '子任务-UE 2.0',
                    style: {
                      fill: '#BBFFBA',
                    },
                    children: [
                      {
                        id: '11111-1',
                        name: '美术组UED1',
                      },
                    ],
                  },
                  {
                    id: '1111-2',
                    name: '子任务-UE 2.1',
                    style: {
                      fill: '#BBFFBA',
                    },
                    children: [
                      {
                        id: '1111-2-1',
                        name: '美术组UED2',
                      },
                    ],
                  },
                  {
                    id: '1111-3',
                    name: '子任务-UE 2.2',
                    style: {
                      fill: '#E4D8FF',
                    },
                    children: [
                      {
                        id: '1111-3-1',
                        name: '美术组UED3',
                      },
                    ],
                  },
                  {
                    id: '1111-4',
                    name: '子任务-UE 2.3',
                    style: {
                      fill: '#FFC8A0',
                    },
                    children: [
                      {
                        id: '1111-4-1',
                        name: '3D设计组',
                      },
                    ],
                  },
                  {
                    id: '1111-5',
                    name: '子任务-UE 2.4',
                    style: {
                      fill: '#E4D8FF',
                    },
                    children: [
                      {
                        id: '1111-5-1',
                        name: '3D设计组',
                      },
                    ],
                  },
                  {
                    id: '1111-6',
                    name: '子任务-UE 2.5',
                    style: {
                      fill: '#FFC8A0',
                    },
                    children: [
                      {
                        id: '1111-6-1',
                        name: '客户端组',
                      },
                    ],
                  },
                ],
              },
              {
                id: '111-2',
                name: '父级任务-英雄等级',
                style: {
                  fill: '#BBFFBA',
                },
              },
              {
                id: '111-3',
                name: '父级任务-英雄主界面',
                style: {
                  fill: '#FFC8A0',
                },
              },
            ],
          },
          {
            id: '112',
            name: '子分类-天赋',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '112-1',
                name: '父级任务-天赋-ui2.0',
                style: {
                  fill: '#FFF383',
                },
              },
              {
                id: '112-2',
                name: '父级任务-天赋-ue2.0',
                style: {
                  fill: '#BBFFBA',
                },
              },
            ],
          },
          {
            id: '113',
            name: '子分类-星际',
            style: {
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '113-1',
                name: '父级任务-天赋-ui2.0',
                style: {
                  fill: '#BBFFBA',
                },
              },
              {
                id: '113-2',
                name: '父级任务-天赋-ue2.0',
                style: {
                  fill: '#E4D8FF',
                },
              },
            ],
          },
        ],
      },
      {
        id: '22',
        name: '副分类-练级',
        style: {
          color: '#323233',
          fontWeight: 500,
          fontFamily: 'SiYuanMedium',
          fontSize: 16,
          fill: '#FFFFFF',
        },
      },
    ],
  }

  useEffect(() => {
    const graph = init()
    mapRef.current = graph
    graph.data({ name: '', style: { fontSize: 18 } })
    graph.render()
  }, [])
  useEffect(() => {
    if(encephalogramParams.numType === 'wheel'){
      return
    }
    mapRef.current.zoomTo(Number(encephalogramParams.num), { x: 100, y: 100 }, true)
  }, [encephalogramParams.num,encephalogramParams.numType])
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

  return <MapContentBox ref={mapBoxRef} id="MapContentMountNode" />
}
export default MapContent
