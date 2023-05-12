/* eslint-disable react/display-name */
import React, { useState, useEffect, useReducer } from 'react'
import styled from '@emotion/styled'

const ButtonWrap = styled.div`
  display: inline-block;
  width: 340px;
  height: 52px;
  background: #617ef2;
  border-radius: 4px 4px 4px 4px;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  line-height: 52px;
  text-align: center;
  cursor: pointer;
`

export default React.memo((props: any) => {
  return <ButtonWrap {...props}>{props.children}</ButtonWrap>
})
