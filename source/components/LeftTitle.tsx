import styled from '@emotion/styled'
import React from 'react'
const Tag = styled.div`
  height: 24px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 24px;
`
const LeftTitle = (props: { title: string }) => {
  return <Tag>{props.title}</Tag>
}

export default LeftTitle
