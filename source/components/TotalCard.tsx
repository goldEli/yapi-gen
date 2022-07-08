import React from 'react'
import styled from '@emotion/styled'

interface Props {
  title: string
  number: number
}

const CardWrap = styled.div<{ width?: number }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: 100,
  background: '#f2f2f4',
  justifyContent: 'center',
  borderRadius: 4,
}, ({ width }) =>
  width ? {
    width
  } : { width: 200 })

const TitleWrap = styled.span({
  marginTop: 12
})

const NumberWrap = styled.span({
  fontSize: 16
})

export default (props: Props) => (
  <CardWrap>
    <NumberWrap>{props.number}</NumberWrap>
    <TitleWrap>{props.title}</TitleWrap>
  </CardWrap>
)
