import React, { useState } from 'react'

import styled from '@emotion/styled'

const Left = styled.div`
  width: 200px;
  height: 500px;
  box-sizing: border-box;
  padding-top: 50px;
  background-color: #f2f2f2;
`
const Right = styled.div`
  width: 300px;
  height: 500px;
`
const Contain = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
`
const StyledShape = styled.div`
  text-align: center;
  box-sizing: border-box;
  padding: 10px 20px;
  margin: auto;
  width: 100px;
  height: 40px;
  border: 1px solid black;
  border-radius: 20px;
  margin-bottom: 20px;
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
            // style={{
            //   color: item.id === record.level ? "blue" : "",
            //   border: item.id === record.level ? " 1px solid blue" : "",
            // }}
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
