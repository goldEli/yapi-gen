import { Tooltip } from 'antd'
import CommonIconFont from './CommonIconFont'
import styled from '@emotion/styled'

const SpanWrap = styled.span`
  margin-right: 16px;
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
  }
`

interface CopyIconProps {
  onCopy(): void
}

const CopyIcon = (props: CopyIconProps) => {
  return (
    <Tooltip placement="top" title="复制">
      <SpanWrap onClick={props.onCopy}>
        <CommonIconFont type="copy" color="var(--neutral-n3)" />
      </SpanWrap>
    </Tooltip>
  )
}

export default CopyIcon
