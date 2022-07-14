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
  width: 200px;
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

type LevelProps = {
  record?: Record<string, number | string>
  hide?: () => void
}
export const LevelContent = (props: LevelProps) => {
  const { record, hide } = props
  const [text, setText] = useState('')
  return (
    <Contain>
      <Left>
        {level.map(item => (
          <div key={item.id}>
            <StyledShape
              style={{
                color: item.id === record?.level ? 'blue' : '',
                border: item.id === record?.level ? ' 1px solid blue' : '',
              }}
            >
              {item.name}
            </StyledShape>
            {item.id === record?.level}
          </div>
        ))}
      </Left>
    </Contain>
  )
}
