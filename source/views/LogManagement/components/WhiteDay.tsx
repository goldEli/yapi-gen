// 写日志

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
import { getReportDetail } from '@/services/daily'
import { t } from 'i18next'
import RichEditor from '@/components/RichEditor'
import UploadAttach from '@/components/UploadAttach'
import { useDispatch } from '@store/index'
import { changeRest } from '@store/log'
import { Editor, EditorRef } from '@xyfe/uikit'
import { uploadFileByTask, uploadFileToKey } from '@/services/cos'
import { getStaffListAll } from '@/services/staff'

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
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const WhiteDay = (props: any) => {
  const texts: any = [
    '',
    { name: t('p2.title.t1d'), name2: t('p2.title.t1t') },
    { name: t('p2.title.t2d'), name2: t('p2.title.t2t') },
    { name: t('p2.title.t3d'), name2: t('p2.title.t3t') },
  ]
  const editorRef = useRef<EditorRef>(null)
  const [form] = Form.useForm()
  const [attachList, setAttachList] = useState<any>([])
  const [peopleValue, setPeopleValue] = useState<any>([])
  const [needValue, setNeedValue] = useState<any>([])
  const [options, setOptions] = useState<any>([])
  const [colorState, setColorState] = useState<any>(false)
  const [title, setTitle] = useState<any>([])
  const leftDom: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const close = () => {
    form.resetFields()
    props.editClose()
    setAttachList([])
    setPeopleValue([])
    setNeedValue([])
  }

  const confirm = async () => {
    const data: any = await form.validateFields()

    await props.editConfirm(data, props.editId)
    dispatch(changeRest(true))
    close()
  }

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

  const setDefaultValue = async () => {
    const res = await getReportDetail(props.editId)

    const newTitle =
      localStorage.getItem('language') === 'zh'
        ? `${t('p2.edit')}${res.data.info.name.split('的')[1]}`
        : `${t('p2.edit')}${res.data.info.name.split('of')[1]}`

    setTitle(newTitle)
    form.setFieldsValue({
      info: res.data.info.finish_content,
      info2: res.data.info.plan_content,
    })

    setAttachList(
      res.data.files.map((item: any) => {
        return {
          url: item.associate,
          id: item.id,
          size: item.configurations.size,
          time: item.created_at,
          name: item.configurations.name,
          suffix: item.configurations.ext,
          username: res.data.info.user_name,
        }
      }),
    )
    setPeopleValue(
      res.data.copysend_list.map((item: any) => {
        return {
          avatar: item.avatar,
          id: item.user_id,
          name: item.name,
          nickname: '',
          positionName: null,
          roleName: '',
        }
      }),
    )
    setNeedValue(
      res.data.story_list.map((item: any) => {
        return {
          key: item.associate,
          value: Number(item.associate),
          label: item.name,
        }
      }),
    )
  }
  const getList = async () => {
    const result = await getStaffListAll({ all: 1 })

    setOptions(
      result.map((i: any) => ({
        id: i.id,
        label: i.name,
      })),
    )
  }

  useEffect(() => {
    if (props.editId && props.visibleEdit) {
      setDefaultValue()
    }
    getList()
    editorRef.current?.focus()
  }, [props.editId, props.visibleEdit])

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

    setColorState(false)
    return Promise.resolve()
  }
  if (!props.visibleEdit) {
    return null
  }
  return (
    <CommonModal
      width={784}
      title={props.visibleEditText ?? title}
      isVisible={props.visibleEdit}
      onClose={close}
      onConfirm={confirm}
      confirmText={t('newlyAdd.submit')}
    >
      <div
        style={{
          height: 'calc(90vh - 136px)',
          overflow: 'scroll',
          padding: ' 0 24px',
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
            label={<LabelTitle title={texts[props.type]?.name} />}
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
                    {t('p2.only1')}
                    {texts[props.type]?.name}
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            {/* <RichEditor height={178} autoFocus /> */}
            <Editor
              ref={editorRef}
              key={Math.random()}
              upload={file => {
                const key = uploadFileToKey(
                  file,
                  file.name,
                  `richEditorFiles_${new Date().getTime()}`,
                  false,
                  data => {
                    editorRef.current?.notifyUploaded(data.key, data.url)
                  },
                )
                return key
              }}
              getSuggestions={() => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    // resolve([])
                    resolve(options)
                  }, 1000)
                })
              }}
            />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle title={texts[props.type]?.name2} />}
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
                    {t('p2.only1')}
                    {texts[props.type]?.name2}
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              ref={editorRef}
              key={Math.random()}
              upload={file => {
                const key = uploadFileToKey(
                  file,
                  file.name,
                  `richEditorFiles_${new Date().getTime()}`,
                  false,
                  data => {
                    editorRef.current?.notifyUploaded(data.key, data.url)
                  },
                )
                return key
              }}
              getSuggestions={() => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    // resolve([])
                    resolve(options)
                  }, 1000)
                })
              }}
            />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.copySend')} />}
            name="people"
          >
            {props.visibleEdit ? (
              <ChoosePeople initValue={peopleValue} />
            ) : null}
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.attachment')} />}
            name="attachments"
          >
            <UploadAttach
              power
              defaultList={attachList}
              onChangeAttachment={onChangeAttachment}
              onBottom={onBottom}
              addWrap={
                <AddWrap
                  style={{
                    marginBottom: '20px',
                  }}
                  hasColor
                >
                  <IconFont type="plus" />
                  <div>{t('p2.addAdjunct') as unknown as string}</div>
                </AddWrap>
              }
            />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('p2.managingDemand')} />}
            name="needs"
          >
            {props.visibleEdit ? (
              <RelatedNeed onBootom={scrollToBottom} initValue={needValue} />
            ) : null}
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default WhiteDay
