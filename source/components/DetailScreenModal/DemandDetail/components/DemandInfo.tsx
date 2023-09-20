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

const DemandInfo = () => {
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

  return (
    <DetailMain
      all={userPreferenceConfig.previewModel === 3}
      h={userPreferenceConfig.previewModel === 3}
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
