/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import { message, Progress, Upload } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Task } from 'cos-js-sdk-v5'
import { getParamsData } from '@/tools'
import IconFont from '@/components/IconFont'
import moment from 'moment'
import Viewer from 'react-viewer'

const Warp = styled(Upload)({
  '.ant-upload-list-item-name': {
    color: '#323233',
  },
})

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
  height: 40px;
  opacity: 0;
  transition: all 1s;
`

export const GredParent = styled.div`
  position: relative;
  &:hover {
    ${Gred} {
      opacity: 0.6;
      transition: all 1s;
    }
  }
`

const StyledProgress = styled(Progress)({
  // '& .ant-progress-outer .ant-progress-inner .ant-progress-bg': {
  //   height: '4px !important',
  //   background: '#43BA9A',
  // },
})
const fileIconMap: Record<string, string> = {
  xlsx: 'colorXLS-76p4mekd',
  xls: 'colorXLS-76p4mekd',
  ppt: 'colorppt',
  pptx: 'colorppt',
  avi: 'colorvideo',
  mp4: 'colorvideo',
  mov: 'colorvideo',
  wmv: 'colorvideo',
  flv: 'colorvideo',
  wma: 'colormusic',
  mp3: 'colormusic',
  wav: 'colormusic',
  cad: 'colormusic',
  doc: 'colordoc',
  docx: 'colordoc',
  pdf: 'colorPDF',
  zip: 'zip',
  rar: 'zip',
}
const progressStatusMap: { [key: string]: 'success' | 'exception' | 'active' } =
  {
    success: 'success',
    error: 'exception',
    uploading: 'active',
  }
const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const fils = ['xlsx', 'pdf']
const fils2 = fils.concat(imgs)

const UploadAttach = (props: any) => {
  // console.log(props.value, props.defaultList, '默认值')

  const { userInfo } = useModel('user')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [t] = useTranslation()
  const { uploadFile, cos } = useModel('cos')
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
  const { projectInfo } = useModel('project')

  // 判断权限

  let isDownload: boolean
  let isShowDel: boolean

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
    isShowDel = props.isIteration ? props.isCanUpdate : isCanEdit
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

    if (String(file.name).length >= 130) {
      message.warning(t('p2.maxUploadText'))
      return Upload.LIST_IGNORE
    }

    return ''
  }

  const onUploadFileClick = async ({ file }: { file: any }) => {
    const result: any = await uploadFile(file, file.name, 'file')
    setFileList((tasks: any) => [result].concat(...tasks))
  }

  const onDownload = (url: string, name: string) => {
    downloadIamge(url, name)
  }

  const onPreview = (file: any) => {
    const arrList = fileList?.filter((i: any) => imgs.includes(i.file.suffix))

    // return
    setPictureList({
      imageArray: arrList?.map((k: any, index: any) => ({
        src: k.file.url,
        index,
      })),
      index: arrList?.findIndex((i: any) => i.file.url === file.url),
    })
    setPreviewOpen(true)
  }

  const onTapPause = (id: string) => cos.pauseTask(id)

  const onTapRemove = (id: string) => {
    cos.cancelTask(id)
    setFileList(fileList.filter((i: { id: string }) => i.id !== id))
  }

  const onTapRestart = (id: string) => cos.restartTask(id)

  const onTasksUpdate = useCallback(({ list }: { list: Task[] }) => {
    setFileList((currentTasks: any[]) =>
      currentTasks.map(i => {
        const currentTask = list.find(task => task.id === i.id)
        if (!currentTask) {
          return i
        }
        return {
          ...i,
          state: currentTask.state,
          loaded: currentTask.loaded,
          percent: currentTask.percent,
        }
      }),
    )
  }, [])

  const onTaskOver = useCallback((data: { id: string; url: string }) => {
    setFileList((currentTasks: any[]) =>
      currentTasks.map(i => {
        if (i.id !== data.id) {
          return i
        }
        return {
          ...i,
          file: {
            ...i.file,
            url: data.url,
          },
        }
      }),
    )
  }, [])

  const setDefaultList = () => {
    if (props.defaultList.length >= 1) {
      const arr: any[] = []
      props.defaultList.forEach((i: any, index: any) => {
        const obj = {
          id: index,
          state: 'success',
          loaded: 4598,
          percent: 1,
          file: {
            id: '8c419aca-dd38-4047-853e-b6dc89613df0',
            name: 'swiper_show.webp',
            size: 4598,
            formattedSize: '4.49KB',
            suffix: 'webp',
            url: i.url,
          },
        }
        arr.push(obj)
      })

      setFileList(arr)
    } else {
      // setFileList([])
    }
  }
  useEffect(() => {
    setDefaultList()
  }, [props.defaultList])

  useEffect(() => {
    cos.on('list-update', onTasksUpdate)
    cos.on('task-over', onTaskOver)
    return () => {
      cos.off('list-update', onTasksUpdate)
      cos.off('task-over', onTaskOver)
    }
  }, [])
  const checkList = () => {
    const state = fileList.every((i: any) => i.state === 'success')
    if (state) {
      props.onChangeAttachment(fileList.map((i: any) => i.file.url))
    }
  }
  useEffect(() => {
    checkList()
  }, [fileList])
  // console.log(fileList)

  return (
    <div>
      {previewOpen ? (
        <Viewer
          zIndex={99999}
          visible={previewOpen}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
      <Warp
        multiple
        fileList={[]}
        beforeUpload={onUploadBefore}
        customRequest={onUploadFileClick}
      >
        {props.addWrap}
      </Warp>
      <div>
        {fileList.map((i: any) => (
          <div
            style={{
              position: 'relative',
            }}
            key={i.id}
          >
            <BigWrap
              style={{
                display: 'flex',
                marginBottom: '16px',
              }}
            >
              <GredParent>
                {imgs.includes(i.file.suffix) && (
                  <img
                    style={{
                      width: '40px',
                      height: '42px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    alt=""
                    src={i.file.url}
                  />
                )}
                {!imgs.includes(i.file.suffix) && (
                  <IconFont
                    style={{
                      fontSize: 40,
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    type={fileIconMap[i.file.suffix] || 'colorunknown'}
                  />
                )}

                {imgs.includes(i.file.suffix) && (
                  <Gred onClick={() => onPreview(i.file)}>
                    <IconFont
                      style={{ fontSize: 18, color: 'white' }}
                      type="zoomin"
                    />
                  </Gred>
                )}
              </GredParent>
              <div
                style={{
                  position: 'absolute',
                  right: ' 20px',
                  top: ' 50%',
                  transform: 'translate(50%, -50%)',
                }}
              >
                {i.state === 'uploading' && (
                  <>
                    <a onClick={() => onTapPause(i.id)}>暂停</a>
                    <a onClick={() => onTapRemove(i.id)}>删除</a>
                    <div>{Number((i.percent * 100).toFixed(2))}%</div>
                  </>
                )}
                {i.state === 'paused' && (
                  <>
                    <a onClick={() => onTapRestart(i.id)}>开始</a>
                    <a onClick={() => onTapRemove(i.id)}>删除</a>
                    <div>{Number((i.percent * 100).toFixed(2))}%</div>
                  </>
                )}

                {i.state === 'error' && (
                  <>
                    <a onClick={() => onTapRestart(i.id)}>开始</a>
                    <a onClick={() => onTapRemove(i.id)}>删除</a>
                  </>
                )}
                {i.state === 'success' && (
                  <a onClick={() => onTapRemove(i.id)}>删除</a>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#323233',
                    lineHeight: '22px',
                    wordBreak: 'break-all',
                  }}
                >
                  {i.file.name}
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
                      {userInfo?.name}
                    </span>
                    <span>
                      {moment(new Date()).format('yyyy-MM-DD HH:mm:ss')}
                    </span>
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
                        {userInfo?.name}
                      </span>
                      <span>
                        {moment(new Date()).format('yyyy-MM-DD HH:mm:ss')}
                      </span>
                    </First>
                    <Second
                      style={{
                        height: '20px',
                      }}
                    >
                      {isDownload ? (
                        <span
                          onClick={() => onDownload(i.file.url, i.file.name)}
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
                          onClick={() => onTapRemove(i.id)}
                        >
                          <IconFont
                            style={{ fontSize: 18, color: '#969799' }}
                            type="delete"
                          />
                        </span>
                      ) : null}
                    </Second>
                  </>
                )}
              </div>
            </BigWrap>
            {i.state !== 'success' && (
              <StyledProgress
                status={progressStatusMap[i.state] || ''}
                percent={i.percent * 100}
                showInfo={false}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadAttach
