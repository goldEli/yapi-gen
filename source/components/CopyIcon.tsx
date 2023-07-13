import { Tooltip } from 'antd'
import CommonIconFont from './CommonIconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

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
  const [t] = useTranslation()
  return (
    <Tooltip placement="top" title={t('other.copy')}>
      <SpanWrap onClick={props.onCopy}>
        <CommonIconFont type="copy" color="var(--neutral-n3)" />
      </SpanWrap>
    </Tooltip>
  )
}

export default CopyIcon
