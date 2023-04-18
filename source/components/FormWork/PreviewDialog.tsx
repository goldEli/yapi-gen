// 编辑模板预览模板

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable consistent-return */
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
import { useSelector } from '@store/index'
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
interface EditorPropsType {
  // 类型 formWork 禁用掉所有
  type: string
  isVisible: boolean
  onChange?(e: string): void
  value?: string
}
const EditorMain = (props: EditorPropsType) => {
  const editorRef = useRef<EditorRef>(null)
  const [options, setOptions] = useState<any>([])
  useEffect(() => {
    if (props.type !== 'formWork') {
      setTimeout(() => {
        editorRef.current?.focus()
      }, 100)
    }
  }, [props.isVisible])
  return (
    <div
      style={{
        pointerEvents: props.type === 'formWork' ? 'none' : 'all',
      }}
    >
      <Editor
        value={props.value}
        onChange={(e: string) => props.onChange?.(e)}
        ref={editorRef}
        upload={uploadFile}
        getSuggestions={() => options}
      />
    </div>
  )
}
const WhiteDay = (props: Props) => {
  const [form] = Form.useForm()
  const { templateContentConfigs } = useSelector(store => store.formWork)

  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
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
  const onConfirm = () => {
    const values = form.getFieldsValue()
  }
  const getMain = (item: any) => {
    if (item.type == 3) {
      return (
        <Form.Item
          style={{
            marginBottom: '30px',
          }}
          label={<LabelTitle title={item?.name} />}
          name="info"
          rules={[
            {
              validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
              required: item.is_required === 1 ? true : false,
              message: (
                <div
                  style={{
                    margin: '5px 0',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.tips}
                </div>
              ),
              whitespace: true,
              validator: onValidator,
            },
          ]}
        >
          <EditorMain isVisible={props.isVisible} type={props.type} />
        </Form.Item>
      )
    } else if (item.type === 1) {
      return (
        <Form.Item label={<LabelTitle title={'汇报对象'} />} name="people">
          {props.isVisible ? (
            <ChoosePeople type={props.type} initValue={peopleValue} />
          ) : null}
        </Form.Item>
      )
    } else if (item.type === 2) {
      return (
        <Form.Item
          label={<LabelTitle title={t('common.attachment')} />}
          name="attachments"
        >
          <AddWrap
            style={{
              marginBottom: '20px',
            }}
            hasColor
          >
            <IconFont type="plus" />
            添加附件
          </AddWrap>
        </Form.Item>
      )
    } else if (item.type === 4) {
      return (
        <Form.Item
          label={<LabelTitle title={t('p2.managingDemand')} />}
          name="needs"
        >
          <AddWrap
            style={{
              marginBottom: '20px',
            }}
            hasColor
          >
            <IconFont type="plus" />
            关联需求
          </AddWrap>
        </Form.Item>
      )
    }
  }
  return (
    <CommonModal
      width={784}
      noCancel
      title={props.title}
      isVisible={props.isVisible}
      onClose={props.onClose}
      onConfirm={() => onConfirm()}
      confirmText={'再次编辑'}
    >
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
          {templateContentConfigs?.map((item: any) => {
            return <>{getMain(item)}</>
          })}
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
