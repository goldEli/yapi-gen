/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable complexity */
import CommonModal from '@/components/CommonModal'
import IconFont from '@/components/IconFont'
import { NameWrap, TextWrapEditor } from '@/components/StyleCommon'
import { addComment, getReportDetail } from '@/services/daily'
import {
  BigWrap,
  First,
  Gred,
  GredParent,
  Second,
} from '@/views/Project/Detail/Demand/components/UploadAttach'
import { NewNameWrap } from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Input, message, Modal, Spin } from 'antd'
import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
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
  /* overflow: hidden; */
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
      {/* <div
        style={{
          width: '3px',
          height: '16px',

          background: '#2877FF',
          display: 'inline-block',
          marginRight: '8px',
        }}
      /> */}
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
const imgs = ['png', 'webp', 'jpg', 'jpeg', 'png', 'gif']
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
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
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
          time: item.created_at,
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
  const handleCancel = () => setPreviewOpen(false)
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
  return ReactDOM.createPortal(
    <GrepWrap>
      <HiddenWrap>
        {isSpinning ? (
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
              <span
                style={{
                  cursor: 'pointer',
                  marginRight: '24px',
                }}
                onClick={() => props.onEditClose()}
              >
                <IconFont
                  className={hover}
                  type="close"
                  style={{ color: '#323233', fontSize: 20 }}
                />
              </span>
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
                <TextWrapEditor
                  dangerouslySetInnerHTML={{ __html: article1 }}
                />
              ) : (
                <Kong />
              )}

              <LabelTitle title={texts[props.type]?.name2} />
              {article2 ? (
                <TextWrapEditor
                  dangerouslySetInnerHTML={{ __html: article2 }}
                />
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
                        <NewNameWrap>
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
                        </NewNameWrap>
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
                    <BigWrap
                      key={item.id}
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
                        {imgs.includes(item.path.split('.').at(-1)) && (
                          <img
                            style={{
                              width: '40px',
                              height: '42px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            src={item.path}
                            alt=""
                          />
                        )}
                        {item.path.split('.').at(-1) === 'xlsx' && (
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
                        {item.path.split('.').at(-1) === 'pdf' && (
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
                        {item.path.split('.').at(-1) === 'word' && (
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
                        {!fils2.includes(item.path.split('.').at(-1)) && (
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
                        {imgs.includes(item.path.split('.').at(-1)) && (
                          <Gred
                            onClick={() => {
                              setPreviewOpen(true)
                              setPreviewImage(item.path)
                              setPreviewTitle(item.path.split('/').at(-1))
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
                            height: '22px',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#646566',
                            lineHeight: '22px',
                          }}
                        >
                          {item.path.split('/').at(-1)}
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
                          <span
                            onClick={() =>
                              onDownload(item.path, item.path.split('/').at(-1))
                            }
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
                        </Second>
                      </div>
                    </BigWrap>
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
                          <NewNameWrap>
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
                          </NewNameWrap>
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
        ) : null}
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
      <CommonModal
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
    </GrepWrap>,
    document.body,
  )
}

export default LookDay
