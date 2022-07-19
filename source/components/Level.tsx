import React, { useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'

const flexCss = css`
  width: 120px;
  box-sizing: border-box;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #f0f4fa;
    color: #2877ff;
  }
`
const Contain = styled.div`
  width: 120px;
  height: 136px;
  display: flex;
  flex-direction: column;
`
const StyledShape = styled.div`
  width: 120px;
  height: 32px;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 16px 5px 16px;
`
const level = [
  {
    id: 1,
    name: '高',
    icon: <IconFont type="tall" style={{ color: '#ff5c5e', fontSize: 20 }} />,
  },
  {
    id: 2,
    name: '中',
    icon: <IconFont type="middle" style={{ color: '#fa9746', fontSize: 20 }} />,
  },
  {
    id: 3,
    name: '低',
    icon: <IconFont type="low" style={{ color: '#43ba9a', fontSize: 20 }} />,
  },
  {
    id: 4,
    name: '极低',
    icon: (
      <IconFont type="knockdown" style={{ color: '#bbbdbf', fontSize: 20 }} />
    ),
  },
]

type LevelProps = {
  record?: Record<string, number | string>
  hide: () => void
  tap: (id: any) => void
}
export const LevelContent = (props: LevelProps) => {
  const { record, hide, tap } = props
  const changeState = (value: any) => {
    tap(value.id)

    hide()
  }
  return (
    <Contain>
      {level.map(item => (
        <div
          onClick={() => changeState(item)}
          className={flexCss}
          key={item.id}
        >
          {item.icon}
          <StyledShape>{item.name}</StyledShape>
          {item.id === record?.level}
        </div>
      ))}
    </Contain>
  )
}
