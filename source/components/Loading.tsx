// 加载

import styled from '@emotion/styled'
import { Spin } from 'antd'

const Loading1 = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Loading = () => {
  return (
    <Loading1>
      <Spin size="large" />
    </Loading1>
  )
}

export default Loading
