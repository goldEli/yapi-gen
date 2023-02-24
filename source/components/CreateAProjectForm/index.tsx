/* eslint-disable no-constant-binary-expression */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react-hooks/rules-of-hooks */
import { uploadFileByTask } from '@/services/cos'
import {
  getAffiliation,
  getAffiliationUser,
  getGroupList,
} from '@/services/project'
import { changeCreateVisible } from '@store/create-propject'
import { postCreate } from '@store/create-propject/thunks'
import { useDispatch, useSelector } from '@store/index'
import { Form, Input, Select, Tooltip, Upload } from 'antd'
import { type } from 'os'
import React, { ForwardedRef, useEffect, useMemo, useState } from 'react'
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
  const [leaderId, setLeaderId] = useState<any>('')
  const [lock, setLock] = useState(true)
  const [canChooseLeader, setCanChooseLeader] = useState(true)
  const covers = useSelector(state => state.cover.covers)
  const createVisible = useSelector(state => state.createProject.createVisible)
  const [selectGroupList, setSelectGroupList] = useState<any>([])
  const [selectLeaders, setSelectLeaders] = useState<any>([])
  const [affiliations, setAffiliations] = useState<any>([])
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
        prefix: transformStr(textStr),
      })
    }
  }

  const getGroupData = async () => {
    const result = await getGroupList()
    setSelectGroupList(
      result?.list?.map((i: any) => ({ label: i.name, value: i.id })),
    )
    const result2 = await getAffiliation()

    setAffiliations(
      result2.map((i: any) => ({
        name: `${i.team_id === 0 ? '企业项目' : '团队项目'}/${i.name}`,
        id: i.team_id,
      })),
    )
  }

  const getLeader = async () => {
    const res = await getAffiliationUser(leaderId)
    setSelectLeaders(
      res.map((i: any) => ({
        name: i.name,
        id: i.id,
      })),
    )
  }

  const onFormLayoutChange = ({ team_id }: { team_id: any }) => {
    setLeaderId(team_id)
  }

  const keyChange = (e: any) => {
    if (!e.target.value) {
      setLock(true)
    }
  }
  useEffect(() => {
    if (!canChooseLeader) {
      if (!Array.isArray(leaderId)) {
        getLeader()
      }
    }
  }, [canChooseLeader, leaderId])

  useEffect(() => {
    if (createVisible) {
      getGroupData()
    }
  }, [createVisible])
  useEffect(() => {
    if (leaderId || leaderId === 0) {
      setCanChooseLeader(false)
    }
  }, [leaderId])

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
          <Form
            form={form}
            layout="vertical"
            onValuesChange={onFormLayoutChange}
            disabled={false}
          >
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
              name="team_id"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <MoreSelect mode={false} type="project" options={affiliations} />
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
              name="prefix"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                onFocus={() => setLock(false)}
                onChange={keyChange}
                placeholder="请输入键"
              />
            </Form.Item>
            <Form.Item
              label={<FormTitleSmall text="项目负责人" />}
              name="leader_id"
            >
              <MoreSelect type="user" options={selectLeaders} />
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="权限" />} name="isPublic">
              <MoreSelect
                disabled={canChooseLeader}
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
            <Form.Item
              label={<FormTitleSmall text={t('version2.projectGroup')} />}
              name="groups"
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                mode="multiple"
                options={selectGroupList}
                showArrow
                showSearch
                allowClear
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item label={<FormTitleSmall text="项目描述" />} name="info">
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
