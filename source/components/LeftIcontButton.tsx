import styled from '@emotion/styled'
import React from 'react'
import IconFont from './IconFont'

const Wrap = styled.div<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px 6px 6px 6px;
  background: #f6f7f9;
  padding: 5px 8px;
  cursor: pointer;
  &:hover {
    color: var(--primary-d1);
    svg {
      color: var(--primary-d1);
    }
  }
  ${props =>
    props.danger
      ? `
    &:hover {
    color:red;
    svg {
      color:red;
    }
  }
    `
      : ''}
`
interface LeftIcontButtonProps {
  [key: string]: any
  icon: string
  text: string
  danger?: boolean
}
const LeftIcontButton = (props: LeftIcontButtonProps) => {
  return (
    <Wrap {...props}>
      <IconFont
        style={{
          fontSize: 16,
        }}
        type={props.icon}
      />
      <span>{props.text}</span>
    </Wrap>
  )
}

export default LeftIcontButton
