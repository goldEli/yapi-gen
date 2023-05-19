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
import { Checkbox, Dropdown, Form, Input, Radio } from 'antd'

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

  const [isVisible, setIsVisible] = useState(false)
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
  }

  const onConfirm = (data: any) => {
    const setData = data.map((el: any) => ({
      ...el,
      user_type: userType,
      target_type: targetType,
      target_value: { name: el.name, avatar: el.avatar },
    }))

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
        props.onChangeValues(data)
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
        props.onChangeValues(data1)
        setTargetType(4)
        break
    }
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      width={784}
      title="发送通知"
      onClose={props.onClose}
      onConfirm={props.onHandleOk}
    >
      <div
        style={{
          padding: '0 24px',
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
            name="radio-group"
            label={<LabelTitle>通知类型</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Radio.Group>
              <Radio value="a">item 1</Radio>
              <Radio value="b">item 2</Radio>
              <Radio defaultChecked value="c">
                item 3
              </Radio>
              <Radio value="d">item 2</Radio>
              <Radio value="e">item 3</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            style={{
              position: 'relative',
            }}
            name="radio-group1"
            label={<LabelTitle>接收对象</LabelTitle>}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: '-35px', left: '80px' }}>
                <Checkbox onChange={onChange}>同时邮件通知</Checkbox>
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
              </div>
            </div>
          </Form.Item>

          <Form.Item
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
                  <Radio value="a">item 1</Radio>
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
                    item 1
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
        </Form>
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
