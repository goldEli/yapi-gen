import React, { useState } from 'react'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'

const flexCss = css`
  height: 32px;
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
  padding: 10px 0;
  width: 120px;
  /* height: 136px; */
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

export const level = [
  {
    id: 1,
    name: '极高',
    icon: (
      <IconFont
        type="extremely-high"
        style={{ color: '#ff5c5e', fontSize: 20 }}
      />
    ),
  },
  {
    id: 2,
    name: '高',
    icon: <IconFont type="high" style={{ color: '#fa9746', fontSize: 20 }} />,
  },
  {
    id: 3,
    name: '中',
    icon: <IconFont type="middle" style={{ color: '#2877ff', fontSize: 20 }} />,
  },
  {
    id: 4,
    name: '低',
    icon: <IconFont type="low" style={{ color: '#43ba9a', fontSize: 20 }} />,
  },
  {
    id: 5,
    name: '极低',
    icon: (
      <IconFont
        type="extremely-low"
        style={{ color: '#bbbdbf', fontSize: 20 }}
      />
    ),
  },
]

type LevelProps = {
  record?: Record<string, number | string>
  onHide(): void
  onTap(id: any): void
}

export const LevelContent = (props: LevelProps) => {
  const { record, onHide, onTap } = props
  const changeState = (value: any) => {
    onTap(value.id)

    onHide()
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
