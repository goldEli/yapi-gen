import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode } from '@store/kanBan/kanBan.thunk'

interface FullScreenContainerProps {
  children: React.ReactNode
}

const Box = styled(FullScreen)`
  flex: 1;
  overflow: hidden;
`

const FullScreenContainer: React.FC<FullScreenContainerProps> = props => {
  const handle = useFullScreenHandle()
  const dispatch = useDispatch()
  const { fullScreen } = useSelector(store => store.kanBan)
  useEffect(() => {
    if (fullScreen) {
      handle.enter()
    }
  }, [fullScreen])
  return (
    <Box
      handle={handle}
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

export default FullScreenContainer
