/* eslint-disable @typescript-eslint/naming-convention */
//  评论的弹框

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */

/* eslint-disable no-cond-assign */
import UploadAttach from '@/components/UploadAttach'
import { Form } from 'antd'
import { createRef, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from './CommonModal'
import IconFont from './IconFont'
import { AddWrap } from './StyleCommon'
import { Editor } from '@xyfe/uikit'
import { uploadFile } from './AddWorkItem/CreateWorkItemLeft'
import { useDispatch, useSelector } from '@store/index'
import { changeRestScroll } from '@store/scroll'
import { getIdsForAt, removeNull } from '@/tools'
import { getMessage } from './Message'

const LabelTitle = (props: any) => {
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

const EditComment = (props: any) => {
  const [form] = Form.useForm()
  const editable = useRef<HTMLInputElement>(null)
  const attachDom: any = createRef()
  const [t] = useTranslation()
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const dispatch = useDispatch()
  const { projectInfoValues } = useSelector(store => store.project)

  const onValidator = (rule: any, value: any) => {
    if (value === '<p><br></p>' || value.trim() === '') {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }

    return Promise.resolve()
  }

  const onChangeAttachment = (result: any) => {
    const arrs = result.map((i: any) => {
      return {
        url: i.url,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ctime: i.ctime,
        username: i.user_name,
        name: i.name,
        ext: i.ext,
        size: i.size,
      }
    })
    form.setFieldsValue({
      attachments: arrs,
    })
  }

  const onClose = () => {
    props.editClose()
  }
  const texts: any = [
    '',
    { name: t('p2.title.t1d'), name2: t('p2.title.t1t') },
    { name: t('p2.title.t2d'), name2: t('p2.title.t2t') },
    { name: t('p2.title.t3d'), name2: t('p2.title.t3t') },
  ]

  const confirm = async () => {
    await form.validateFields()
    const inner = document.getElementById('inner')
    if (!String(inner?.innerHTML).trim()) {
      getMessage({ msg: t('new_p1.a9'), type: 'warning' })
      return
    }

    // 未上传成功的个数
    const stateLength = attachDom.current?.getAttachState()
    if (stateLength) {
      getMessage({ msg: t('version2.haveNoSuccessAttach'), type: 'warning' })
      return
    }

    await props.editConfirm({
      content: form.getFieldsValue().info,
      attachment: form.getFieldsValue().attachments,
      a_user_ids: getIdsForAt(form.getFieldsValue().info),
    })
    dispatch(changeRestScroll(true))
  }

  useEffect(() => {
    setTimeout(() => {
      editable.current?.focus()
    }, 100)

    form.resetFields()
  }, [props.visibleEdit])

  const onsubmit = () => {
    form.submit()
  }
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleShortcutEvent()
      }
    }

    const handleKeyUp = (event: any) => {
      if (event.key === 'Control') {
        setIsCtrlPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const handleShortcutEvent = () => {
    // 在此处理按下 Ctrl + 回车 触发的事件
    console.log('Ctrl + 回车 被按下')
    onsubmit()
  }
  return (
    <CommonModal
      width={784}
      title={t('new_p1.a4')}
      isVisible={props.visibleEdit}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={t('newlyAdd.submit')}
    >
      <div
        style={{
          height: 'calc(90vh - 40vh)',
          overflow: 'scroll',
          padding: '0 24px',
        }}
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
            }, 200)
          }}
        >
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle title={t('new_p1.a4')} />}
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
            <Editor
              at
              upload={uploadFile}
              getSuggestions={() =>
                removeNull(projectInfoValues, 'user_name')?.map((k: any) => ({
                  label: k.content,
                  id: k.id,
                }))
              }
            />
          </Form.Item>
          <Form.Item
            label={<LabelTitle title={t('common.attachment')} />}
            name="attachments"
          >
            <UploadAttach
              onRef={attachDom}
              key={1}
              power
              canUpdate={false}
              onChangeAttachment={onChangeAttachment}
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
        </Form>
      </div>
    </CommonModal>
  )
}

export default EditComment
