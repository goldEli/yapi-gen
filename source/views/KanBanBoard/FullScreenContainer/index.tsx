import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { useDispatch, useSelector } from '@store/index'
import { offFullScreenMode } from '@store/kanBan/kanBan.thunk'

interface FullScreenContainerProps {
  children: React.ReactNode
  isScreen?: boolean
}

const Box = styled(FullScreen)<{ isScreen?: boolean }>`
  flex: 1;
  overflow: hidden;
  /* margin-top: 32px; */
  border-radius: 6px;
  background: ${props => (props.isScreen ? 'var(--neutral-white-d1)' : '')};
  padding: ${props => (props.isScreen ? '16px' : '0')};
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
      isScreen={props.isScreen}
      handle={handle}
      className="kanBanFullScreenBox"
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
