/**
 * 选成员
 */
import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'

interface ChooseMemberProps {}

const ChooseMemberBox = styled.div`
  width: 24px;
  height: 24px;
  border: 1px dashed var(--neutral-n3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover svg {
    color: var(--primary-d2);
  }
  &:hover {
    border: 1px dashed var(--primary-d2);
  }
`

const ChooseMember: React.FC<ChooseMemberProps> = props => {
  return (
    <ChooseMemberBox>
      <IconFont
        className="icon"
        type="plus"
        style={{
          color: 'var(--neutral-n3)',
          fontSize: '16px',
        }}
        // onClick={() => setIsOpen(true)}
      />
    </ChooseMemberBox>
  )
}

export default ChooseMember
