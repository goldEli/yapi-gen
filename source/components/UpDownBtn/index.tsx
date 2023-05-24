import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import classNames from 'classnames'

interface UpDownBtnProps {
  isOpen: boolean
}

const IconWrap = styled(IconFont)`
  font-size: 14px;
  color: var(--neutral-n3);
  cursor: pointer;
`

const close = css`
  transform: rotate(180deg);
  transition: 0.2;
`

const UpDownBtn: React.FC<UpDownBtnProps> = props => {
  const classname = useMemo(() => {
    return classNames({ [close]: props.isOpen })
  }, [props.isOpen])
  return <IconWrap className={classname} type="down-icon" />
}

export default UpDownBtn
