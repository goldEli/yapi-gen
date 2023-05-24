/**
 * 多个头像展示组件
 */
import React from 'react'
import styled from '@emotion/styled'
import CommonUserAvatar from '../CommonUserAvatar'

interface MultipleAvatarProps {
  list: {
    id: number
    name: string
    avatar?: string
  }[]
  // 最多展示多少个头像
  max: number
}

const MultipleAvatarBox = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  position: relative;
`
const MoreIcon = styled.div<{ left: number; show: boolean }>`
  width: 24px;
  height: 24px;
  background: var(--neutral-n7);
  border-radius: 50px 50px 50px 50px;
  opacity: 1;
  color: var(--neutral-n2);
  border: 2px solid var(--neutral-white-d2);
  font-size: 12px;
  box-sizing: border-box;
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: ${props => props.left + 'px'};
`
const AvatarBox = styled.div<{ left: number }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: ${props => props.left + 'px'};
`

const MultipleAvatar: React.FC<MultipleAvatarProps> = props => {
  const data = props.list.slice(0, props.max)
  const len = props.list.length
  const hiddenNum = len - data.length
  return (
    <MultipleAvatarBox>
      {data.map((item, idx) => {
        return (
          <AvatarBox left={idx * 20} key={item.id}>
            <CommonUserAvatar isBorder />
          </AvatarBox>
        )
      })}
      <MoreIcon
        show={hiddenNum > 0}
        left={data.length * 20}
      >{`+${hiddenNum}`}</MoreIcon>
    </MultipleAvatarBox>
  )
}

export default MultipleAvatar
