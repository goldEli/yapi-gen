/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { NameWrap } from '@/components/StyleCommon'
import { addComment, getReportDetail } from '@/services/daily'
import {
  BigWrap,
  First,
  Gred,
  GredParent,
  Second,
} from '@/views/Project/Detail/Demand/components/UploadAttach'
import {
  IconFontWrap,
  NewNameWrap,
} from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Input, message, Modal, Spin } from 'antd'
import { use } from 'i18next'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { InnerLine } from './RelatedNeed'
import { LabelTitle } from './WhiteDay'

const GrepWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
`
const FormWrap = styled.div<{ left: any }>`
  width: 784px;
  height: 898px;
  background: #ffffff;
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotateY(${({ left }) => left}deg);
  transition: all 2s linear;
  box-sizing: border-box;
  padding: 24px;
  padding-top: 0px;
`
const HiddenWrap = styled.div`
  perspective: 1000px;
  transform-style: preserve-3d;
  transform-origin: 100px 100px;
  perspective-origin: center;
  /* overflow: hidden; */
  width: 784px;
  height: 898px;
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
`
const Arrow2 = styled(Arrow)`
  left: 80%;
`

const LookDay = (props: any) => {
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
  const messagesEndRef = useRef<any>(null)
  const onChangeLeft = (values: any, type: any) => {
    props.onChange(type, props.editId)
  }

  const setDefaultValue = async () => {
    setIsSpinning(false)
    const res = await getReportDetail(props.editId)

    setTitle(res.data.info.name)
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
    setTimeout(() => {
      setIsSpinning(true)
    }, 1000)
  }
  useEffect(() => {
    if (props.editId && props.visible) {
      setDefaultValue()
    }
  }, [props.editId, props.visible])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
  }
  const sendComment = async () => {
    if (!value) {
      myArea.current.focus()

      return
    }
    const res = await addComment({
      id: props.editId,
      content: value,
    })
    if (res.code === 0) {
      message.success('评论成功')
      setDefaultValue()
      setValue('')
      scrollToBottom()
    }
  }
  const handleCancel = () => setPreviewOpen(false)
  if (!props.visible) {
    return null
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
              <span>{title}</span>
              <span
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => props.onEditClose()}
              >
                <IconFont
                  type="close"
                  style={{ color: '#323233', fontSize: 20 }}
                />
              </span>
            </div>
            <div
              ref={messagesEndRef}
              style={{
                height: '840px',
                overflow: 'scroll',
              }}
            >
              <LabelTitle title="今日完成工作" />
              <div dangerouslySetInnerHTML={{ __html: article1 }} />
              <LabelTitle title="明日计划工作" />
              <div dangerouslySetInnerHTML={{ __html: article2 }} />
              <LabelTitle title="抄送人" />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {peopleValue?.map((i: any) => (
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
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginRight: '24px',
                      }}
                    >
                      <NewNameWrap>
                        {i.avatar ? (
                          <img
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                            }}
                            src={i.avatar}
                          />
                        ) : (
                          <NameWrap style={{ margin: 0 }}>
                            {String(
                              i.name.substring(0, 1).trim().slice(0, 1),
                            ).toLocaleUpperCase()}
                          </NameWrap>
                        )}
                      </NewNameWrap>
                      <span>{i.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <LabelTitle title="附件" />
              <div>
                {attachList.map((item: any) => (
                  <BigWrap
                    key={item.id}
                    style={{
                      display: 'flex',
                      marginBottom: '16px',
                    }}
                  >
                    <GredParent
                      onClick={() => {
                        setPreviewOpen(true)
                        setPreviewImage(item.path)
                        setPreviewTitle(item.path.split('/').at(-1))
                      }}
                      style={{
                        marginRight: '8px',
                        position: 'relative',
                      }}
                    >
                      <img
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                        src={item.path}
                        alt=""
                      />
                      <Gred>
                        <IconFont
                          style={{ fontSize: 18, color: 'white' }}
                          type="zoomin"
                        />
                      </Gred>
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
                        {item.path.split('/').at(-1)}
                      </div>
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
                          杨一
                        </span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </BigWrap>
                ))}
              </div>
              <LabelTitle title="关联需求" />
              <div>
                {needValue.map((item: any) => (
                  <InnerLine key={item.key}>
                    <span>{item.label}</span>
                  </InnerLine>
                ))}
              </div>
              <LabelTitle title="已阅" />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {peopleValue
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
                          flexDirection: 'column',
                          alignItems: 'center',
                          marginRight: '24px',
                        }}
                      >
                        <NewNameWrap>
                          {i.avatar ? (
                            <img
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                              }}
                              src={i.avatar}
                            />
                          ) : (
                            <NameWrap style={{ margin: 0 }}>
                              {String(
                                i.name.substring(0, 1).trim().slice(0, 1),
                              ).toLocaleUpperCase()}
                            </NameWrap>
                          )}
                        </NewNameWrap>
                        <span>{i.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <LabelTitle title="评论" />
              <div>
                <Input.TextArea
                  ref={myArea}
                  autoSize={{ minRows: 1, maxRows: 10 }}
                  placeholder="请输入"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
                <button
                  onClick={sendComment}
                  style={{
                    width: '40px',
                    height: '24px',
                    background: '#2877FF',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#FFFFFF',
                    marginTop: '8px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  评论
                </button>
              </div>
              {contentList.map((item: any) => (
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
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                        }}
                        src={item.avatar}
                      />
                    ) : (
                      <NameWrap style={{ margin: 0 }}>
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
                      }}
                    >
                      {item.created_at}
                    </span>
                  </div>
                  <div
                    style={{
                      paddingLeft: '40px',
                      width: '100%',
                      wordBreak: 'break-all',
                    }}
                  >
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </FormWrap>
        ) : (
          <Spin tip="加载中" size="large" />
        )}
      </HiddenWrap>

      <Arrow onClick={() => onChangeLeft(0, 1)}>
        <IconFont type="left" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow>
      <Arrow2 onClick={() => onChangeLeft(360, 2)}>
        <IconFont type="right" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow2>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </GrepWrap>,
    document.body,
  )
}

export default LookDay
