import styled from '@emotion/styled'
import { NodeViewWrapper } from '@tiptap/react'
import loadingImage from '../../assets/loading.gif'

export const Wrap = styled(NodeViewWrapper)`
  position: relative;
  display: inline-block;
  font-size: 0;
  vertical-align: bottom;
`

export const Video = styled.video`
  background-repeat: no-repeat;
  background-position: center;
  background-size: 30px;
  min-width: 30px;
  height: auto;
  &[data-loading='true'] {
    background-image: url(${loadingImage});
  }
`
