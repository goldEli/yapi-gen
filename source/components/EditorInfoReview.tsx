// 富文本上传后的图片查看
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import Editor from './Editor'

const Wrap = styled.div`
  .w-e-text-container [data-slate-editor] {
    padding: 0 !important;
  }
`

interface Props {
  info: any
}

const EditorInfoReview = (props: Props) => {
  return (
    <Wrap>
      <Editor value={props.info} show />
    </Wrap>
  )
}

export default EditorInfoReview
