import React from 'react'
import IconFont from '@/components/IconFont'

/**
 * 红色小铃铛
 */

interface BellRedProps {
  style?: React.CSSProperties
}

const BellRed: React.FC<BellRedProps> = props => {
  return (
    <IconFont style={{ fontSize: '16px', ...props.style }} type="bell-red" />
  )
}

export default BellRed
