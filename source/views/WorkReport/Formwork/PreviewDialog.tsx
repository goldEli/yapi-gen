// 编辑模板预览模板

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable consistent-return */
import { Form } from 'antd'
import CommonModal from '@/components/CommonModal'
import ChoosePeople from './ChoosePeople'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import { Editor, EditorRef } from 'ifunuikit'
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import styled from '@emotion/styled'

import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
// 添加符号 例： 标签添加与附件添加
const AddWrapText = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  borderRadius: 6,
  color: 'var(--primary-d2)',
  width: 'fit-content',
  '.anticon': {
    fontSize: 16,
    alignItems: 'center',
    svg: {
      margin: 0,
    },
  },
  div: {
    fontSize: 14,
    fontWeight: 400,
  },
})
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
  placehodler: string
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
        placeholder={props.placehodler}
        onChange={(e: string) => props.onChange?.(e)}
        ref={editorRef}
        upload={uploadFile}
        getSuggestions={() => options}
      />
    </div>
  )
}
const WhiteDay = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const { templateContentConfigs } = useSelector(store => store.formWork)
  const leftDom: any = useRef<HTMLInputElement>(null)

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
    props.onClose()
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
          <EditorMain
            isVisible={props.isVisible}
            type={props.type}
            placehodler={item.tips}
          />
        </Form.Item>
      )
    } else if (item.type === 1) {
      return (
        <Form.Item
          label={<LabelTitle title={item.name} />}
          name="people"
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
          {props.isVisible ? (
            <ChoosePeople type={props.type} initValue={[]} />
          ) : null}
        </Form.Item>
      )
    } else if (item.type === 2) {
      return (
        <Form.Item
          label={<LabelTitle title={item.name} />}
          name="attachments"
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
          <AddWrapText
            style={{
              cursor: '',
              marginBottom: '20px',
            }}
          >
            <IconFont type="plus" />
            {t('calendarManager.addAdjunct')}
          </AddWrapText>
        </Form.Item>
      )
    } else if (item.type === 4) {
      return (
        <Form.Item
          label={
            <LabelTitle
              title={t('p2.managingDemand')}
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
            />
          }
          name="needs"
        >
          <AddWrapText
            style={{
              marginBottom: '20px',
            }}
          >
            <IconFont type="plus" />
            {t('p2.RelatedRequirements')}
          </AddWrapText>
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
