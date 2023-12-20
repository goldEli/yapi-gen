import styled from '@emotion/styled'
import IconFont from '../IconFont'

export const Icon = styled(IconFont)`
  font-size: 28px;
  color: #ffffff;
`
export const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px 6px 6px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
  &:active {
    background: rgba(255, 255, 255, 0.36);
  }
`
