import { uploadFile, uploadFileByTask } from '@/services/cos'
import { onPaste } from '@/tools'
import styled from '@emotion/styled'
import { Button, message, Upload } from 'antd'
import React, { useState } from 'react'
import IconFont from './IconFont'

const Wrap = styled.div`
  margin-top: 200px;
  width: 100%;
  min-height: 120px;
  opacity: 1;
  border: 1px solid #ecedef;
  img {
    height: 200px;
    object-fit: contain;
  }
  &:focus {
    outline: none;
  }
`

const EditComment = () => {
  const handlePaste = async (event: any) => {
    //阻止默认图片的复制
    event.preventDefault()
    const result: any = await onPaste(event)
    const imgs = await uploadFileByTask(result.data, result.data.name, 'file')
    if (result.type === 'string') {
      // 粘贴文本
      document.execCommand('insertText', false, result.data)
    } else {
      // 替换图片src
      const sel = window.getSelection()
      if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
        const range2 = sel.getRangeAt(0)
        const img = new Image()
        img.src = imgs.url

        range2.insertNode(img)
        range2.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range2)
      }
    }
  }

  const onSend = () => {
    const inner = document.getElementById('inner')
  }
  const onUpload = async ({ file }: { file: any }) => {
    const result: any = await uploadFileByTask(file, file.name, 'file')

    const img = new Image()
    img.src = result.url
    const inner = document.getElementById('inner')
    inner?.appendChild(img)
  }
  return (
    <div>
      <Wrap id="inner" onPaste={handlePaste} contentEditable />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <Upload fileList={[]} customRequest={onUpload}>
            <IconFont type="image" />
          </Upload>

          <IconFont type="attachment" />
          <IconFont type="mention" />
        </div>

        <Button type="primary" onClick={onSend}>
          发出
        </Button>
      </div>
    </div>
  )
}

export default EditComment
