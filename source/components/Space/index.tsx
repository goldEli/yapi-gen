import React from 'react'
import styled from '@emotion/styled'

interface DxGapProps {
  directions?: 'horizontal' | 'vertical'
  children: React.ReactNode
  gap?: number
  block?: boolean
  justifyContent?: React.CSSProperties['justifyContent']
  cursor?: boolean
  style?: React.CSSProperties
}

const DxGapBox = styled.div<{ gap?: number; block?: boolean }>`
  display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
  align-items: center;
  justify-content: flex-start;
  gap: ${({ gap }) => gap || 8}px;
`

const DxGapBoxVertical = styled.div<{ gap?: number; block?: boolean }>`
  display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ gap }) => gap || 8}px;
`

const DxSpace: React.FC<DxGapProps> = props => {
  const { justifyContent, directions, children, ...otherProps } = props
  const p: Record<string, any> = {
    ...otherProps,
    style: {
      ...props.style,
      justifyContent,
      cursor: props.cursor ? 'pointer' : void 0,
    },
  }
  if (justifyContent === 'space-between') {
    p.style.width = '100%'
  }
  if (directions === 'vertical') {
    return <DxGapBoxVertical {...p}>{children}</DxGapBoxVertical>
  }
  return <DxGapBox {...p}>{children}</DxGapBox>
}

export default DxSpace
