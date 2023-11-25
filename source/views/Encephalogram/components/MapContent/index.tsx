import { useEffect, useRef } from 'react'
import { MapContentBox, ModalTitleBox } from '@/views/Encephalogram/styles'
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
import {
  setEncephalogramParams,
  setExtraInfo,
  setExtraParams,
  setUpdateModal,
} from '@store/encephalogram'
import { notification } from 'antd'
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'

const MapContent = () => {
  const { projectId } = useProjectId()
  const { encephalogramParams, extraParams, updateModal } = useSelector(
    store => store.encephalogram,
  )
  const dispatch = useDispatch()
  const mapRef = useRef<any>(null)
  const mapBoxRef = useRef<HTMLDivElement>(null)
  const notifyKey = useRef<any>('')
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
        needLoading: true,
      })
    }
  }

  const getMapExtraInfo = async () => {
    const result = await getMapStatisticInfo({
      project_id: projectId,
    })
    if (result && result?.length) {
      dispatch(setExtraInfo(result))
    }
  }
  const refreshData = async () => {
    await delTaskForTable(projectId, encephalogramParams.group_by)
    await getMapExtraInfo()
    await getMapList({
      project_id: projectId,
      group_by: encephalogramParams.group_by,
      needLoading: true,
    })
  }

  useEffect(() => {
    if (extraParams.refresh > 0) {
      refreshData()
    }
  }, [extraParams.refresh])

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
        }),
      )
      dispatch(
        setExtraParams({
          refresh: 0,
          num: 1,
          numType: '',
        }),
      )
    }
  }, [])
  useEffect(() => {
    if (!extraParams.numType || extraParams.numType === 'wheel') {
      return
    }
    mapRef.current.zoomTo(Number(extraParams.num), { x: 100, y: 100 })
  }, [extraParams.num, extraParams.numType])
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

  useEffect(() => {
    if (projectId) {
      getMapExtraInfo()
    }
    return () => {
      dispatch(setExtraInfo([]))
    }
  }, [projectId])

  const openNotification = () => {
    notifyKey.current = `open${Date.now()}`
    const btn = (
      <CommonButton
        type="primary"
        size="small"
        onClick={async () => {
          await refreshData()
          notification.close(notifyKey.current)
        }}
      >
        立即刷新
      </CommonButton>
    )
    notification.open({
      message: (
        <ModalTitleBox>
          <IconFont type="bell" style={{ fontSize: 20 }} color="red" />
          更新提示
        </ModalTitleBox>
      ),
      description: (
        <span style={{ color: 'var(--neutral-n2)' }}>
          导图数据有更新，请点击查看~
        </span>
      ),
      placement: 'bottomLeft',
      duration: null,
      style: {
        backgroundColor: '#F0F3FF',
        width: 340,
        borderLeft: '4px solid var(--primary-d1)',
        marginLeft: 80,
      },
      btn,
      key: notifyKey.current,
      onClose: () => {
        dispatch(
          setUpdateModal({
            visible: false,
            isShow: false,
            projectId: 0,
          }),
        )
      },
    })
  }

  useEffect(() => {
    if (
      !updateModal.isShow &&
      updateModal.visible &&
      projectId === updateModal.projectId
    ) {
      dispatch(
        setUpdateModal({
          ...updateModal,
          isShow: true,
        }),
      )
      openNotification()
    }
    return () => {
      if (!location.href.includes('/ProjectDetail/Encephalogram')) {
        notification.close(notifyKey.current)
      }
    }
  }, [JSON.stringify(updateModal)])

  return <MapContentBox ref={mapBoxRef} id="MapContentMountNode" />
}
export default MapContent
