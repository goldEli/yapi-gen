/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import { message, notification, Upload, type UploadProps } from 'antd'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Task } from 'cos-js-sdk-v5'
import { getParamsData } from '@/tools'
import IconFont from '@/components/IconFont'
import moment from 'moment'
import CommonModal from '@/components/CommonModal'
import useWatchLine from '@/hooks/useWatchLine'

const Warp = styled(Upload)({
  '.ant-upload-list-item-name': {
    color: '#323233',
  },
})

interface Props {
  power?: boolean
  addWrap: React.ReactElement
  onChangeAttachment?(arr: any, type: string): void
  defaultList?: any
  canUpdate?: boolean
  child?: any
  onChangeShow?(state: boolean): void
  id?: any
  onBottom?(): void
  onChange?(arr: any): void

  // 是否是迭代上传
  isIteration?: boolean

  // 迭代上传是否可以删除
  isCanUpdate?: boolean
}

export const First = styled.div``

export const Second = styled.div`
  display: none;
`

export const BigWrap = styled.div`
  &:hover {
    ${Second} {
      display: block;
    }
    ${First} {
      display: none;
    }
  }
`

export const Gred = styled.div`
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0;
  transition: all 1s;
`

export const GredParent = styled.div`
  &:hover {
    ${Gred} {
      opacity: 0.6;
      transition: all 1s;
    }
  }
`

const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const fils = ['xlsx', 'pdf']
const fils2 = fils.concat(imgs)
const ListItem = (props: any) => {
  const {
    file: { url, name, user, time },
    onDownload,
    onRemove,
    onPreview,
    isCanUpdate,
    isIteration,
  } = props
  const { projectInfo } = useModel('project')
  let isDownload
  let isShowDel

  if (props.power) {
    isDownload = true
    isShowDel = true
  } else {
    const isCanEdit =
      projectInfo.projectPermissions?.length > 0 &&
      projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
        ?.length > 0
    isDownload = projectInfo?.projectPermissions?.filter(
      (i: any) => i.name === '附件下载',
    ).length
    isShowDel = isIteration ? isCanUpdate : isCanEdit
  }

  const Download = () => {
    onDownload(props.file)
  }
  const Remove = () => {
    onRemove(props.file)
  }
  const Preview = () => {
    onPreview(props.file)
  }

  return (
    <BigWrap
      style={{
        display: 'flex',
        marginBottom: '16px',
      }}
    >
      <GredParent
        style={{
          marginRight: '8px',
          position: 'relative',
        }}
      >
        {imgs.includes(name.split('.').at(-1)) && (
          <img
            style={{
              width: '40px',
              height: '42px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            src={url}
            alt=""
          />
        )}
        {name.split('.').at(-1) === 'xlsx' && (
          <IconFont
            style={{
              fontSize: 40,
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            type="colorXLS-76p4mekd"
          />
        )}
        {name.split('.').at(-1) === 'pdf' && (
          <IconFont
            style={{
              fontSize: 40,
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            type="colorPDF"
          />
        )}
        {name.split('.').at(-1) === 'word' && (
          <IconFont
            style={{
              fontSize: 40,
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            type="colorDOC-76p4mioh"
          />
        )}
        {!fils2.includes(name.split('.').at(-1)) && (
          <IconFont
            style={{
              fontSize: 40,
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            type="colorunknown"
          />
        )}
        {imgs.includes(name.split('.').at(-1)) && (
          <Gred onClick={Preview}>
            <IconFont style={{ fontSize: 18, color: 'white' }} type="zoomin" />
          </Gred>
        )}
      </GredParent>
      <div>
        <div
          style={{
            height: '22px',
            fontSize: '14px',
            fontWeight: 400,
            color: '#323233',
            lineHeight: '22px',
          }}
        >
          {name}
        </div>
        {!isDownload && !isShowDel ? (
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              fontWeight: 400,
              color: '#969799',
              lineHeight: '20px',
            }}
          >
            <span
              style={{
                marginRight: '12px',
              }}
            >
              {user}
            </span>
            <span>{time}</span>
          </div>
        ) : (
          <>
            <First
              style={{
                height: '20px',
                fontSize: '12px',
                fontWeight: 400,
                color: '#969799',
                lineHeight: '20px',
              }}
            >
              <span
                style={{
                  marginRight: '12px',
                }}
              >
                {user}
              </span>
              <span>{time}</span>
            </First>
            <Second
              style={{
                height: '20px',
              }}
            >
              {isDownload ? (
                <span
                  onClick={Download}
                  style={{
                    marginRight: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <IconFont
                    style={{ fontSize: 18, color: '#969799' }}
                    type="download"
                  />
                </span>
              ) : null}

              {isShowDel ? (
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={Remove}
                >
                  <IconFont
                    style={{ fontSize: 18, color: '#969799' }}
                    type="delete"
                  />
                </span>
              ) : null}
            </Second>{' '}
          </>
        )}
      </div>
    </BigWrap>
  )
}

const UploadAttach = (props: Props) => {
  const { userInfo } = useModel('user')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
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
        time: element.time,
        user: userInfo?.name,
      }

      array.push(obj)
    })
    setFileList(array)
  }, [props.defaultList])

  useEffect(() => {
    props.onChange?.(fileList)
  }, [fileList])

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
      props?.onBottom?.()
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
      props?.onBottom?.()
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

    return ''
  }

  const onTasksUpdate = useCallback(({ list }: { list: Task[] }) => {
    const line = window.navigator.onLine

    if (!line) {
      location.reload()
    }
    setTimeout(() => {
      if (!line) {
        location.reload()
      }
    }, 2000)
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
        props?.onBottom?.()
      }
    }
  }

  const handlePreview = async (file: any) => {
    setPreviewImage(file.url)

    setPreviewTitle(file.name)
  }

  const onDownload = (file: any) => {
    downloadIamge(file.url, file.name)
  }
  const onPreview = (file: any) => {
    setPreviewOpen(true)
    handlePreview(file)
  }

  const onRemove = (file: any) => {
    if (props.canUpdate) {
      onDeleteInfoAttach(file)
    } else {
      props.onChangeAttachment?.(file, 'delete')
      props?.onBottom?.()
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: onUploadBefore,
    customRequest: onUploadFileClick,
    onDownload,
    onRemove,
    onPreview,
    itemRender: (e: any, file: any) => {
      return (
        <ListItem
          power={props.power}
          file={file}
          onDownload={onDownload}
          onRemove={onRemove}
          onPreview={onPreview}
          isIteration={props.isIteration}
          isCanUpdate={props?.isCanUpdate}
        />
      )
    },
  }

  const handleCancel = () => setPreviewOpen(false)
  return (
    <div>
      <Warp multiple fileList={fileList} {...uploadProps}>
        {props.addWrap}
      </Warp>
      <CommonModal
        width={600}
        isVisible={previewOpen}
        title={previewTitle}
        onClose={handleCancel}
        isShowFooter
      >
        <img
          alt="example"
          style={{ width: '100%', paddingBottom: 16 }}
          src={previewImage}
        />
      </CommonModal>
      {props.child}
    </div>
  )
}

export default UploadAttach
