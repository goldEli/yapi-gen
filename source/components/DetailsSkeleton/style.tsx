import styled from '@emotion/styled'
import { Space } from 'antd'

export const SkeletonGroup = styled(Space)`
  display: flex;
  align-items: center;
`

export const SkeletonGroups = styled.div`
  display: flex;
  flex-direction: column;
  .ant-skeleton-input {
    display: inline-block;
    min-width: inherit;
    border-radius: 4px;
    background: var(--neutral-n7);
  }
`
