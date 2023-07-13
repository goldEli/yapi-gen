import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

interface UpDownBtnProps {
  isOpen: boolean
}

const IconWrap = styled(IconFont)`
  font-size: 14px;
  color: var(--neutral-n3);
  cursor: pointer;
`

const UpDownBtn: React.FC<UpDownBtnProps> = props => {
  const type = useMemo(() => {
    return props.isOpen ? 'down-icon' : 'right-icon'
  }, [props.isOpen])
  return <IconWrap type={type} />
}

export default UpDownBtn
