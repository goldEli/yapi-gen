/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { NameWrap } from '@/components/StyleCommon'
import {
  IconFontWrap,
  NewNameWrap,
} from '@/views/Project/Detail/Setting/DemandSet/Workflow/components/ExamineItem'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Input } from 'antd'
import { use } from 'i18next'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { InnerLine } from './RelatedNeed'
import { LabelTitle } from './WhiteDay'

const move = keyframes`
  0% {
      transform: translate(100%);
    }
  
    100% {
      transform: translateX(-100%);
    }
`

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
  left: ${({ left }) => left};
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 1s linear;
  /* animation: ${move} 2s ease infinite; */
  box-sizing: border-box;
  padding: 24px;
  padding-top: 0px;
`
const HiddenWrap = styled.div`
  overflow: hidden;
  width: 784px;
  height: 898px;
  border-radius: 8px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

const article = '<div>我是富文本内容<span >123</span></div>'
const LookDay = (props: any) => {
  const [left, setLeft] = useState('50%')
  const onChangeLeft = (value: any) => {
    setLeft(value)
    setTimeout(() => {
      setLeft('50%')
    }, 1000)
  }
  if (!props.visible) {
    return null
  }

  return ReactDOM.createPortal(
    <GrepWrap>
      <HiddenWrap>
        <FormWrap left={left}>
          <div
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>何飞的日报2022-08-25</span>
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
          <LabelTitle title="今日完成工作" />
          <div dangerouslySetInnerHTML={{ __html: article }} />
          <LabelTitle title="明日计划工作" />
          <div dangerouslySetInnerHTML={{ __html: article }} />
          <LabelTitle title="抄送人" />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {[1, 2, 3]?.map((i: any) => (
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
                        {/* {String(
                            i?.substring(0, 1).trim()
                              .slice(0, 1),
                          ).toLocaleUpperCase()} */}
                        12
                      </NameWrap>
                    )}
                  </NewNameWrap>
                  <span>{i}</span>
                </div>
              </div>
            ))}
          </div>

          <LabelTitle title="附件" />
          <div dangerouslySetInnerHTML={{ __html: article }} />
          <LabelTitle title="关联需求" />
          <div>
            {[1, 23].map((item: any) => (
              <InnerLine key={item}>
                <span>{item}</span>
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
            {[1, 2, 3]?.map((i: any) => (
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
                        {/* {String(
                            i?.substring(0, 1).trim()
                              .slice(0, 1),
                          ).toLocaleUpperCase()} */}
                        12
                      </NameWrap>
                    )}
                  </NewNameWrap>
                  <span>{i}</span>
                </div>
              </div>
            ))}
          </div>
          <LabelTitle title="评论" />
          <div>
            <Input placeholder="Basic usage" />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '24px',
              marginTop: '12px',
              marginBottom: '4px',
            }}
          >
            <NameWrap style={{ margin: 0 }}>
              {/* {String(
                            i?.substring(0, 1).trim()
                              .slice(0, 1),
                          ).toLocaleUpperCase()} */}
              12
            </NameWrap>
            <span
              style={{
                margin: '0 10px',
              }}
            >
              张三
            </span>
            <span
              style={{
                color: '#969799',
              }}
            >
              2022-06-20 15:30
            </span>
          </div>
          <div
            style={{
              paddingLeft: '40px',
            }}
          >
            评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容
            评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容
            评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容
          </div>
        </FormWrap>
      </HiddenWrap>

      <Arrow onClick={() => onChangeLeft('-100%')}>
        <IconFont type="left" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow>
      <Arrow2 onClick={() => onChangeLeft('180%')}>
        <IconFont type="right" style={{ color: '#FFFFFF', fontSize: 20 }} />
      </Arrow2>
    </GrepWrap>,
    document.body,
  )
}

export default LookDay
