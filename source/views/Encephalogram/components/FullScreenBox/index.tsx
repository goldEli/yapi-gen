import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode } from '@store/kanBan/kanBan.thunk'

interface FullScreenContainerProps {
  children: React.ReactNode
}

const Box = styled(FullScreen)<{ fullScreen: boolean }>`
  height: ${(prop: any) => (prop.fullScreen ? '100vh' : 'calc(100vh - 56px)')};
`

const FullScreenBox: React.FC<FullScreenContainerProps> = props => {
  const handle = useFullScreenHandle()
  const dispatch = useDispatch()
  const { fullScreen } = useSelector(store => store.kanBan)
  useEffect(() => {
    if (fullScreen) {
      handle.enter()
    } else {
      handle.exit()
    }
  }, [fullScreen])
  return (
    <Box
      fullScreen={fullScreen}
      handle={handle}
      className="ganttFullScreenBox"
      onChange={(state: any) => {
        if (!state) {
          dispatch(offFullScreenMode())
        }
      }}
    >
      {props.children}
    </Box>
  )
}

export default FullScreenBox
