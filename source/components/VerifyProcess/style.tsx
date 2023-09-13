import styled from '@emotion/styled'
import { Timeline } from 'antd'

export const TimelineWrap = styled(Timeline)({
  '.ant-timeline-item-last > .ant-timeline-item-content': {
    minHeight: 'auto',
  },
  '.ant-timeline-item:last-child > .ant-timeline-item-tail': {
    display: 'none',
  },
  '.ant-timeline-item-last': {
    paddingBottom: '0!important',
  },
  '.ant-timeline-item-head-blue': {
    borderColor: 'var(--neutral-n5) !important',
  },
  '& :first-child .ant-timeline-item-head-blue': {
    borderColor: 'var(--primary-d1) !important',
  },
})

export const WrapBox = styled.div<{
  color?: any
  size?: any
  right?: any
  left?: any
  top?: any
}>({}, ({ color, size, right, left, top }) => ({
  color: color || 'var(--neutral-n3)',
  fontSize: size || 12,
  marginRight: right || 0,
  marginLeft: left || 0,
  marginTop: top || 0,
}))
