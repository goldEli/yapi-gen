import React from 'react'
import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'

interface HeaderProps {}

const HeaderBox = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: center;
`
const Button = styled.div`
  cursor: pointer;
  width: 48px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n3);
`

const TimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`

const Header: React.FC<HeaderProps> = props => {
  return (
    <HeaderBox>
      <Button>今天</Button>
      <TimeBox>
        <span className="icon">{`<`}</span>
        <span>2023年3月16日 周五</span>
        <span className="icon">{`>`}</span>
      </TimeBox>
    </HeaderBox>
  )
}

export default Header
