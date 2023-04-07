// 编辑模板预览模板

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
import { Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import ChoosePeople from './ChoosePeople'
import RelatedNeed from './RelatedNeed'
import IconFont from '@/components/IconFont'
import { AddWrap } from '@/components/StyleCommon'
import { useEffect, useRef, useState } from 'react'
import { t } from 'i18next'
import UploadAttach from '@/components/FormWork/UploadAttach'
import { Editor, EditorRef } from '@xyfe/uikit'
import { uploadFile } from '@/components/CreateDemand/CreateDemandLeft'
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 24px 24px;
`

const LeftWrap = styled.div`
  display: flex;
  align-items: center;
`
const RightWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n2);
  &:hover {
    cursor: pointer;
  }
`
const Text = styled.span`
  margin-left: 2px;
`
const ImgWrap = styled.img`
  width: 40px;
  height: 40px;
  border: 1px solid red;
  margin-right: 12px;
`
const TopWrap = styled.div`
  font-size: 16px;
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  span:nth-child(2) {
    font-size: 12px;
  }
`
const BottomWrap = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`
export const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'SiYuanMedium',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}
interface UserDetail {
  // 名称
  title: string
  // 时间
  time: string
  // 提交时间
  submitTime: string
}
interface Props {
  title: string
  isVisible: boolean
  onClose(): void
  onConfirm(): void
  // 类型 formWork 禁用掉所有
  type: string
  // 头部用户信息
  userDetail?: UserDetail
  // 表单是配置出来的不是写死的，传值传过来
  dataList: []
}
const WhiteDay = (props: Props) => {
  const editorRef = useRef<EditorRef>(null)
  const editorRef2 = useRef<EditorRef>(null)
  const [form] = Form.useForm()
  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
  const [options, setOptions] = useState<any>([])
  const leftDom: any = useRef<HTMLInputElement>(null)

  const onChangeAttachment = (result: any) => {
    const arr = result.map((i: any) => {
      return {
        url: i.url,
        created_at: i.ctime,
        configurations: {
          name: i.name,
          ext: i.ext,
          size: i.size,
        },
      }
    })

    form.setFieldsValue({
      attachments: arr,
    })
  }

  const onBottom = () => {
    const dom: any = leftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  useEffect(() => {
    if (props.type !== 'formWork') {
      setTimeout(() => {
        editorRef.current?.focus()
      }, 100)
    }
  }, [props.isVisible])

  const scrollToBottom = () => {
    setTimeout(() => {
      leftDom.current.scrollTo({
        top: leftDom.current.scrollHeight,
        behavior: 'smooth',
      })
    })
  }
  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }
  if (!props.isVisible) {
    return null
  }

  return (
    <CommonModal
      width={784}
      title={props.title}
      isVisible={props.isVisible}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
      confirmText={t('newlyAdd.submit')}
    >
      {props.type === 'formWork' ? null : (
        <HeaderWrap>
          <LeftWrap>
            <ImgWrap src="" />
            <div>
              <TopWrap>
                <span>{props.userDetail?.title}</span>
                <span>{props.userDetail?.title}</span>
              </TopWrap>
              <BottomWrap>
                <span>上次提交时间：</span>
                <span>{props.userDetail?.submitTime}</span>
              </BottomWrap>
            </div>
          </LeftWrap>
          <RightWrap
            onClick={() => {
              alert(133)
            }}
          >
            <CommonIconFont
              type="Import"
              transform="rotate(180deg)"
              size={16}
              color="var(--neutral-n2)"
            />
            <Text>导入上篇</Text>
          </RightWrap>
        </HeaderWrap>
      )}
      <div
        style={{
          height: 'calc(90vh - 136px)',
          overflow: 'scroll',
          padding: ' 0 24px',
          position: 'relative',
        }}
        ref={leftDom}
      >
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {
            setTimeout(() => {
              const errorList = (document as any).querySelectorAll(
                '.ant-form-item-has-error',
              )

              errorList[0].scrollIntoView({
                block: 'center',
                behavior: 'smooth',
              })
            }, 100)
          }}
        >
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle title={'今日工作'} />}
            name="info"
            rules={[
              {
                validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                required: true,
                message: (
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    请输入
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              ref={editorRef}
              upload={uploadFile}
              getSuggestions={() => options}
            />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle title={'明日工作'} />}
            name="info2"
            rules={[
              {
                validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                required: true,
                message: (
                  <div
                    style={{
                      margin: '5px 0',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    请输入
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor upload={uploadFile} getSuggestions={() => options} />
          </Form.Item>
          <Form.Item label={<LabelTitle title={'汇报对象'} />} name="people">
            {props.isVisible ? (
              <ChoosePeople type={props.type} initValue={peopleValue} />
            ) : null}
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.attachment')} />}
            name="attachments"
          >
            {props.type === 'formWork' ? (
              <AddWrap
                style={{
                  marginBottom: '20px',
                }}
                hasColor
              >
                <IconFont type="plus" />
                添加附件
              </AddWrap>
            ) : (
              <UploadAttach
                power
                defaultList={attachList}
                onChangeAttachment={onChangeAttachment}
                onBottom={onBottom}
                type={props.type}
                addWrap={
                  <AddWrap
                    style={{
                      marginBottom: '20px',
                    }}
                    hasColor
                  >
                    <IconFont type="plus" />
                    添加附件
                  </AddWrap>
                }
              />
            )}
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('p2.managingDemand')} />}
            name="needs"
          >
            {props.type === 'formWork' ? (
              <AddWrap
                style={{
                  marginBottom: '20px',
                }}
                hasColor
              >
                <IconFont type="plus" />
                关联需求
              </AddWrap>
            ) : (
              <RelatedNeed onBootom={scrollToBottom} initValue={needValue} />
            )}
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
