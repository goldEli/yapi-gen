/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import { message, Upload, type UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'

const Warp = styled(Upload)({
  '.ant-upload-list-item-name': {
    color: '#323233',
  },
})

interface Props {
  addWrap: React.ReactElement
  onChangeAttachment?(arr: any, type: string): void
  defaultList?: any
  canUpdate?: boolean
}

const UploadAttach = (props: Props) => {
  const { uploadFile } = useModel('cos')
  const { addInfoDemand, getDemandInfo, deleteInfoDemand } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { projectInfo } = useModel('project')
  const [fileList, setFileList] = useState<any>([])
  let arr: any[] = []

  useEffect(() => {
    const array: any[] = []
    props.defaultList?.forEach((element: any) => {
      const obj = {
        name: String(element.path).split('/file/')[1],
        url: element.path,
        uid: element.id,
        status: 'done',
      }
      array.push(obj)
    })
    setFileList(array)
  }, [props.defaultList])

  const onAddInfoAttach = async (url: any) => {
    try {
      await addInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: url,
      })
      message.success('添加成功')
      getDemandInfo({ projectId, id: demandId })
    } catch (error) {

      //
    }
  }

  const onDeleteInfoAttach = async (file: any) => {
    try {
      await deleteInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: file.uid,
      })
      message.success('删除成功')
      getDemandInfo({ projectId, id: demandId })
    } catch (error) {

      //
    }
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
    if (file.size / 1024 > 5242880) {
      message.warning('文件最大支持5G')
      return Upload.LIST_IGNORE
    }
  }

  const onUploadFileClick = async (option: UploadRequestOption) => {
    const { file } = option
    if (file instanceof File) {
      const result: any = await uploadFile(file, file.name, 'file')
      option.onSuccess?.(result)
      const items = [result.url]
      arr = [...arr, ...items]
      if (props.canUpdate) {
        onAddInfoAttach([result.url])
      } else {
        props.onChangeAttachment?.(result, 'add')
      }
    }
  }

  const onDownload = (file: any) => {
    downloadIamge(file.url, file.name)
  }

  const onRemove = (file: any) => {
    if (props.canUpdate) {
      onDeleteInfoAttach(file)
    } else {
      props.onChangeAttachment?.(file, 'delete')
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
      showDownloadIcon: projectInfo?.projectPermissions?.filter(
        (i: any) => i.name === '附件下载',
      ).length,
    },
  }

  return (
    <Warp {...uploadProps} fileList={fileList}>
      {props.addWrap}
    </Warp>
  )
}

export default UploadAttach
