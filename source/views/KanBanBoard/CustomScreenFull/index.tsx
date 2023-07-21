import React, { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode } from '@store/kanBan/kanBan.thunk'
import screenfull from 'screenfull'

interface FullScreenContainerProps {
  children: React.ReactNode
}

const Box = styled.div``
const CustomScreenFull: React.FC<FullScreenContainerProps> = props => {
  const elementRef = useRef(null)
  const dispatch = useDispatch()
  const { fullScreen } = useSelector(store => store.kanBan)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (screenfull.isEnabled && !screenfull.isFullscreen) {
        dispatch(offFullScreenMode())
      }
    }
    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange)
    }

    if (screenfull.isEnabled) {
      if (elementRef.current && fullScreen) {
        screenfull.request(elementRef.current)
      }
    }
    if (fullScreen) {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      }
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange)
      }
    }
  }, [fullScreen])

  return (
    <Box id="kanBanFullScreenBox" ref={elementRef}>
      {props.children}
    </Box>
  )
}

export default CustomScreenFull
