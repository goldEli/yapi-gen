import { useDispatch, useSelector } from '@store/index'
import { useRef, useState } from 'react'
import {
  DetailInfoWrap,
  DetailMain,
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import DemandBasic from './DemandBasic'
import DemandDetail from './DemandDetail'

const DemandInfo = (props: { employeeCurrentId?: boolean }) => {
  const dispatch = useDispatch()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const LeftDom = useRef<HTMLDivElement>(null)
  const basicInfoDom = useRef<HTMLDivElement>(null)
  const { demandInfo } = useSelector(store => store.demand)
  const [focus, setFocus] = useState(false)
  const [leftWidth, setLeftWidth] = useState(400)

  // 拖动线条
  const onDragLine = () => {
    document.onmousemove = e => {
      setFocus(true)

      setLeftWidth(window.innerWidth - e.clientX)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  const aa = userPreferenceConfig.previewModel === 3 || props?.employeeCurrentId
  const startHeight = aa ? 80 : 100
  const a1 = aa ? (props?.employeeCurrentId ? 142 : 180) : 249

  return (
    <DetailMain
      style={{
        height: `calc(${startHeight}vh - ${a1}px)`,
        marginTop: props?.employeeCurrentId ? 0 : 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: `calc(100% - ${leftWidth}px)`,
        }}
      >
        <DetailInfoWrap ref={LeftDom}>
          <DemandDetail />
          {demandInfo?.isExamine && (
            <div className="review">
              <CommonIconFont type="review" size={64} />
            </div>
          )}
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
        <DemandBasic onRef={basicInfoDom} />
      </div>
    </DetailMain>
  )
}

export default DemandInfo
