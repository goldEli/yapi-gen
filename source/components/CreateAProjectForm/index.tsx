/* eslint-disable no-undefined */
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
  getProjectInfoOnly,
} from '@/services/project'
import {
  changeCreateVisible,
  editProject,
  onRest,
} from '@store/create-propject'
import { postCreate, postEditCreate } from '@store/create-propject/thunks'
import { useDispatch, useSelector } from '@store/index'
import { Form, Input, message, Select, Tooltip, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import MoreOptions from '../MoreOptions'
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
import { makePy } from './tool'

export type IndexRef = {
  postValue(): Record<string, unknown>
}

const CreateAProjectForm = () => {
  const covers = useSelector(state => state.cover.covers)
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [activeCover, setActiveCover] = useState<any>('')
  const [myCover, setMyCover] = useState<string>('')
  const [leaderId, setLeaderId] = useState<any>(0)
  const [lock, setLock] = useState(true)
  const [canChooseLeader, setCanChooseLeader] = useState(true)
  const { createVisible, isEditId } = useSelector(state => state.createProject)
  const [selectGroupList, setSelectGroupList] = useState<any>([])
  const [selectLeaders, setSelectLeaders] = useState<any>([])
  const [affiliations, setAffiliations] = useState<any>([])
  const [pros, setPros] = useState<any>([])
  const [names, setNames] = useState<any>()
  const [pey, setPey] = useState<any>()
  const [user, setUser] = useState<any>()
  const dispatch = useDispatch()

  const onCustomRequest = async (file: any) => {
    const data = await uploadFileByTask(file.file, '2', '2')

    setMyCover(data.url)
  }

  const onConfirm = async () => {
    const formData = await form.validateFields()

    const obj = {
      cover: activeCover,
      ...formData,
    }
    if (isEditId) {
      dispatch(postEditCreate({ ...obj, id: isEditId }))
      message.success(t('common.editSuccess'))

      return
    }
    dispatch(postCreate(obj))
    dispatch(editProject({ visible: false, id: '' }))
    message.success(t('common.createSuccess'))
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
    // eslint-disable-next-line no-undefined
    setNames(textStr === '' ? undefined : textStr)

    if (lock) {
      form.setFieldsValue({
        prefix:
          transformStr(textStr).length > 10
            ? transformStr(textStr).slice(0, 10)
            : transformStr(textStr),
      })
      // eslint-disable-next-line no-undefined
      setPey(
        transformStr(textStr) === ''
          ? // eslint-disable-next-line no-undefined
            undefined
          : transformStr(textStr).length > 10
          ? transformStr(textStr).slice(0, 10)
          : transformStr(textStr),
      )
    }
  }

  const getGroupData = async () => {
    // 获取项目分组
    const result = await getGroupList()
    setSelectGroupList(
      result?.list?.map((i: any) => ({ label: i.name, value: i.id })),
    )

    // 获取所属
    const result2 = await getAffiliation()

    setAffiliations(
      result2.map((i: any) => ({
        name: `${i.team_id === 0 ? t('enterprise_project') : t('teamwork')}/${
          i.name
        }`,
        id: i.team_id,
        img: i.logo,
      })),
    )
    form.setFieldsValue({
      team_id: 0,
    })
  }

  //编辑项目逻辑
  const getProjectInfo = async () => {
    const res = await getProjectInfoOnly(isEditId)
    const res2 = await getAffiliationUser(res.team_id)

    setSelectLeaders(
      res2.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
    setActiveCover(res.cover)
    setMyCover(res.cover)
    form.setFieldsValue({
      name: res.name,
      team_id: res.team_id,
      prefix: res.prefix,
      // eslint-disable-next-line no-undefined
      leader_id: res.leader_id || undefined,
      isPublic: res.is_public,
      groups: res.groups.map((i: any) => i.id),
      info: res.info,
    })
    setCanChooseLeader(false)
  }

  const getLeader = async () => {
    const res = await getAffiliationUser(leaderId)

    setSelectLeaders(
      res.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
  }
  const pro = [
    {
      name: t('project.companyOpen'),
      id: 1,
      dec: t(
        'all_members_in_the_enterprise_can_be_seen_only_project_members_can_edit',
      ),
    },
    {
      name: t('common.privateProject'),
      id: 2,
      dec: t('only_project_members_can_view_edits'),
    },
    {
      name: t('the_team_is_open'),
      id: 3,
      dec: t('all_team_members_are_visible_only_project_members_can_edit'),
    },
  ]
  useEffect(() => {
    if (leaderId === 0) {
      setPros(pro.slice(0, 2))
    } else {
      setPros(pro)
    }
    if (leaderId || leaderId === 0) {
      getLeader()
      setCanChooseLeader(false)
    }
  }, [leaderId])
  useEffect(() => {
    if (createVisible) {
      getGroupData()
      setActiveCover(covers[0]?.path)

      if (isEditId) {
        getProjectInfo()
      }
    }

    form.resetFields()

    setMyCover('')
  }, [createVisible])

  return (
    <CommonModal
      onConfirm={onConfirm}
      onClose={() => {
        dispatch(changeCreateVisible(false))
        dispatch(editProject({ visible: false, id: '' }))
      }}
      width={832}
      isVisible={createVisible}
      title={isEditId ? t('edit_item') : t('common.createProject')}
    >
      <div
        style={{
          display: 'flex',
          padding: '0 0px 0 24px',
        }}
      >
        <CoverAreaWrap>
          <FormTitleSmall text={t('choose_the_cover')} />
          <CoverArea>
            {covers?.map((i: any) => (
              <CoverAreaImageWrap
                color={i.remarks}
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
          <FormTitleSmall text={t('effect_preview')} />
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <ProjectCardShow
              names={names}
              prefix={pey}
              user={user}
              img={activeCover}
            />
          </div>
        </CoverAreaWrap>
        <Wrap>
          <Form form={form} layout="vertical">
            <Form.Item
              label={<FormTitleSmall text={t('project_name')} />}
              name="name"
              rules={[{ required: true, message: '' }]}
            >
              <Input
                maxLength={30}
                placeholder={t('please_enter_a_project_name')}
                onChange={onChange}
                allowClear
              />
            </Form.Item>

            <Form.Item
              label={<FormTitleSmall text={t('affiliated')} />}
              name="team_id"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('please_select_your_affiliation')}
                optionLabelProp="label"
                onChange={value => {
                  setLeaderId(value)
                  // eslint-disable-next-line no-undefined
                  form.setFieldsValue({
                    leader_id: undefined,
                    isPublic: undefined,
                  })
                }}
              >
                {affiliations.map((i: any) => {
                  return (
                    <Select.Option value={i.id} key={i.id} label={i.name}>
                      <MoreOptions
                        type="project"
                        name={i.name}
                        dec={i.dec}
                        img={i.img}
                      />
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label={
                <div>
                  <FormTitleSmall text={t('keyboard')} />
                  <Tooltip
                    overlayStyle={{
                      fontSize: '12px',
                    }}
                    trigger={['click']}
                    placement="top"
                    title={t(
                      'the_key_is_used_to_distinguish_items_and_is_used_as_a_requirement_number_prefix',
                    )}
                  >
                    <IconFont
                      style={{
                        position: 'absolute',
                        left: '26px',
                        top: '5px',
                        color: 'var(--neutral-n3)',
                      }}
                      type="question"
                    />
                  </Tooltip>
                </div>
              }
              name="prefix"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Input
                maxLength={10}
                onChange={e => !e.target.value && setLock(true)}
                onFocus={() => setLock(false)}
                placeholder={t('please_enter_the_key')}
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: '' }]}
              label={<FormTitleSmall text={t('project_leader')} />}
              name="leader_id"
            >
              <Select
                optionFilterProp="label"
                onChange={e => {
                  const obj = selectLeaders.find((i: any) => i.id === e)

                  setUser(obj.name)
                }}
                showSearch
                // disabled={canChooseLeader}
                placeholder={t('please_select_project_leader')}
                optionLabelProp="label"
              >
                {selectLeaders.map((i: any) => (
                  <Select.Option value={i.id} key={i.id} label={i.name}>
                    <MoreOptions
                      type="user"
                      name={i.name}
                      dec={i.dec}
                      img={i.img}
                    />
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={<FormTitleSmall text={t('Permission')} />}
              name="isPublic"
            >
              <Select
                // disabled={canChooseLeader}
                placeholder={t('please_select_permissions')}
                optionLabelProp="label"
              >
                {pros.map((i: any) => (
                  <Select.Option value={i.id} key={i.id} label={i.name}>
                    <MoreOptions type="promise" name={i.name} dec={i.dec} />
                  </Select.Option>
                ))}
              </Select>
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
            <Form.Item
              label={<FormTitleSmall text={t('project_description')} />}
              name="info"
            >
              <Input.TextArea
                placeholder={t('please_enter_project_description')}
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
