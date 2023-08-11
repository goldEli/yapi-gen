/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-case-declarations */
/* eslint-disable no-constant-binary-expression */
import { uploadFile } from '@/components/AddWorkItem/CreateWorkItemLeft'
import { LabelTitle } from '@/views/WorkReport/Review/components/style'
import { Editor } from '@xyfe/uikit'
import { Checkbox, DatePicker, Form, Input, Radio } from 'antd'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CommonModal from '@/components/CommonModal'
import {
  createSysNotice,
  editCreateSysNotice,
  getMyAllSysNoticeDetail,
} from '@/services/sysNotice'
import moment from 'moment'
import AcceptorSelection from '@/components/AcceptorSelection/AcceptorSelection'
import { getMessage } from '@/components/Message'
import styled from '@emotion/styled'
const RedDiv = styled.div`
  &
    .ant-form-item-label
    > label.ant-form-item-required:not(
      .ant-form-item-required-mark-optional
    )::after {
    content: '';
  }
`

const CreateNoteModal = (props: any) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [defaultData, setDefaultData] = useState([])
  const [taskTime, setTaskTime] = useState(false)

  const onValidator = (rule: any, value: any) => {
    const plainText = value.replace(/<[^>]+>/g, '')

    if (plainText.length > 800) {
      return Promise.reject(new Error(t('characters_over')))
    }
    if (
      (value === '<p><br></p>' ||
        value === '<p> </p>' ||
        value?.trim() === '' ||
        !value) &&
      rule?.required
    ) {
      return Promise.reject(new Error(t('the_message_content_cannot_be_empty')))
    }
    return Promise.resolve()
  }

  // 验证定时发送时间

  const onValidator2 = (rule: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error(t('other.pleaseSendTime')))
    }
    const expire_time = form.getFieldValue('expire_time')

    if (!expire_time) {
      return Promise.reject(new Error(t('other.pleaseTime')))
    }
    const eTime = expire_time.valueOf()
    const sTime = value.valueOf()

    if (eTime < sTime) {
      return Promise.reject(new Error(t('other.pleaseText')))
    }

    return Promise.resolve()
  }
  const onChange = (e: any) => {
    setTaskTime(e.target.checked)
  }
  const setPeople = (memebr: any) => {
    return memebr.reduce((acc: any, item: any) => {
      const { target_type, target_id } = item

      if (target_id === -1) {
        acc.all = 1
      } else {
        switch (target_type) {
          case 1:
            if (!acc.user_ids) {
              acc.user_ids = []
            }
            acc.user_ids.push(target_id)
            break
          case 2:
            if (!acc.department_ids) {
              acc.department_ids = []
            }
            acc.department_ids.push(target_id)
            break
          case 3:
            if (!acc.team_ids) {
              acc.team_ids = []
            }
            acc.team_ids.push(target_id)
            break
          default:
            break
        }
      }

      return acc
    }, {})
  }
  const onHandleOk = async () => {
    const res = await form.validateFields()

    res.expire_time = res.expire_time.format('YYYY-MM-DD HH:mm:ss')
    res.send_time = res.send_time?.format('YYYY-MM-DD HH:mm:ss')
    const obj = {
      send_email: res.recipient2.isEmail ? 1 : 2,

      recipient: setPeople(res.recipient2.member),
    }

    const mergedObj = { ...res, ...obj }
    delete mergedObj.recipient2
    if (props.editId) {
      const res2 = await editCreateSysNotice({ ...mergedObj, id: props.editId })

      if (res2.code === 0) {
        form.resetFields()
        props.onClose()
        getMessage({
          msg: t('succeed') as string,
          type: 'success',
        })
        props.onHandleOk()
      }
      return
    }
    const res2 = await createSysNotice(mergedObj)

    if (res2.code === 0) {
      form.resetFields()
      props.onClose()
      setTaskTime(false)
      getMessage({
        msg: t('succeed') as string,
        type: 'success',
      })
      props.onHandleOk()
    }
  }
  const onSaveDraft = async () => {
    const res = await form.validateFields()

    res.expire_time = res.expire_time.format('YYYY-MM-DD HH:mm:ss')
    const obj = {
      is_draft: 1,
      send_email: res.recipient2.isEmail ? 1 : 2,

      recipient: setPeople(res.recipient2.member),
    }

    const mergedObj = { ...res, ...obj }
    delete mergedObj.recipient2

    if (props.editId) {
      const res2 = await editCreateSysNotice({ ...mergedObj, id: props.editId })

      if (res2.code === 0) {
        form.resetFields()
        props.onClose()
        getMessage({
          msg: t('succeed') as string,
          type: 'success',
        })
        props.onHandleOk()
      }
      return
    }
    const res2 = await createSysNotice(mergedObj)

    if (res2.code === 0) {
      form.resetFields()
      props.onClose()
      getMessage({
        msg: t('succeed') as string,
        type: 'success',
      })
      props.onHandleOk()
    }
  }

  function disabledDate(current: any) {
    // 获取当前时间

    // 获取当前时间10分钟后的时间
    const minTime = moment().add(11, 'minutes')

    // 如果当前日期小于或等于当前时间10分钟后的日期，则禁用
    return current && current <= minTime
  }
  function disabledDate2(current: any) {
    // 获取当前时间

    // 获取当前时间10分钟后的时间
    const minTime = moment().add(1, 'minutes')

    // 如果当前日期小于或等于当前时间10分钟后的日期，则禁用
    return current && current <= minTime
  }
  const judge = (time: any) => {
    if (time) {
      setTaskTime(true)
      form.setFieldsValue({
        send_time: moment(time),
      })
    }
  }
  const transformedArray = (array: any) => {
    return array?.map((item: any) => {
      return {
        target_id: item.id,
        user_type: 1,
        target_type: 1,
        target_value: {
          name: item.name,
          avatar: item.avatar,
        },
      }
    })
  }
  const judgePeople = (data: any) => {
    form.setFieldsValue({
      recipient2: data,
    })
  }

  const getEditData = async () => {
    const res = await getMyAllSysNoticeDetail(props.editId)

    setDefaultData(res.recipient.user_ids)
    form.setFieldsValue({
      content: res.content,
      title: res.title,
      type: res.type,
      notice_style: res.notice_style,
      expire_time: moment(res.expire_time),

      // send_time: res.expire_time ? moment(res.send_time):null,
    })

    judgePeople({
      member: res.recipient?.all
        ? [
            {
              target_id: -1,
              user_type: 1,
              target_value: {
                user_type: 1,
                key: 'all',
                name: '全员',
                avatar: '',
              },
            },
          ]
        : transformedArray(res.recipient_users),

      isEmail: res.send_email,
    })
    judge(res.send_time)
  }

  useEffect(() => {
    if (props.isVisible) {
      form.setFieldsValue({
        content: '<p></p>',
      })
    }
    if (props.editId && props.isVisible) {
      getEditData()
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
    return () => {
      form.resetFields()
    }
  }, [props.editId, props.isVisible])
  const onsubmit = () => {
    form.submit()
  }
  return (
    <CommonModal
      confirmText={t('send')}
      onSaveDraft={onSaveDraft}
      draft
      isVisible={props.isVisible}
      width={784}
      title={props.editId ? t('edit_notification') : t('send_notification')}
      onClose={props.onClose}
      onConfirm={onsubmit}
    >
      <div
        style={{
          padding: '0 24px',
          position: 'relative',
          overflow: 'scroll',
          height: 'calc(100vh - 300px)',
        }}
      >
        <Form
          form={form}
          onFinish={onHandleOk}
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
            label={<LabelTitle>{t('notification_title')}</LabelTitle>}
            name="title"
            rules={[{ required: true, message: t('enter_title') }]}
          >
            <Input
              ref={inputRefDom as any}
              maxLength={20}
              placeholder={t('enter_title_max_length')}
            />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle>{t('notification_content')}</LabelTitle>}
            name="content"
            rules={[
              {
                validateTrigger: ['onFinish', 'onBlur', 'onFocus'],
                required: true,
                // message: (
                //   <div
                //     style={{
                //       margin: '5px 0',
                //       fontSize: '12px',
                //       display: 'flex',
                //       alignItems: 'center',
                //     }}
                //   >
                //     {t('enter_content')}
                //   </div>
                // ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              upload={uploadFile}
              getSuggestions={() => []}
              placeholder={t('enter_content_max_length')}
            />
          </Form.Item>

          <Form.Item
            initialValue={1}
            name="type"
            label={<LabelTitle>{t('notification_type')}</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group>
              <Radio value={2}>{t('daily_notification')}</Radio>
              <Radio value={1}>{t('system_notification')}</Radio>
              <Radio defaultChecked value={3}>
                {t('important_notification')}
              </Radio>
              <Radio value={4}>{t('activity_notification')}</Radio>
              <Radio value={5}>{t('holiday_notification')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="recipient2"
            label={<LabelTitle>{t('recipient')}</LabelTitle>}
            rules={[{ required: true, message: t('other.pleaseObj') }]}
          >
            <AcceptorSelection data={defaultData} />
          </Form.Item>

          <Form.Item
            initialValue={1}
            name="notice_style"
            label={<LabelTitle>{t('reminder_method')}</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group>
              <div
                style={{
                  display: 'flex',

                  gap: '56px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <Radio value={1}>{t('popup_reminder')}</Radio>
                  <img
                    style={{
                      width: '104px',
                    }}
                    src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/type1.png"
                    alt=""
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <Radio defaultChecked value={2}>
                    {t('top_banner_reminder')}
                  </Radio>
                  <img
                    style={{
                      width: '240px',
                    }}
                    src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/type2.png"
                    alt=""
                  />
                </div>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={<LabelTitle>{t('expiration_time')}</LabelTitle>}
            name="expire_time"
            rules={[{ required: true, message: t('select_expiration_time') }]}
          >
            <DatePicker
              showNow={false}
              disabledDate={disabledDate2}
              showTime
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <RedDiv>
            <Checkbox onChange={onChange}>{t('schedule_send')}</Checkbox>
            {taskTime ? (
              <Form.Item
                label={<LabelTitle></LabelTitle>}
                name="send_time"
                rules={[
                  {
                    required: true,
                    validator: onValidator2,
                  },
                ]}
              >
                <DatePicker
                  showNow={false}
                  disabledDate={disabledDate}
                  showTime
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            ) : null}
          </RedDiv>
        </Form>
      </div>
    </CommonModal>
  )
}

export default CreateNoteModal
