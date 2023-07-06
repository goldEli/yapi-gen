/**
 * 选成员
 */
import React from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'

interface ChooseMemberProps {
  id: number
}

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
const CustomCloseWrap = styled(CloseWrap)`
  width: 24px;
  height: 24px;
  svg {
    color: var(--neutral-n3);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

const ChooseMember: React.FC<ChooseMemberProps> = props => {
  return props?.id === 0 ? (
    <CustomCloseWrap>
      <IconFont
        className="icon"
        type="plus"
        style={{
          color: 'var(--neutral-n3)',
          fontSize: '18px',
        }}
        // onClick={() => setIsOpen(true)}
      />
    </CustomCloseWrap>
  ) : (
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
