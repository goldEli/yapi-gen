import { css } from '@emotion/css'
import React from 'react'

const titleCss = css`
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`
const FormTitleSmall = (props: any) => {
  return <div className={titleCss}>{props.text}</div>
}

export default FormTitleSmall
