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
import { bytesToSize, getParamsData } from '@/tools'
import IconFont from '@/components/IconFont'
import Viewer from 'react-viewer'
import myImg from '/public/er.png'

const Warp = styled(Upload)({
  '.ant-upload-list-item-name': {
    color: '#323233',
  },
})

export const First = styled.div``

export const Second = styled.div`
  visibility: hidden;
  position: absolute;
  right: 12px;
  top: 8px;
  opacity: 0;
  transition: all 1s;
`

export const Third = styled.div`
  position: absolute;
  right: 12px;
  top: 30px;
`

export const BigWrap = styled.div`
  display: flex;
  &:hover {
    ${Second} {
      visibility: visible;
      opacity: 1;
    }
    ${First} {
      /* display: none; */
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
  margin-right: 12px;
  position: relative;
  &:hover {
    ${Gred} {
      opacity: 0.6;
      transition: all 1s;
    }
  }
`

const BlueCss = styled.span`
  font-size: 12px;
  color: #2877ff;
  cursor: pointer;
`

const RedCss = styled(BlueCss)`
  color: #ff5c5e;
  margin-left: 12px;
`
const NumStyle = styled.div`
  font-size: 12px;
  color: #969799;
`
export const Card = styled.div`
  flex: 1;
  position: relative;
  min-width: 372px;
  min-height: 60px;
  background: #ffffff;
  box-shadow: 0px 0px 7px 6px rgba(0, 0, 0, 0.06);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  margin: 0 16px 16px 10px;
  box-sizing: border-box;
  padding: 8px 12px;
  padding-right: 80px;
`

const StyledProgress = styled(Progress)`
  .ant-progress-bg {
    height: 2px !important;
  }
`
export const fileIconMap: Record<string, string> = {
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
  docx: 'colorDOC-76p4mioh',
  pdf: 'colorpdf',
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

const UploadAttach = (props: any) => {
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

    if (props.canUpdate) {
      props.del(id)
    }
  }
  const onTapClose = (id: string) => {
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
    if (props.canUpdate) {
      props.add({ data })
    }
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
    if (props.defaultList?.length >= 1) {
      const arr: any[] = []
      props.defaultList.forEach((i: any, index: any) => {
        const obj = {
          id: i.id ?? index,
          state: 'success',
          loaded: '',
          percent: 1,

          file: {
            id: index,
            name: i.name,
            size: i.size,
            formattedSize: '',
            suffix: i.url.split('.').at(-1),
            url: i.url,
            time: i.time,
            username: i.username ?? userInfo?.name,
          },
        }
        arr.push(obj)
      })

      setFileList(arr)
    } else {
      setFileList([])
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
      if (!props.canUpdate) {
        props.onChangeAttachment(
          fileList.map((i: any) => {
            return {
              url: i.file.url,
              name: i.file.name,
              size: i.file.size,
              ext: i.file.suffix,
              ctime: i.file.time,
            }
          }),
        )
      }
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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {fileList.map((i: any) => (
          <Card key={i.id}>
            <BigWrap>
              <GredParent>
                {imgs.includes(i.file.suffix) && (
                  <img
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '4px',
                    }}
                    alt=""
                    src={i.file.url ? i.file.url : myImg}
                  />
                )}
                {!imgs.includes(i.file.suffix) && (
                  <IconFont
                    style={{
                      fontSize: 40,
                      color: 'white',
                      borderRadius: '8px',
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

              <Second>
                {i.state === 'uploading' && (
                  <>
                    <BlueCss onClick={() => onTapPause(i.id)}>
                      {t('p2.pause')}
                    </BlueCss>
                    <RedCss onClick={() => onTapClose(i.id)}>
                      {t('p2.cancel')}
                    </RedCss>
                  </>
                )}
                {i.state === 'paused' && (
                  <>
                    <BlueCss onClick={() => onTapRestart(i.id)}>
                      {t('p2.begin')}
                    </BlueCss>
                    <RedCss onClick={() => onTapClose(i.id)}>
                      {t('p2.cancel')}
                    </RedCss>
                  </>
                )}

                {i.state === 'error' && (
                  <>
                    <BlueCss onClick={() => onTapRestart(i.id)}>
                      {t('p2.retransmission')}
                    </BlueCss>
                    <RedCss onClick={() => onTapRemove(i.id)}>
                      {' '}
                      {t('p2.cancel')}
                    </RedCss>
                  </>
                )}
                {i.state === 'success' && (
                  <span>
                    {!!isDownload && (
                      <BlueCss
                        onClick={() => onDownload(i.file.url, i.file.name)}
                      >
                        {t('p2.download')}
                      </BlueCss>
                    )}

                    {!!isShowDel && (
                      <RedCss onClick={() => onTapRemove(i.id)}>
                        {t('p2.delete')}
                      </RedCss>
                    )}
                  </span>
                )}
              </Second>
              <Third>
                {i.state === 'uploading' && (
                  <NumStyle>{Number((i.percent * 100).toFixed(2))}%</NumStyle>
                )}
                {i.state === 'paused' && (
                  <NumStyle>{Number((i.percent * 100).toFixed(2))}%</NumStyle>
                )}

                {i.state === 'error' && (
                  <NumStyle>{Number((i.percent * 100).toFixed(2))}%</NumStyle>
                )}
              </Third>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#323233',
                    lineHeight: '22px',
                    wordBreak: 'break-all',
                    // width: '90%',
                  }}
                >
                  {i.file.name}
                </div>
                <First
                  style={{
                    height: '20px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#969799',
                    lineHeight: '20px',
                  }}
                >
                  {i.state === 'uploading' && (
                    <>
                      <span>{bytesToSize(i.loaded)}</span>
                      <span
                        style={{
                          margin: '0 6px 0 6px',
                        }}
                      >
                        /
                      </span>
                      <span>{bytesToSize(i.file?.size)}</span>
                    </>
                  )}
                  {i.state === 'paused' && <span> {t('p2.paused')}</span>}

                  {i.state === 'error' && (
                    <RedCss
                      style={{
                        margin: 0,
                      }}
                    >
                      {t('p2.fail')}
                    </RedCss>
                  )}
                  {i.state === 'success' && (
                    <>
                      {i.file?.size === 0 ? (
                        '--'
                      ) : (
                        <span>{bytesToSize(i.file?.size) ?? ''}</span>
                      )}

                      <span
                        style={{
                          margin: '0 6px 0 6px',
                        }}
                      >
                        ·
                      </span>

                      <span
                        style={{
                          marginRight: '12px',
                        }}
                      >
                        {i.file.username ?? userInfo?.name}
                      </span>
                      <span>{i.file.time}</span>
                    </>
                  )}
                </First>
              </div>
            </BigWrap>
            {i.state !== 'success' && (
              <StyledProgress
                status={progressStatusMap[i.state] || ''}
                percent={i.percent * 100}
                showInfo={false}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UploadAttach
