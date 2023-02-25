/* eslint-disable multiline-ternary */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
import IconFont from '@/components/IconFont'
import { CloseWrap, NameWrap } from '@/components/StyleCommon'
import { addComment, getReportDetail } from '@/services/daily'
import { bytesToSize } from '@/tools'
import {
  BigWrap,
  BlueCss,
  Card,
  fileIconMap,
  First,
  Gred,
  GredParent,
  Second,
} from '@/components/UploadAttach'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Input, message, Spin } from 'antd'
import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Viewer from 'react-viewer'
import { InnerLine } from './RelatedNeed'

export const GrepWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
`

const Kong = () => (
  <span
    style={{
      color: '#646566',
    }}
  >
    {' '}
    - {t('newlyAdd.null') as string} -{' '}
  </span>
)

const FormWrap = styled.div<{ left: any }>`
  width: 784px;
  height: 90vh;
  background: #ffffff;
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotateY(${({ left }) => left}deg);

  box-sizing: border-box;
  padding-left: 24px;
  padding-right: 4px;
  padding-top: 0px;
`
const HiddenWrap = styled.div`
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: 100px 100px;
  perspective-origin: center;
  width: 784px;
  height: 90vh;
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Arrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 20%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #969799;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #bbbdbf;
  }
`
const Arrow2 = styled(Arrow)`
  left: 80%;
`
const hover = css`
  &:hover {
    color: #2877ff !important;
  }
`
const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '24px',
        marginBottom: '12px',
      }}
    >
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}
export const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
const fils = ['xlsx', 'pdf']
const fils2 = fils.concat(imgs)
const LookDay = (props: any) => {
  const texts: any = [
    '',
    { name: t('p2.title.t1d'), name2: t('p2.title.t1t') },
    { name: t('p2.title.t2d'), name2: t('p2.title.t2t') },
    { name: t('p2.title.t3d'), name2: t('p2.title.t3t') },
  ]

  const myArea = useRef<any>(null)
  const [left, setLeft] = useState(0)
  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
  const [article1, setArticle1] = useState<any>([])
  const [article2, setArticle2] = useState<any>([])
  const [contentList, setContentList] = useState<any>([])
  const [title, setTitle] = useState<any>('')
  const [value, setValue] = useState('')
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })
  const [isSpinning, setIsSpinning] = useState(true)
  const [inputStatus, setInputStatus] = useState<any>('')
  const [name, setName] = useState('')
  const messagesEndRef = useRef<any>(null)
  const onChangeLeft = (values: any, type: any) => {
    props.onChange(type, props.editId)
  }

  const setDefaultValue = async (status?: number) => {
    if (status !== 1) {
      setIsSpinning(false)
    }

    const res = await getReportDetail(props.editId)

    setTitle(res.data.info.name)
    setName(res.data.info.user_name)
    setArticle1(res.data.info.finish_content)
    setArticle2(res.data.info.plan_content)
    const arr = res.data.copysend_list.map((item: any) => ({
      avatar: item.avatar,
      id: item.user_id,
      name: item.name,
      status: item.status,
    }))
    setPeopleValue(arr)
    setNeedValue(
      res.data.story_list.map((item: any) => {
        return {
          key: item.associate,
          value: Number(item.associate),
          label: item.name,
        }
      }),
    )
    setAttachList(
      res.data.files.map((item: any) => {
        return {
          path: item.associate,
          id: item.id,
          size: item.configurations.size,
          time: item.created_at,
          name: item.configurations.name,
          suffix: item.configurations.ext,
        }
      }),
    )
    setContentList(res.data.comment_list)

    if (res.code === 0) {
      setTimeout(() => {
        setIsSpinning(true)
      }, 200)
    }
  }
  useEffect(() => {
    if (props.editId && props.visible) {
      setInputStatus('')
      setValue('')
      setDefaultValue()
    }
  }, [props.editId, props.visible])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }, 200)
  }
  const sendComment = async () => {
    if (!value.trim()) {
      setInputStatus('error')
      myArea.current.focus()
      setValue('')
      return
    }
    setInputStatus('')
    const res = await addComment({
      id: props.editId,
      content: value,
    })
    if (res.code === 0) {
      message.success(t('p2.conSuccess') as string)
      setDefaultValue(1)
      setValue('')
      scrollToBottom()
    }
  }

  if (!props.visible) {
    return null
  }

  const downloadIamge = (src: string, name1: string) => {
    let urls = ''
    urls = `${src}?t=${new Date().getTime()}`
    fetch(urls).then(response => {
      response.blob().then(myBlob => {
        const href = URL.createObjectURL(myBlob)
        const a = document.createElement('a')
        a.href = href
        a.download = name1
        a.click()
      })
    })
  }
  const onDownload = (url: string, name1: string) => {
    downloadIamge(url, name1)
  }

  const onReview = (item: any) => {
    setPictureList({
      imageArray: attachList?.map((k: any, index: any) => ({
        src: k.path,
        index,
      })),
      index: attachList?.findIndex((i: any) => i.path === item.path),
    })
    setPreviewOpen(true)
  }
  return ReactDOM.createPortal(
    <GrepWrap>
      {previewOpen && (
        <Viewer
          zIndex={99999}
          visible={previewOpen}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      <HiddenWrap>
        {isSpinning && (
          <FormWrap left={left}>
            <div
              style={{
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#323233',
                }}
              >
                {title}
              </span>
              <CloseWrap
                style={{
                  cursor: 'pointer',
                  marginRight: '14px',
                }}
                onClick={() => props.onEditClose()}
                width={32}
                height={32}
              >
                <IconFont style={{ fontSize: 20 }} type="close" />
              </CloseWrap>
            </div>
            <div
              ref={messagesEndRef}
              style={{
                height: 'calc(100% - 100px)',
                overflow: 'scroll',
                paddingRight: '24px',
              }}
            >
              <LabelTitle title={texts[props.type]?.name} />
              {article1 ? (
                <div dangerouslySetInnerHTML={{ __html: article1 }} />
              ) : (
                <Kong />
              )}

              <LabelTitle title={texts[props.type]?.name2} />
              {article2 ? (
                <div dangerouslySetInnerHTML={{ __html: article2 }} />
              ) : null}
              {!article2 && <Kong />}

              <LabelTitle title={t('common.copySend')} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {peopleValue.length < 1 ? (
                  <Kong />
                ) : (
                  peopleValue?.map((i: any) => (
                    <div
                      key={i.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '24px',
                        }}
                      >
                        <div>
                          {i.avatar ? (
                            <img
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 16,
                              }}
                              src={i.avatar}
                            />
                          ) : (
                            <NameWrap
                              style={{ margin: 0, width: 24, height: 24 }}
                            >
                              {String(
                                i.name.substring(0, 1).trim().slice(0, 1),
                              ).toLocaleUpperCase()}
                            </NameWrap>
                          )}
                        </div>
                        <span
                          style={{
                            marginLeft: '4px',
                            color: '#646566',
                          }}
                        >
                          {i.name}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <LabelTitle title={t('common.attachment')} />
              <div>
                {attachList.length < 1 ? (
                  <Kong />
                ) : (
                  attachList.map((item: any) => (
                    <Card key={item.id}>
                      <BigWrap
                        style={{
                          display: 'flex',
                        }}
                      >
                        <GredParent
                          style={{
                            marginRight: '8px',
                            position: 'relative',
                          }}
                        >
                          {imgs.includes(item.suffix) && (
                            <img
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '4px',
                              }}
                              src={item.path}
                              alt=""
                            />
                          )}
                          {!imgs.includes(item.suffix) && (
                            <IconFont
                              style={{
                                fontSize: 40,
                                color: 'white',
                                borderRadius: '8px',
                              }}
                              type={fileIconMap[item.suffix] || 'colorunknown'}
                            />
                          )}

                          {imgs.includes(item.suffix) && (
                            <Gred
                              onClick={() => {
                                onReview(item)
                              }}
                            >
                              <IconFont
                                style={{ fontSize: 18, color: 'white' }}
                                type="zoomin"
                              />
                            </Gred>
                          )}
                        </GredParent>
                        <div>
                          <div
                            style={{
                              width: '100%',
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#646566',
                              lineHeight: '22px',
                              wordBreak: 'break-all',
                            }}
                          >
                            {item.name}
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
                            <span>{bytesToSize(item?.size) ?? ''}</span>
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
                              {name}
                            </span>
                            <span>{item.time}</span>
                          </First>
                          <Second
                            style={{
                              height: '20px',
                            }}
                          >
                            <BlueCss
                              onClick={() =>
                                onDownload(
                                  item.path,
                                  item.path.split('/').at(-1),
                                )
                              }
                              style={{
                                marginRight: '12px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                color: '#2877ff',
                              }}
                            >
                              {t('p2.download') as unknown as string}
                            </BlueCss>
                          </Second>
                        </div>
                      </BigWrap>
                    </Card>
                  ))
                )}
              </div>
              <LabelTitle title={t('p2.RelatedRequirements')} />
              <div>
                {needValue.length < 1 ? (
                  <Kong />
                ) : (
                  needValue.map((item: any) => (
                    <InnerLine key={item.key}>
                      <span>
                        【{item.value}】{item.label}
                      </span>
                    </InnerLine>
                  ))
                )}
              </div>
              <LabelTitle title={t('p2.haveRead')} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {peopleValue.filter((k: any) => k.status === 1).length < 1 ? (
                  <Kong />
                ) : (
                  peopleValue
                    .filter((k: any) => k.status === 1)
                    ?.map((i: any) => (
                      <div
                        key={i.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '24px',
                          }}
                        >
                          <div>
                            {i.avatar ? (
                              <img
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 16,
                                }}
                                src={i.avatar}
                              />
                            ) : (
                              <NameWrap
                                style={{ margin: 0, width: 24, height: 24 }}
                              >
                                {String(
                                  i.name.substring(0, 1).trim().slice(0, 1),
                                ).toLocaleUpperCase()}
                              </NameWrap>
                            )}
                          </div>
                          <span
                            style={{
                              marginLeft: '4px',
                              color: '#646566',
                            }}
                          >
                            {i.name}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
              <LabelTitle title={t('common.comment')} />
              <div>
                <div
                  style={{
                    marginTop: '0px',
                    position: 'relative',
                  }}
                >
                  <Input.TextArea
                    status={inputStatus}
                    style={{
                      paddingBottom: '40px',
                      marginLeft: '3px',
                    }}
                    maxLength={400}
                    ref={myArea}
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    placeholder={t('p2.pComment', { inner: name })}
                    value={value}
                    onChange={e => {
                      setInputStatus('')
                      setValue(e.target.value)
                    }}
                  />
                  <button
                    onClick={sendComment}
                    style={{
                      height: '24px',
                      background: '#2877FF',
                      fontSize: '12px',
                      fontWeight: '400',
                      color: '#FFFFFF',
                      marginTop: '14px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                    }}
                  >
                    {t('common.comment') as unknown as string}
                  </button>
                </div>
              </div>
              {contentList.length < 1
                ? ''
                : contentList.map((item: any) => (
                    <div key={item.id}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '24px',
                          marginTop: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        {item.avatar ? (
                          <img
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 16,
                            }}
                            src={item.avatar}
                          />
                        ) : (
                          <NameWrap
                            style={{ margin: 0, width: 24, height: 24 }}
                          >
                            {String(
                              item.name.substring(0, 1).trim().slice(0, 1),
                            ).toLocaleUpperCase()}
                          </NameWrap>
                        )}
                        <span
                          style={{
                            margin: '0 10px',
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            color: '#969799',
                            fontSize: '12px',
                          }}
                        >
                          {item.created_at}
                        </span>
                      </div>
                      <div
                        style={{
                          paddingLeft: '34px',
                          width: '100%',
                          wordBreak: 'break-all',
                          color: '#646566',
                          marginTop: '-8px',
                        }}
                      >
                        {item.content}
                      </div>
                    </div>
                  ))}
            </div>
          </FormWrap>
        )}
        {!isSpinning && (
          <Spin tip={t('common.loading') as unknown as string} size="large" />
        )}
      </HiddenWrap>

      <Arrow onClick={() => onChangeLeft(0, 1)}>
        <IconFont type="left" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow>
      <Arrow2 onClick={() => onChangeLeft(360, 2)}>
        <IconFont type="right" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow2>
    </GrepWrap>,
    document.body,
  )
}

export default LookDay
