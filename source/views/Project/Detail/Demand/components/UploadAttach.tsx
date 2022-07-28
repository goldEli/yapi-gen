/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import { message, Upload, type UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface Props {
  addWrap: React.ReactElement
  onChangeAttachment?(arr: any): void
  defaultList?: any
  canUpdate?: boolean
}

const UploadAttach = (props: Props) => {
  const { uploadFile } = useModel('cos')
  const { addInfoDemand, getDemandInfo, deleteInfoDemand } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  let arr: any[] = []

  const onAddInfoAttach = async (url: any) => {
    try {
      await addInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        target: url,
      })
      message.success('添加成功')
      getDemandInfo({ projectId, id: demandId })
    } catch (error) {

      //
    }
  }

  const onDeleteInfoAttach = async (url: any) => {

    // try {
    //   await deleteInfoDemand({
    //     projectId,
    //     demandId,
    //     type: 'attachment',
    //     targetId: url,
    //   })
    //   message.success('添加成功')
    //   getDemandInfo({ projectId, id: demandId })
    // } catch (error) {
    //   //
    // }
  }

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
      if (props.canUpdate) {
        onAddInfoAttach([result.url])
      }
    }
  }

  const onDownload = (file: any) => {
    downloadIamge(file.response.url, file.response.name)
  }

  const onRemove = (file: any) => {
    const result = arr.filter(i => i !== file.response.url)
    props.onChangeAttachment?.(result)
    if (props.canUpdate) {
      onDeleteInfoAttach(result)
    }
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
    defaultFileList: props.defaultList,
  }

  return <Upload {...uploadProps}>{props.addWrap}</Upload>
}

export default UploadAttach
