import { css, Global } from '@emotion/react'

const customCss = css`
  .ant-form-item {
    padding-top: 2px !important;
  }
`
const GlobalStyle = () => {
  return <Global styles={customCss} />
}

export default GlobalStyle
