/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import { message, Upload, type UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { useState } from 'react'

interface Props {
  addWrap: React.ReactElement
  onChangeAttachment?(arr: any): void
}

const UploadAttach = (props: Props) => {
  const { uploadFile } = useModel('cos')
  let arr: any[] = []

  const downloadIamge = (src: string, name: string) => {
    let urls = ''
    urls = `${src}?t=${new Date().getTime()}`
    fetch(urls).then(response => {
      response.blob().then(myBlob => {
        const href = URL.createObjectURL(myBlob)
        const a = document.createElement('a')
        a.href = href
        a.download = name
        a.click()
      })
    })
  }

  const onUploadBefore = (file: any) => {

    // 限制大小
  }

  const onUploadFileClick = async (option: UploadRequestOption) => {
    const { file } = option
    if (file instanceof File) {
      const result: any = await uploadFile(file, file.name, 'file')
      option.onSuccess?.(result)
      const items = [result.url]
      arr = [...arr, ...items]
      props.onChangeAttachment?.(arr)
    }
  }

  const onDownload = (file: any) => {
    downloadIamge(file.response.url, file.response.name)
  }

  const onRemove = (file: any) => {
    const result = arr.filter(i => i !== file.response.url)
    props.onChangeAttachment?.(result)
  }

  const uploadProps: UploadProps = {
    beforeUpload: onUploadBefore,
    customRequest: onUploadFileClick,
    onDownload,
    onRemove,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    showUploadList: {
      showDownloadIcon: true,
    },
  }

  return <Upload {...uploadProps}>{props.addWrap}</Upload>
}

export default UploadAttach
