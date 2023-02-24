/* eslint-disable require-unicode-regexp */
/* eslint-disable react-hooks/rules-of-hooks */
import { uploadFileByTask } from '@/services/cos'
import { changeCreateVisible } from '@store/create-propject'
import { postCreate } from '@store/create-propject/thunks'
import { useDispatch, useSelector } from '@store/index'
import { Form, Input, Select, Tooltip, Upload } from 'antd'
import React, { ForwardedRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import MoreSelect from '../MoreSelect'
import ProjectCard from '../ProjectCard'
import ProjectCardShow from '../ProjectCardShow'
import {
  CoverArea,
  CoverAreaAdd,
  coverAreadelIcon,
  coverAreaIcon,
  CoverAreaImage,
  CoverAreaImageShade,
  CoverAreaImageWrap,
  CoverAreaWrap,
  Wrap,
} from './style'
import { makePy, mkRslt } from './tool'

export type IndexRef = {
  postValue(): Record<string, unknown>
}

const CreateAProjectForm = () => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [activeCover, setActiveCover] = useState<any>()
  const [myCover, setMyCover] = useState<string>('')
  const [lock, setLock] = useState(true)
  const covers = useSelector(state => state.cover.covers)
  const createVisible = useSelector(state => state.createProject.createVisible)
  const dispatch = useDispatch()

  const onCustomRequest = async (file: any) => {
    const data = await uploadFileByTask(file.file, '2', '2')

    setMyCover(data.url)
  }

  const onConfirm = () => {
    const obj = {
      cover: activeCover,
      ...form.getFieldsValue(),
    }

    dispatch(postCreate(obj))
  }

  function upper(str: string) {
    // eslint-disable-next-line prefer-regex-literals
    const pattern = new RegExp('[\u4E00-\u9FA5]+')
    const newStr = []
    for (const i of str.split('')) {
      if (pattern.test(i)) {
        newStr.push(makePy(i))
      } else {
        newStr.push(i.toLocaleUpperCase())
      }
    }
    return newStr.join('')
  }

  function transformStr(str: string) {
    // eslint-disable-next-line prefer-regex-literals
    const judgeFn = new RegExp(/\s+/g)
    const newStr = []
    if (judgeFn.test(str)) {
      for (const i of str.split(' ')) {
        newStr.push(i.substring(0, 1))
      }

      return upper(newStr.join(''))
    }
    return upper(str)
  }

  const onChange = (e: any) => {
    const textStr = e.target.value.trim()
    if (lock) {
      form.setFieldsValue({
        keyboard: transformStr(textStr),
      })
    }
  }
  return (
    <CommonModal
      onConfirm={onConfirm}
      onClose={() => dispatch(changeCreateVisible(false))}
      width={832}
      isVisible={createVisible}
      title="编辑项目"
    >
      <div
        style={{
          display: 'flex',
          padding: '0 16px 0 24px',
          maxHeight: 536,
          overflowY: 'auto',
        }}
      >
        <CoverAreaWrap>
          <FormTitleSmall text="选择封面" />
          <CoverArea>
            {covers?.map((i: any) => (
              <CoverAreaImageWrap
                onClick={() => setActiveCover(i.path)}
                key={i.id}
              >
                <CoverAreaImage src={i.path} />
                {activeCover === i.path && (
                  <IconFont className={coverAreaIcon} type="anglemark" />
                )}
              </CoverAreaImageWrap>
            ))}

            {myCover ? (
              <CoverAreaImageWrap onClick={() => setActiveCover(myCover)}>
                <CoverAreaImage src={myCover} />
                {myCover === activeCover && (
                  <IconFont className={coverAreaIcon} type="anglemark" />
                )}
                {myCover === activeCover && (
                  <CoverAreaImageShade onClick={() => setMyCover('')}>
                    <IconFont
                      className={coverAreadelIcon}
                      type="delete"
                      style={{
                        color: 'var(--neutral-white-d7)',
                      }}
                    />
                  </CoverAreaImageShade>
                )}
              </CoverAreaImageWrap>
            ) : (
              <Upload fileList={[]} customRequest={onCustomRequest}>
                <CoverAreaAdd>
                  <IconFont
                    style={{
                      fontSize: 18,
                    }}
                    type="plus"
                  />
                </CoverAreaAdd>
              </Upload>
            )}
          </CoverArea>
          <FormTitleSmall text="效果预览" />
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <ProjectCardShow img={activeCover} />
          </div>
        </CoverAreaWrap>
        <Wrap>
          <Form form={form} layout="vertical">
            <Form.Item
              label={<FormTitleSmall text="项目名称" />}
              name="name"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input onChange={onChange} />
            </Form.Item>

            <Form.Item
              label={<FormTitleSmall text="所属" />}
              name="their"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <MoreSelect
                type="project"
                options={['jack', 'lucy', '1', '2', '3', '4']}
              />
            </Form.Item>
            <Form.Item
              label={
                <div>
                  <FormTitleSmall text="键" />
                  <Tooltip
                    overlayStyle={{
                      fontSize: '12px',
                    }}
                    trigger={['click']}
                    placement="top"
                    title="键用以区分项目，作为需求编号前缀使用"
                  >
                    <IconFont
                      style={{
                        position: 'absolute',
                        left: '26px',
                        top: '5px',
                      }}
                      type="question"
                    />
                  </Tooltip>
                </div>
              }
              name="keyboard"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input onFocus={() => setLock(false)} placeholder="请输入键" />
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="项目负责人" />} name="user">
              <MoreSelect
                type="user"
                options={['jack', 'lucy', '1', '2', '3', '4']}
              />
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="权限" />} name="user">
              <MoreSelect
                type="promise"
                options={[
                  {
                    name: t('project.companyOpen'),
                    id: '1',
                    dec: '仅项目成员可查看编辑',
                  },
                  {
                    name: t('common.privateProject'),
                    id: '2',
                    dec: '企业内所有成员可见，仅项目成员可编辑',
                  },
                  {
                    name: '团队公开',
                    id: '3',
                    dec: '团队内所有成员可见，仅项目成员可编辑',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="项目分组" />} name="their">
              <Select placeholder="Select a option " allowClear>
                <Select.Option value="male">male</Select.Option>
                <Select.Option value="female">female</Select.Option>
                <Select.Option value="other">other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="项目描述" />} name="dec">
              <Input.TextArea
                placeholder="请输入项目描述"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </Wrap>
      </div>
    </CommonModal>
  )
}

export default CreateAProjectForm
