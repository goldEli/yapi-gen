import React, { useState } from 'react'

import styled from '@emotion/styled'

const Left = styled.div`
  width: 120px;
  height: 316px;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;

  align-items: center;
  border-right: 1px solid #ebedf0;
`
const Right = styled.div`
box-sizing: border-box;
padding-left: 24px;
  width: 354px;
  height: 316px;
`
const Contain = styled.div`
  width: 475px;
  height: 316px;
  display: flex;
`
const StyledShape = styled.div`
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 32px;
  line-height: 32px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const level = [
  { id: 1, name: '高' },
  { id: 2, name: '中' },
  { id: 3, name: '低' },
  { id: 4, name: '极低' },
]
const shape = [
  { id: 1, name: '规划中' },
  { id: 2, name: '实现中' },
  { id: 3, name: '已实现' },
  { id: 4, name: '已关闭' },
]
type ShapeProps = {
  record: Record<string, number | string>
  hide: () => void
}
export const ShapeContent = (props: ShapeProps) => {
  const { record, hide } = props

  const [text, setText] = useState('')
  return (
    <Contain>
      <Left>
        {shape.map(item => (
          <div key={item.id}>
            <StyledShape
            style={{
              color: item.id === record.level ? "blue" : "",
              border: item.id === record.level ? " 1px solid blue" : "",
            }}
            >
              {item.name}
            </StyledShape>
            {item.id === record.level}
          </div>
        ))}
      </Left>
      <Right>
        <div>
          <span>处理人</span>{' '}
          <input
            value={text}
            onChange={e => {
              setText(e.target.value)
            }}
          />
        </div>
        <div>
          <span>评论</span> <textarea></textarea>
        </div>
        <button
          onClick={() => {
            console.log(text)
            hide()
          }}
        >
          流转
        </button>
      </Right>
    </Contain>
  )
}
