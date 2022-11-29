import { uploadFileByTask } from '@/services/cos'
import { onPaste } from '@/tools'
import styled from '@emotion/styled'
import { message } from 'antd'
import React from 'react'

const Wrap = styled.div`
  margin-top: 200px;
  width: 100%;
  min-height: 120px;
  opacity: 1;
  border: 1px solid #ecedef;
  img {
    width: 200px;
  }
  &:focus {
    outline: none;
  }
`

const EditComment = () => {
  const handlePaste = async (event: any) => {
    const result: any = await onPaste(event)
    const img = await uploadFileByTask(result.data, result.data.name, 'file')
    // console.log(img)
  }

  const onSend = () => {
    const inner = document.getElementById('inner')
    // console.log(inner?.innerHTML)
  }
  return (
    <div>
      <Wrap id="inner" onPaste={handlePaste} contentEditable />

      <div>
        <button onClick={onSend}>发出</button>
      </div>
    </div>
  )
}

export default EditComment
