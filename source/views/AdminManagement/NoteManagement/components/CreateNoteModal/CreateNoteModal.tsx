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
import CommonModal2 from '@/components/AddUser/CommonModal'
import CommonModal from '@/components/CommonModal'
import { seleData1 } from '@/views/WorkReport/Formwork/DataList'
import {
  Col,
  DefalutIcon,
  NameText,
  PersonContainer,
} from '@/views/WorkReport/Formwork/Addperson'
import CommonUserAvatar from '@/components/CommonUserAvatar'
interface Item {
  label: string
  key: string
}
const CreateNoteModal = (props: any) => {
  const [form] = Form.useForm()
  const [isOpen, setIsOpen] = useState(false)
  const [t] = useTranslation()
  const [items, setItems] = useState<Array<Item>>([
    {
      key: 'all',
      label: t('formWork.all'),
    },
    {
      key: 'user',
      label: t('formWork.addUser'),
    },
    {
      key: 'department',
      label: t('formWork.addbm'),
    },
    {
      key: 'team',
      label: t('formWork.addtd'),
    },
  ])
  const [personData, setPersonData] = useState<any>()
  const [isVisible, setIsVisible] = useState(false)
  const [taskTime, setTaskTime] = useState(false)
  const [isEmail, setIsEmail] = useState(false)
  const [targetType, setTargetType] = useState<number>(0)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [userType, setUserType] = useState<number>(0)
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
  const onChange2 = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
    setIsEmail(e.target.checked)
  }
  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.target_id] ? '' : (obj[next.target_id] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  const onConfirm = (data: any) => {
    const setData = data.map((el: any) => ({
      ...el,
      user_type: userType,
      target_type: targetType,
      target_value: { name: el.name, avatar: el.avatar },
    }))
    console.log(setData, '成员')
    setPersonData(setData)
    setIsVisible(false)
  }

  // 添加团队部门
  const onAddConfirm = (data: any) => {
    const values = data.map((item: any) => ({
      ...item,
      user_type: userType,
      target_type: item.type === 3 ? 3 : 2,
      target_value: {
        name: item.name,
        avatar: item.type === 1 ? 2 : item.type,
      },
    }))
    console.log(values, '部门')
    setPersonData(values)
  }
  const getName = (key: string, type: string) => {
    switch (key) {
      case 'obj':
        return type === 'id' ? 1 : t('formWork.reportTo')
      case 'departmentHead':
        return type === 'id' ? 2 : t('formWork.director')
      case 'teamManagement':
        return type === 'id' ? 3 : t('formWork.team')
      case 'reportsTo':
        return type === 'id' ? 4 : t('formWork.reportsTo')
      case 'allSuperiors':
        return type === 'id' ? 5 : t('formWork.allSup')
      case 'all':
        return t('formWork.whole')
    }
  }
  const getImg = (item: any) => {
    if (
      item.target_value?.avatar &&
      item.target_type !== 3 &&
      item.target_type !== 2 &&
      item.target_type !== 4
    ) {
      return <img src={item?.target_value?.avatar} />
    } else if (item.target_value?.avatar === 3 || item.target_type === 3) {
      return (
        <DefalutIcon bgc="rgba(152, 172, 224, 1)">
          <CommonIconFont
            type="team-2"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else if (item.target_value?.target_type === 2 || item.target_type === 2) {
      return (
        <DefalutIcon bgc="rgba(121, 209, 193, 1)">
          <CommonIconFont
            type="branch"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else if (item.target_value?.key === 'all' || item?.target_type === 4) {
      return (
        <DefalutIcon bgc="rgba(125, 189, 225, 1)">
          <CommonIconFont
            type="userAll"
            size={16}
            color="var(--neutral-white-d7)"
          />
        </DefalutIcon>
      )
    } else {
      return <CommonUserAvatar />
    }
  }
  const onOpenChange = (e: { key: string }) => {
    setIsOpen(false)
    setIsVisible(e.key === 'user')
    setIsAddVisible(['department', 'team'].includes(e.key))
    setUserType(props.state)
    switch (e.key) {
      case 'user':
        setTargetType(1)
        break
      case 'department':
        setTargetType(2)
        break
      case 'team':
        setTargetType(3)
        break
      case 'all':
        const data = [
          {
            user_type: props.state,
            key: 'all',
            id: -props.state,
            target_id: -props.state,
            name: getName(e.key, ''),
            avatar: '',
            target_value: {
              user_type: props.state,
              key: 'all',
              name: getName(e.key, ''),
              avatar: '',
            },
          },
        ]
        setPersonData(data)
        break
      default:
        const data1 = [
          {
            user_type: props.state,
            key: e.key,
            target_type: 4,
            name: getName(e.key, ''),
            avatar: '',
            target_id: getName(e.key, 'id'),
            target_value: {
              user_type: props.state,
              key: e.key,
              target_type: 4,
              name: getName(e.key, ''),
              avatar: '',
            },
          },
        ]
        setPersonData(data1)
        setTargetType(4)
        break
    }
  }
  const delPerson = (el: { target_id: any }) => {
    props.onChangedel(el)
  }
  const onHandleOk = () => {
    console.log(form.getFieldsValue())
    console.log(personData)
  }
  return (
    <CommonModal
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
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
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
                    味甜希仁
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
            initialValue="a"
            name="radio-group"
            label={<LabelTitle>通知类型</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group>
              <Radio value="a">日常通知</Radio>
              <Radio value="b">系统通知</Radio>
              <Radio defaultChecked value="c">
                重要通知
              </Radio>
              <Radio value="d">活动通知</Radio>
              <Radio value="e">放假通知</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={<LabelTitle>接收对象</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '-30px', left: '80px' }}>
                <Checkbox onChange={onChange2}>
                  <span
                    style={{
                      height: '20px',
                      fontSize: '12px',
                      verticalAlign: 'text-bottom',
                      color: '#646566',
                      lineHeight: '20px',
                    }}
                  >
                    同时邮件通知
                  </span>{' '}
                </Checkbox>
              </div>
              <div>
                <Dropdown
                  placement="bottomLeft"
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  trigger={['click']}
                  menu={{ items, onClick: onOpenChange }}
                  overlayStyle={{
                    width: 120,
                    background: 'var(--neutral-white-d1)',
                  }}
                >
                  <CommonButton
                    type="primaryText"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {t('formWork.add')}
                    <CommonIconFont
                      type={isOpen ? 'up' : 'down'}
                      size={14}
                      color="var(--primary-d2)"
                    />
                  </CommonButton>
                </Dropdown>
                <PersonContainer
                  style={{
                    padding: '0px',
                    marginTop: '8px',
                  }}
                >
                  {personData?.map((el: any) => (
                    <Col key={el.id}>
                      {getImg(el)}
                      <NameText>{el?.target_value?.name}</NameText>
                      <CommonIconFont
                        onClick={() => delPerson(el)}
                        type="close"
                        size={14}
                        color="var(--neutral-n3)"
                      />
                    </Col>
                  ))}
                </PersonContainer>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            initialValue="b"
            name="type"
            label={<LabelTitle>提醒方式</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group value="a">
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
                  <Radio value="a">弹窗提醒</Radio>
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
                  <Radio defaultChecked value="b">
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
            name="expirationTime"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <DatePicker
              showTime
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Form>
        <div>
          <Checkbox onChange={onChange}>定时发送</Checkbox>
          {taskTime && (
            <div
              style={{
                marginTop: '8px',
              }}
            >
              <DatePicker
                showTime
                style={{
                  width: '100%',
                }}
              />
            </div>
          )}
        </div>

        {isVisible && (
          <CommonModal2
            title={t('formWork.addUser')}
            state={2}
            isVisible={isVisible}
            onConfirm={onConfirm}
            onClose={() => setIsVisible(false)}
          />
        )}
        <AddDepartmentOrTeamModal
          isVisible={isAddVisible}
          onClose={() => setIsAddVisible(false)}
          type={targetType === 2 ? 4 : 3}
          onConfirm={onAddConfirm}
        />
      </div>
    </CommonModal>
  )
}

export default CreateNoteModal
