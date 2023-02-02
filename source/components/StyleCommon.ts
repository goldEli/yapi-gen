/* eslint-disable @typescript-eslint/naming-convention */
// 两次以上的公共样式

import styled from '@emotion/styled'

// 弹窗右上角关闭图标
const CloseWrap = styled.div<{ width?: any; height?: any }>`
  width: ${props => props.width};
  height: ${props => props.height};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  svg {
    color: #646566;
  }
  &:hover {
    background: #f4f5f5;
    svg {
      color: #323233;
    }
  }
  &:active {
    background: #ecedef;
    svg {
      color: #323233;
    }
  }
`

export { CloseWrap }
