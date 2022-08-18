/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-shadow
import { useModel } from '@/models'
import { message, Progress, Upload, type UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Task } from 'cos-js-sdk-v5'
import { getParamsData } from '@/tools'

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
  child?: any
  onChangeShow?(state: boolean): void
  id?: any
}

const UploadAttach = (props: Props) => {
  const [t] = useTranslation()
  const { uploadFile, cos } = useModel('cos')
  const {
    addInfoDemand,
    getDemandInfo,
    deleteInfoDemand,
    setPercentShow,
    setPercentVal,
    setUploadStatus,
  } = useModel('demand')
  const [searchParams] = useSearchParams()
  let projectId: any
  let demandId: any
  if (props?.id) {
    projectId = props?.id
  } else {
    const paramsData = getParamsData(searchParams)
    projectId = paramsData.id
    demandId = paramsData.demandId
  }
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
      message.success(t('common.addSuccess'))
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
      message.success(t('common.deleteSuccess'))
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
    if (props?.defaultList.length >= 20) {
      message.warning(t('common.limitToast'))
      return Upload.LIST_IGNORE
    }

    if (file.size / 1024 > 5242880) {
      message.warning(t('project.uploadMax'))
      return Upload.LIST_IGNORE
    }
  }

  const onTasksUpdate = useCallback(({ list }: { list: Task[] }) => {
    const fileSpeed = list[list.length - 1].percent
    const num = fileSpeed === 0 ? fileSpeed : (fileSpeed * 100).toFixed(2)
    setUploadStatus(list[list.length - 1].state)
    if (list[list.length - 1].state === 'success') {
      setPercentVal(100)
      setTimeout(() => {
        setPercentShow(false)
        props?.onChangeShow?.(false)
        setUploadStatus('normal')
      }, 1000)
    } else {
      setPercentShow(true)
      setPercentVal(num)
    }
  }, [])

  useEffect(() => {
    cos.on('list-update', onTasksUpdate)
    return () => {
      cos.off('list-update', onTasksUpdate)
    }
  }, [])

  const onUploadFileClick = async (option: UploadRequestOption) => {
    const { file } = option
    if (file instanceof File) {
      props?.onChangeShow?.(true)
      const result: any = await uploadFile(file, file.name, 'file')
      option.onSuccess?.(result)
      result.url = decodeURIComponent(result.url)
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
    showUploadList: {
      showDownloadIcon: projectInfo?.projectPermissions?.filter(
        (i: any) => i.name === '附件下载',
      ).length,
    },
  }

  return (
    <div className="123">
      <Warp {...uploadProps} fileList={fileList}>
        {props.addWrap}
      </Warp>
      {props.child}
    </div>
  )
}

export default UploadAttach
