// 公用上传附件组件

/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */

import { message, Popover, Progress, Upload } from 'antd'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import styled from '@emotion/styled'
import myImg from '/er.png'
import { useTranslation } from 'react-i18next'
import type { Task } from 'cos-js-sdk-v5'
import { bytesToSize } from '@/tools'
import IconFont from '@/components/IconFont'
import Viewer from 'react-viewer'
import { cos, uploadFile } from '@/services/cos'
import { useSelector } from '@store/index'
import { getMessage } from './Message'
import { relative } from 'path'
import TruncateTextWithEllipsis from './TruncateTextWithEllipsis'
import PreviewIframe from './PreviewIframe'

const Warp = styled(Upload)({
  '.ant-upload-list-item-name': {
    color: 'var(--neutral-n1-d1)',
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
  /* background-color: var(--neutral-white-d6); */
`

export const Third = styled.div`
  /* position: absolute;
  right: 12px;
  top: 30px; */
`

export const BigWrap = styled.div`
  /* display: flex; */
  border-radius: 6px 6px 0 0;
`

export const Gred = styled.div`
  cursor: pointer;
  border-radius: 5px 5px 0 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 96px;

  transition: all 0.5s;
  backdrop-filter: blur(0px);
`

export const GredParent = styled.div`
  text-align: center;
  border-radius: 6px 6px 0 0;
  background: #f5f5f7;
  width: 100%;
  height: 96px;
`

export const BlueCss = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  backdrop-filter: blur(3px);
  cursor: pointer;
  margin-left: 12px;

  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
`

export const RedCss = styled(BlueCss)`
  color: var(--function-error);
  margin-left: 12px;
`

const NumStyle = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

export const Card = styled.div`
  position: relative;
  width: 172px;
  /* height: 166px; */
  background: var(--neutral-white-d6);
  border: 1px solid var(--neutral-n6-d2);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;

  box-sizing: border-box;

  transition: all 0.3s;
  &:hover {
    border: 1px solid var(--primary-d1);
    ${Second} {
      visibility: visible;
      opacity: 1;
    }
    ${Gred} {
      backdrop-filter: blur(2px);
      background-color: rgba(0, 0, 0, 0.4);
      /* transition: all 0.1s; */
    }
  }
`

const StyledProgress = styled(Progress)`
  width: 120px;

  .ant-progress-bg {
    height: 4px !important;
  }
`
const Bdiv = styled.div`
  margin-right: 5px;
  display: inline-block;
  line-height: 22px;
  width: 4px;
  height: 4px;
  background: #ffffff;
  border-radius: 50%;
  flex-shrink: 0;
  align-self: center;
`
const Cdiv = styled(Bdiv)`
  align-self: self-start;
  margin-top: 10px;
`
const Wdiv = styled.div`
  word-break: break-all;
  white-space: wrap;
  display: flex;

  font-size: 12px;
  color: #ffffff;
  line-height: 22px;
`
const San = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid rgba(0, 0, 0, 0.6);
  border-bottom: 10px solid transparent;
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translate(0, -50%);
`
export const fileIconMap: Record<string, string> = {
  xlsx: 'colorXLS-76p4mekd',
  xls: 'colorXLS-76p4mekd',
  ppt: 'colorPPT',
  pptx: 'colorPPT',
  avi: 'colorvideo',
  mp4: 'colorvideo',
  mov: 'colorvideo',
  wmv: 'colorvideo',
  flv: 'colorvideo',
  wma: 'colormusic',
  mp3: 'colormusic',
  wav: 'colormusic',
  cad: 'colormusic',
  doc: 'colorDOC-76p4mioh',
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

const UploadAttach = (props: any, ref: any) => {
  const [previewUrl, setPreviewUrl] = useState('')
  const [flag, setFlag] = useState<boolean>(false)

  const uploadRef = useRef<any>(null)
  const scopeRef = useRef(String(Math.random()))
  const { userInfo } = useSelector(store => store.user)
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [t] = useTranslation()
  const [fileList, setFileList] = useState<any>([])
  const { projectInfo } = useSelector(store => store.project)

  // 判断权限
  let isDownload: boolean
  let isShowDel: boolean

  if (props.power) {
    isDownload = true
    isShowDel = props.isReport ? false : true
  } else {
    const isCanEdit =
      projectInfo.projectPermissions?.length > 0 &&
      projectInfo.projectPermissions?.filter(
        (i: any) =>
          i.identity ===
          (projectInfo.projectType === 1
            ? props.isBug
              ? 'b/flaw/update'
              : 'b/story/update'
            : 'b/transaction/update'),
      )?.length > 0
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

  function isFormatType(str: string) {
    return (
      ['exe', 'bat', 'com', 'vbs', 'reg', 'sh'].indexOf(str.toLowerCase()) !==
      -1
    )
  }

  const isFormat = (value: string) => {
    const index = value.lastIndexOf('.')
    const str = value.substring(index + 1)
    return isFormatType(str)
  }

  const onUploadBefore = (file: any) => {
    if (isFormat(file.name)) {
      getMessage({
        msg: `${t('p2.text')}['exe', 'bat', 'com', 'vbs', 'reg', 'sh']`,
        type: 'warning',
        num: 3,
      })
      return Upload.LIST_IGNORE
    }
    if (file.size / 1024 > 5242880) {
      return Upload.LIST_IGNORE
    }

    if (String(file.name).length >= 130) {
      getMessage({ msg: t('p2.maxUploadText'), type: 'warning', num: 3 })
      return Upload.LIST_IGNORE
    }

    return ''
  }

  const onUploadFileClick = async ({ file }: { file: any }) => {
    if (file instanceof File) {
      const fileName = file.name
      let newName = file.name
      const list = fileList as any[]
      let i = 1

      while (
        list.some(
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          fileItem =>
            String(fileItem.file.name).toLowerCase() ===
            String(newName).toLowerCase(),
        )
      ) {
        newName = fileName
          .split('.')
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          .map((nameSlice, index, array) =>
            array.length - 2 === index ? `${nameSlice}(${i++})` : nameSlice,
          )
          .join('.')
      }

      const result: any = await uploadFile(
        file,
        file.name,
        'file',
        newName,
        scopeRef.current,
      )
      setFileList((tasks: any) => [result].concat(...tasks))
    }
  }

  const onDownload = (url: string, name: string) => {
    downloadIamge(url, name)
  }

  const onPreview = (file: any) => {
    if (imgs.includes(file.suffix)) {
      const arrList = fileList?.filter((i: any) => imgs.includes(i.file.suffix))

      setPictureList({
        imageArray: arrList?.map((k: any, index: any) => ({
          src: k.file.url,
          index,
        })),
        index: arrList?.findIndex((i: any) => i.file.url === file.url),
      })
      setPreviewOpen(true)
    } else {
      setFlag(true)
      setPreviewUrl(file.url)
    }
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

  const onTaskOver = (data: any) => {
    if (props.canUpdate && data?.files.scope === scopeRef.current) {
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
  }

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
            suffix: i.suffix,
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

  // 获取当前上传附件的非完成状态
  const onGetAttachState = () => {
    return fileList?.filter((i: any) => i.state !== 'success')?.length
  }

  useImperativeHandle(props.onRef, () => {
    return {
      getAttachState: onGetAttachState,
    }
  })
  const handleUpload = () => {
    // 调用 Upload 组件的上传事件
    uploadRef.current.click()
  }

  useImperativeHandle(ref, () => {
    return {
      handleUpload,
    }
  })

  const content = (name: any, time: any, size: any, pe: any) => (
    <div
      style={{
        width: '189px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '6px 6px 6px 6px',
        padding: '5px 8px',
        position: 'relative',
      }}
    >
      <Wdiv>
        <Cdiv />
        {name}
      </Wdiv>
      <Wdiv>
        <Bdiv />
        {time}
      </Wdiv>
      <Wdiv>
        <Bdiv />
        {size}
      </Wdiv>
      <Wdiv>
        <Bdiv />
        {pe}
        {t('uploading')}
      </Wdiv>
      {/* <San /> */}
    </div>
  )
  return (
    <div style={{ marginTop: '-20px' }}>
      {flag ? (
        <PreviewIframe
          url={previewUrl}
          flag={flag}
          onClose={() => {
            setFlag(false)
            setPreviewUrl('')
          }}
        />
      ) : null}

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
        {props.addWrap ? (
          <div style={{ marginTop: '10px' }}>{props.addWrap}</div>
        ) : (
          <div ref={uploadRef} style={{ display: 'none' }} />
        )}
      </Warp>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 8,
          gap: '8px',
        }}
      >
        {fileList.map((i: any) => {
          return (
            <Popover
              overlayStyle={{ paddingLeft: '0px' }}
              key={i.id}
              placement="right"
              content={content(
                i.file.name,
                i.file.time,
                bytesToSize(i.file?.size) ?? '',
                i.file.username ?? userInfo?.name,
              )}
              trigger="hover"
            >
              <Card>
                <BigWrap>
                  <GredParent>
                    {imgs.includes(i.file.suffix) && (
                      <img
                        style={{
                          width: i.file.url ? '100%' : '60px',
                          height: i.file.url ? '100%' : '60px',
                          marginTop: i.file.url ? '' : '18px',
                          borderRadius: '6px 6px 0 0',
                          objectFit: 'contain',
                        }}
                        alt=""
                        src={i.file.url ? i.file.url : myImg}
                      />
                    )}
                    {!imgs.includes(i.file.suffix) && (
                      <IconFont
                        style={{
                          lineHeight: '108px',

                          fontSize: 48,
                          color: 'white',
                        }}
                        type={fileIconMap[i.file.suffix] || 'colorunknown'}
                      />
                    )}

                    <Gred
                      onClick={() =>
                        i.state === 'success' ? onPreview(i.file) : null
                      }
                    />
                  </GredParent>

                  <Second>
                    {i.state === 'uploading' && (
                      <>
                        <BlueCss onClick={() => onTapPause(i.id)}>
                          {/* {t('p2.pause')} */}
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="pause-03"
                          />
                        </BlueCss>
                        <RedCss onClick={() => onTapClose(i.id)}>
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="close"
                          />
                        </RedCss>
                      </>
                    )}
                    {i.state === 'waiting' && (
                      <>
                        <BlueCss onClick={() => onTapPause(i.id)}>
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="pause-03"
                          />
                        </BlueCss>
                        <RedCss onClick={() => onTapClose(i.id)}>
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="close"
                          />
                        </RedCss>
                      </>
                    )}
                    {i.state === 'paused' && (
                      <>
                        <BlueCss onClick={() => onTapRestart(i.id)}>
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="pause-02"
                          />
                        </BlueCss>
                        <BlueCss onClick={() => onTapClose(i.id)}>
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="close"
                          />
                        </BlueCss>
                      </>
                    )}

                    {i.state === 'error' && (
                      <>
                        <BlueCss onClick={() => onTapRestart(i.id)}>
                          {/* {t('p2.retransmission')} */}
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="redo"
                          />
                        </BlueCss>
                        <RedCss onClick={() => onTapRemove(i.id)}>
                          {/* {' '}
                        {t('p2.cancel')} */}
                          <IconFont
                            style={{
                              fontSize: 18,
                              color: 'white',
                            }}
                            type="close"
                          />
                        </RedCss>
                      </>
                    )}
                    {i.state === 'success' && (
                      <span>
                        {!!isDownload && (
                          <BlueCss
                            onClick={() => onDownload(i.file.url, i.file.name)}
                          >
                            {/* {t('p2.download')} */}
                            <IconFont
                              style={{
                                fontSize: 18,
                                color: 'white',
                              }}
                              type="download"
                            />
                          </BlueCss>
                        )}

                        {!!isShowDel && (
                          <BlueCss onClick={() => onTapRemove(i.id)}>
                            {/* {t('p2.delete')}{' '} */}
                            <IconFont
                              style={{
                                fontSize: 18,
                                color: 'white',
                              }}
                              type="delete"
                            />
                          </BlueCss>
                        )}
                      </span>
                    )}
                  </Second>

                  <div
                    style={{
                      boxSizing: 'border-box',
                      padding: '4px 8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontFamily: 'SiYuanMedium',
                        color: 'var(--neutral-n1-d1)',
                        lineHeight: '22px',
                        wordBreak: 'break-all',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <TruncateTextWithEllipsis
                        text={i.file.name}
                        maxWidth={156}
                      />
                      {/* {i.file.name} */}
                    </div>
                    <First
                      style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'var(--neutral-n3)',
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
                      {i.state === 'waiting' && (
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
                        <span
                          style={{
                            margin: 0,
                            color: ' var(--function-error)',
                          }}
                        >
                          {t('p2.fail')}
                        </span>
                      )}
                      {i.state === 'success' && (
                        <>
                          <span>{i.file.time}</span>
                          {/* {i.file?.size === 0 ? (
                          '--'
                        ) : (
                          <span>{bytesToSize(i.file?.size) ?? ''}</span>
                        )} */}

                          {/* <span style={{ marginRight: '6px' }}>
                          {i.file.username ?? userInfo?.name}上传
                        </span> */}
                        </>
                      )}
                    </First>
                    {i.state !== 'success' && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <StyledProgress
                          status={progressStatusMap[i.state] || ''}
                          percent={i.percent * 100}
                          showInfo={false}
                        />
                        <Third>
                          {i.state === 'uploading' && (
                            <NumStyle>
                              {Number((i.percent * 100).toFixed(2))}%
                            </NumStyle>
                          )}
                          {i.state === 'waiting' && (
                            <NumStyle>
                              {Number((i.percent * 100).toFixed(2))}%
                            </NumStyle>
                          )}
                          {i.state === 'paused' && (
                            <NumStyle>
                              {Number((i.percent * 100).toFixed(2))}%
                            </NumStyle>
                          )}

                          {i.state === 'error' && (
                            <NumStyle>
                              {Number((i.percent * 100).toFixed(2))}%
                            </NumStyle>
                          )}
                        </Third>
                      </div>
                    )}
                  </div>
                </BigWrap>
              </Card>
            </Popover>
          )
        })}
      </div>
    </div>
  )
}

export default forwardRef(UploadAttach)
