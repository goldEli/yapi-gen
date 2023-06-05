import { useRef, useState } from 'react'
import {
  DetailInfoWrap,
  DetailMain,
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '../style'
import { useDispatch, useSelector } from '@store/index'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { getDemandInfo } from '@store/demand/demand.thunk'
import DetailDemand from './DetailDemand'
import DemandDetailBasic from './DemandDetailBasic'

const DemandDetailInfo = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, demandId } = paramsData
  const LeftDom = useRef<HTMLDivElement>(null)
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState(false)
  const minWidth = 400
  const [leftWidth, setLeftWidth] = useState(400)

  // 更新
  const onUpdate = () => {
    dispatch(getDemandInfo({ projectId: id, id: demandId }))
  }

  // 拖动线条
  const onDragLine = () => {
    //
  }

  return (
    <DetailMain>
      <div
        style={{
          position: 'relative',
          width: `calc(100% - ${leftWidth}px)`,
        }}
      >
        <DetailInfoWrap ref={LeftDom}>
          <DetailDemand />
        </DetailInfoWrap>
      </div>
      <div
        ref={basicInfoDom}
        style={{ position: 'relative', width: leftWidth }}
      >
        <SprintDetailMouseDom
          active={focus}
          onMouseDown={onDragLine}
          style={{ left: 0 }}
        >
          <SprintDetailDragLine active={focus} className="line" />
        </SprintDetailMouseDom>
        <DemandDetailBasic onRef={basicInfoDom} />
      </div>
    </DetailMain>
  )
}

export default DemandDetailInfo
