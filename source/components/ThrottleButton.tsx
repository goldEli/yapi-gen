// 按钮节流

import { useThrottle } from '@/hooks/useThrottle'
import styled from '@emotion/styled'
import { AsyncButton } from './AsyncButton'

const AddButtonWrap = styled.div({
  height: 32,
  boxSizing: 'border-box',
  borderRadius: 6,
  border: '1px solid #2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2877FF',
  padding: '0 16px',
  cursor: 'pointer',
})

const ThrottleButton = (props: any) => {
  const tap = useThrottle(() => {
    props.thClick()
  }, 1000)

  return (
    <>
      {props?.other && (
        <AddButtonWrap onClick={tap}>{props.children}</AddButtonWrap>
      )}
      {!props?.other && (
        <AsyncButton type="primary" onClick={tap}>
          {props.children}
        </AsyncButton>
      )}
    </>
  )
}

export default ThrottleButton
