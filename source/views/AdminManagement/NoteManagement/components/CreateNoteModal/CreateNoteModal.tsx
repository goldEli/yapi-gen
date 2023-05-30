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
import CommonModal2 from '@/components/AddUser/CommonModal'
import { LabelTitle } from '@/views/WorkReport/Review/components/style'
import { Editor } from '@xyfe/uikit'
import { Checkbox, DatePicker, Dropdown, Form, Input, Radio } from 'antd'

import React, { useEffect, useState } from 'react'
import type1 from '/type1.png'
import type2 from '/type2.png'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { setEditSave } from '@store/formWork'
import { useDispatch } from '@store/index'
import { useTranslation } from 'react-i18next'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'

import CommonModal from '@/components/CommonModal'
import { seleData1 } from '@/views/WorkReport/Formwork/DataList'
import {
  Col,
  DefalutIcon,
  NameText,
  PersonContainer,
} from '@/views/WorkReport/Formwork/Addperson'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import { createSysNotice, getMyAllSysNoticeDetail } from '@/services/sysNotice'
import moment from 'moment'
import AcceptorSelection from '@/components/AcceptorSelection/AcceptorSelection'
import { getMessage } from '@/components/Message'

const CreateNoteModal = (props: any) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()

  const [taskTime, setTaskTime] = useState(false)
  const [taskTimeString, setTaskTimeString] = useState<string>('')

  const onValidator = (rule: any, value: any) => {
    if (
      (value === '<p><br></p>' ||
        value === '<p></p>' ||
        value?.trim() === '' ||
        !value) &&
      rule?.required
    ) {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!'),
      )
    }
    return Promise.resolve()
  }
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
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
    const obj = {
      send_email: res.recipient2.isEmail ? 1 : 2,

      recipient: setPeople(res.recipient2.member),
    }

    const mergedObj = { ...res, ...obj }
    delete mergedObj.recipient2

    const res2 = await createSysNotice(mergedObj)

    if (res2.code === 0) {
      form.resetFields()
      props.onClose()
      getMessage({
        msg: t('common.editSuccess') as string,
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

    const res2 = await createSysNotice(mergedObj)

    if (res2.code === 0) {
      form.resetFields()
      props.onClose()
      getMessage({
        msg: t('common.editSuccess') as string,
        type: 'success',
      })
      props.onHandleOk()
    }
  }

  const onChangeTaskTime = (time: any, timeString: string) => {
    setTaskTimeString(timeString)
    console.log(time, timeString)
  }

  function disabledDate(current: any) {
    // 获取当前时间

    // 获取当前时间10分钟后的时间
    const minTime = moment().add(10, 'minutes')

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
    console.log(array)

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
    form.setFieldsValue({
      content: res.content,
      title: res.title,
      type: res.type,
      notice_style: res.notice_style,
      expire_time: moment(res.expire_time),

      // send_time: res.expire_time ? moment(res.send_time):null,
    })
    judgePeople({
      member: transformedArray(res.recipient_users),

      isEmail: res.send_email,
    })
    judge(res.send_time)
  }

  useEffect(() => {
    if (props.editId && props.isVisible) {
      getEditData()
    }
    return () => {
      form.resetFields()
    }
  }, [props.editId, props.isVisible])

  return (
    <CommonModal
      onSaveDraft={onSaveDraft}
      draft
      isVisible={props.isVisible}
      width={784}
      title="发送通知"
      onClose={props.onClose}
      onConfirm={onHandleOk}
    >
      <div
        style={{
          padding: '0 24px',
          position: 'relative',
          overflow: 'scroll',
          height: 'calc(100vh - 300px)',
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<LabelTitle>通知标题</LabelTitle>}
            name="title"
            rules={[{ required: true, message: '请输入标题!' }]}
          >
            <Input maxLength={20} placeholder="请输入通知标题最多20字" />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: '30px',
            }}
            label={<LabelTitle>通知内容</LabelTitle>}
            name="content"
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
                    请输入通知内容
                  </div>
                ),
                whitespace: true,
                validator: onValidator,
              },
            ]}
          >
            <Editor
              upload={uploadFile}
              getSuggestions={() => []}
              placeholder="请输入通知内容最多200字"
            />
          </Form.Item>

          <Form.Item
            initialValue={1}
            name="type"
            label={<LabelTitle>通知类型</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group>
              <Radio value={1}>日常通知</Radio>
              <Radio value={2}>系统通知</Radio>
              <Radio defaultChecked value={3}>
                重要通知
              </Radio>
              <Radio value={4}>活动通知</Radio>
              <Radio value={5}>放假通知</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="recipient2"
            label={<LabelTitle>接收对象</LabelTitle>}
            rules={[{ required: true, message: '请选择接收对象!' }]}
          >
            <AcceptorSelection />
          </Form.Item>

          <Form.Item
            initialValue={2}
            name="notice_style"
            label={<LabelTitle>提醒方式</LabelTitle>}
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
                  <Radio value={1}>弹窗提醒</Radio>
                  <img
                    style={{
                      width: '104px',
                    }}
                    src={type1}
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
                    顶部横幅
                  </Radio>
                  <img
                    style={{
                      width: '240px',
                    }}
                    src={type2}
                    alt=""
                  />
                </div>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={<LabelTitle>失效时间</LabelTitle>}
            name="expire_time"
            rules={[{ required: true, message: '请选择失效时间!' }]}
          >
            <DatePicker
              disabledDate={disabledDate}
              showTime
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <div>
            <Checkbox onChange={onChange}>定时发送</Checkbox>
            {taskTime ? (
              <Form.Item
                label={<LabelTitle></LabelTitle>}
                name="send_time"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  showTime
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            ) : null}
          </div>
        </Form>
      </div>
    </CommonModal>
  )
}

export default CreateNoteModal
