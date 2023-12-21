/* eslint-disable @typescript-eslint/naming-convention */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Space } from 'antd'

export const Wrap = styled.div`
  
  
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  align-items: center;
  
  background: #fff;
  flex-wrap: nowrap;
  height: 40px;
  border-radius: 4px 4px 4px 4px;
  box-shadow: 0px 2px 6px 0px rgba(31, 45, 102, 0.16);
`

export const TextSpan = styled.span`
  white-space: nowrap;
  cursor: pointer;

  font-size: 12px;
  color: #646566;
`

export const TextSpanRed = styled.span`
  font-size: 12px;
  color: #ff5c5e;
`

export const TextSpanA = css`
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  font-size: 14px;
  color: #617ef2;
  text-decoration: underline;
  margin: 0px 14px 0px 8px;
  text-underline-offset: 5px;
  white-space: nowrap;
`

export const TextSpanWrap = css`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
`
