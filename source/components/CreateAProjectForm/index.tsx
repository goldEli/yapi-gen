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
  getProjectInfoOnly,
} from '@/services/project'
import {
  changeCreateVisible,
  editProject,
  setIsUpdateProject,
} from '@store/create-propject'
import { postCreate, postEditCreate } from '@store/create-propject/thunks'
import { useDispatch, useSelector } from '@store/index'
import { DatePicker, Form, Input, Select, Tooltip, Upload } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomSelect from '../CustomSelect'
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
  FormFooter,
  Wrap,
} from './style'
import { makePy } from './tool'
import CommonModal2 from '../CommonModal2'
import styled from '@emotion/styled'
import ProjectType from '../ProjectType/ProjectType'
import ProjectTemplate from '../ProjectTemplate/ProjectTemplate'
import ProjectChooseSide from '../ProjectChooseSide/ProjectChooseSide'
import {
  RowStyle,
  StyleLeft,
  StyleRight,
} from '@/views/Layout/Report/Formwork/RightWrap'
import { getProjectInfoStore } from '@store/project/project.thunk'
import CommonButton from '../CommonButton'
import moment from 'moment'
import { getMessage } from '../Message'
export type IndexRef = {
  postValue(): Record<string, unknown>
}
export const Col = styled.div<{ tap: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 200px;
  height: 32px;
  display: flex;
  &:hover {
    cursor: ${props => (props.tap ? 'pointer' : 'not-allowed')};
  }
`
const Text = styled.div<{ bgc: any }>(
  {
    padding: '0 24px 0 0',
    minWidth: '99px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  ({ bgc }) => ({
    backgroundColor: bgc ? 'var(--function-tag5)' : 'var(--neutral-n8)',
    color: bgc ? 'var(--primary-d1)' : 'var(--neutral-n2)',
    fontFamily: bgc ? 'SiYuanMedium' : 'inherit',
  }),
)
const OpacityDiv = styled.div<{ op: boolean }>`
  z-index: ${props => (props.op ? '1' : '0')};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 0%);
  transition: all 0.8s;
  opacity: ${props => (props.op ? '1' : '0')};
  pointer-events: ${props => (props.op ? '' : 'none')};
`

const CreateAProjectForm = () => {
  const covers = useSelector(state => state.cover.covers)
  const [t] = useTranslation()
  const types = [
    t('select_project_type'),

    t('iteration_project'),
    t('sprint_project'),
  ]
  const models = [
    t('select_project_template'),
    t('software_development'),
    t('game_design'),
    t('import_project'),
  ]
  const [form] = Form.useForm()
  const [activeCover, setActiveCover] = useState<any>('')
  const [myCover, setMyCover] = useState<string>('')
  const [leaderId, setLeaderId] = useState<any>(0)
  const [lock, setLock] = useState(true)
  const [canChooseLeader, setCanChooseLeader] = useState(true)
  const { createVisible, isEditId, groupId, isUpdateProject } = useSelector(
    state => state.createProject,
  )
  const [selectLeaders, setSelectLeaders] = useState<any>([])
  const [affiliations, setAffiliations] = useState<any>([])
  const [pros, setPros] = useState<any>([])
  const [names, setNames] = useState<any>()
  const [pey, setPey] = useState<any>()
  const [user, setUser] = useState<any>()
  const dispatch = useDispatch()
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [type, setType] = useState(0)
  const [model, setModel] = useState<any>(0)
  const [multipleSelectionItems, setMultipleSelectionItems] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState({})
  const { isRefresh } = useSelector(state => state.user)
  const onCustomRequest = async (file: any) => {
    const data = await uploadFileByTask(file.file, '2')
    setMyCover(data.url)
    setActiveCover(data.url)
  }

  const confirm = async () => {
    const formData = await form.validateFields()
    if (
      formData?.expected_start_at &&
      formData?.expected_end_at &&
      moment(formData?.expected_start_at || '').unix() >
        moment(formData?.expected_end_at || '').unix()
    ) {
      getMessage({
        msg: t('version2.startTimeComputedEndTime'),
        type: 'warning',
      })
      return
    }

    const obj = {
      clone_project_id: multipleSelectionItems[0],
      model_type: model,
      project_type: type,
      cover: activeCover,
      ...formData,
      expected_start_at: formData?.expected_start_at
        ? moment(formData?.expected_start_at).format('YYYY-MM-DD')
        : '',
      expected_end_at: formData?.expected_end_at
        ? moment(formData?.expected_end_at).format('YYYY-MM-DD')
        : '',
    }
    if (isEditId) {
      await dispatch(postEditCreate({ ...projectInfo, ...obj, id: isEditId }))
      setProjectInfo({ ...projectInfo, ...obj, id: isEditId })
      dispatch(getProjectInfoStore({ projectId: isEditId }))
      setLeaderId(0)
      return
    }

    dispatch(postCreate(obj))
    setLeaderId(0)
  }
  const onConfirm = async () => {
    form.submit()
    await confirm()
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
    // 获取所属
    const result2 = await getAffiliation()

    setAffiliations(
      result2.map((i: any) => ({
        name: `${
          i.team_id === 0
            ? t('enterprise_project2')
            : t('demandSettingSide.teamProject')
        }/${i.name}`,
        id: i.team_id,
        img: i.logo,
      })),
    )
    form.setFieldsValue({
      team_id: 0,
      groups: groupId ? [groupId] : undefined,
      isPublic: 2,
    })
  }

  //编辑项目逻辑
  const getProjectInfo = async () => {
    const res = await getProjectInfoOnly(isEditId || multipleSelectionItems[0])
    setProjectInfo(res)
    const res2 = await getAffiliationUser(res.team_id)

    setSelectLeaders(
      res2.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
    setActiveCover(res.cover)
    // setMyCover(res.cover)
    form.setFieldsValue({
      name: res.name,
      team_id: res.team_id,
      prefix: res.prefix,
      // eslint-disable-next-line no-undefined
      leader_id: res.leader_id || undefined,
      isPublic: res.is_public,
      groups: res.groups.map((i: any) => i.id),
      info: res.info,
      expected_start_at: res.expected_start_at
        ? moment(res.expected_start_at)
        : '',
      expected_end_at: res.expected_end_at ? moment(res.expected_end_at) : '',
    })
    setLeaderId(res.team_id)
    setCanChooseLeader(false)
  }
  const getProjectInfo2 = async () => {
    const res = await getProjectInfoOnly(isEditId || multipleSelectionItems[0])
    const res2 = await getAffiliationUser(res.team_id)
    setSelectLeaders(
      res2.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
    setActiveCover(res.cover)
    // setMyCover(res.cover)
    form.setFieldsValue({
      team_id: res.team_id,
    })
    setLeaderId(res.team_id)
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
    }
  }, [leaderId, isRefresh])

  useEffect(() => {
    if (multipleSelectionItems.length === 1) {
      getProjectInfo2()
    }
  }, [multipleSelectionItems])

  useEffect(() => {
    if (createVisible) {
      getGroupData()
      setActiveCover(covers[0]?.path)
      form.setFieldsValue({
        isPublic: 2,
      })
      if (isEditId) {
        setStep(3)
        setType(0)
        setModel(0)
        getProjectInfo()
      } else {
        setStep(1)
      }
    }

    form.resetFields()

    setLock(true)

    setMyCover('')
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [createVisible])
  const onChangeStep = (val: number) => {
    if (step === val) {
      return
    }
    setStep(val)
  }
  const choose = (type: any) => {
    setType(type)
    onChangeStep(2)
  }
  const chooseModel = (type: any) => {
    setModel(type)
    // setMultipleSelectionItems(undefined)
    onChangeStep(3)
  }
  const getIdS = (ids: any) => {
    setMultipleSelectionItems(ids)
    setModel(undefined)
  }

  useEffect(() => {
    if (model !== 3) {
      setMultipleSelectionItems([])
    }

    form.resetFields()
  }, [model])

  const onTapModel = () => {
    if (type) {
      onChangeStep(2)
      setModel(0)
    }
  }

  return (
    <CommonModal2
      noFooter
      bodyStyle={{
        height: '100vh',
        minWidth: '1400px',
        paddingLeft: '70px',
      }}
      width="100vw"
      dex={50}
      isShowMask={false}
      isVisible={createVisible}
      onClose={() => {
        dispatch(changeCreateVisible(false))
        dispatch(editProject({ visible: false, id: '' }))
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          position: 'relative',
          overflow: 'scroll',
        }}
      >
        <ProjectChooseSide
          cloneIds={multipleSelectionItems}
          op={step === 3 && model === 3}
          onClose={() => onChangeStep(2)}
        />

        {/* 右边 */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '42px',
          }}
        >
          <div
            style={{
              marginBottom: '48px',
            }}
          >
            <RowStyle>
              <Col
                tap={!isEditId}
                onClick={() => {
                  isEditId ? null : onChangeStep(1)
                  setType(0)
                  setModel(0)
                }}
              >
                <StyleLeft bgc={step >= 1} />
                <Text bgc={step >= 1}>{types[type]}</Text>
                <StyleRight bgc={step >= 1} />
              </Col>
              <Col
                tap={!!type}
                style={{ transform: 'translate(-20px, 0px)' }}
                onClick={onTapModel}
              >
                <StyleLeft bgc={step >= 2} />
                <Text bgc={step >= 2}>{models[model]}</Text>
                <StyleRight bgc={step >= 2} />
              </Col>
              <Col
                tap={!!model}
                style={{ transform: 'translate(-40px, 0px)' }}
                onClick={() => model && onChangeStep(3)}
              >
                <StyleLeft bgc={step >= 3} />
                <Text bgc={step >= 3}>{t('fill_in_project_information')}</Text>
                <StyleRight bgc={step >= 3} />
              </Col>
            </RowStyle>
          </div>
          <div
            style={{
              position: 'relative',
            }}
          >
            <OpacityDiv op={step === 1}>
              <div>
                <ProjectType type={type} choose={choose} />
              </div>
            </OpacityDiv>
            <OpacityDiv op={step === 2}>
              <ProjectTemplate
                searchId={type}
                getIdS={getIdS}
                choose={chooseModel}
              />
            </OpacityDiv>
            <OpacityDiv
              op={step === 3}
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
                    <CoverAreaImageWrap>
                      <CoverAreaImage src={myCover} />
                      {myCover === activeCover && (
                        <IconFont className={coverAreaIcon} type="anglemark" />
                      )}
                      {myCover === activeCover && (
                        <CoverAreaImageShade
                          onClick={() => {
                            setMyCover('')
                            setActiveCover(covers[0]?.path)
                          }}
                        >
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
                            fontSize: 24,
                            color: 'var(--neutral-n2)',
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
                <Form
                  onFinish={confirm}
                  form={form}
                  layout="vertical"
                  onFinishFailed={() => {
                    setTimeout(() => {
                      const errorList = (document as any).querySelectorAll(
                        '.ant-form-item-has-error',
                      )

                      errorList[0]?.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth',
                      })
                    }, 100)
                  }}
                >
                  <Form.Item
                    label={<FormTitleSmall text={t('project_name')} />}
                    name="name"
                    rules={[{ required: true, message: '' }]}
                  >
                    <Input
                      ref={inputRefDom as any}
                      maxLength={30}
                      placeholder={t('please_enter_a_project_name')}
                      onChange={onChange}
                      allowClear
                      autoFocus
                      autoComplete="off"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FormTitleSmall text={t('affiliated')} />}
                    name="team_id"
                    rules={[{ required: true, message: '' }]}
                  >
                    <CustomSelect
                      disabled={
                        !!isEditId || multipleSelectionItems.length >= 1
                      }
                      placeholder={t('please_select_your_affiliation')}
                      onChange={(value: any) => {
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
                              img={
                                i.img?.length > 0
                                  ? i.img
                                  : 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/normalCompany.jpg'
                              }
                            />
                          </Select.Option>
                        )
                      })}
                    </CustomSelect>
                  </Form.Item>
                  <Form.Item
                    label={
                      <div>
                        <FormTitleSmall text={t('serialNumber')} />
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
                              left: '36px',
                              top: '4px',
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
                    <CustomSelect
                      optionFilterProp="label"
                      onChange={(e: any) => {
                        const obj = selectLeaders.find((i: any) => i.id === e)

                        setUser(obj.name)
                      }}
                      showSearch
                      // disabled={canChooseLeader}
                      placeholder={t('please_select_project_leader')}
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
                    </CustomSelect>
                  </Form.Item>
                  <Form.Item
                    rules={[{ required: true, message: '' }]}
                    label={<FormTitleSmall text={t('Permission')} />}
                    name="isPublic"
                    initialValue={2}
                  >
                    <CustomSelect
                      // disabled={canChooseLeader}
                      placeholder={t('please_select_permissions')}
                      optionLabelProp="label"
                    >
                      {pros.map((i: any) => (
                        <Select.Option value={i.id} key={i.id} label={i.name}>
                          <MoreOptions
                            type="promise"
                            name={i.name}
                            dec={i.dec}
                          />
                        </Select.Option>
                      ))}
                    </CustomSelect>
                  </Form.Item>

                  <Form.Item
                    label={<FormTitleSmall text={t('estimatedStartTime')} />}
                    name="expected_start_at"
                  >
                    <DatePicker
                      getPopupContainer={node => node}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<FormTitleSmall text={t('estimatedEndTime')} />}
                    name="expected_end_at"
                  >
                    <DatePicker
                      getPopupContainer={node => node}
                      style={{ width: '100%' }}
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
              {step === 3 && (
                <FormFooter>
                  <CommonButton
                    type="light"
                    onClick={() => {
                      dispatch(changeCreateVisible(false))
                      dispatch(editProject({ visible: false, id: '' }))
                    }}
                  >
                    {t('common.cancel')}
                  </CommonButton>
                  <CommonButton type="primary" onClick={onConfirm}>
                    {t('common.confirm')}
                  </CommonButton>
                </FormFooter>
              )}
            </OpacityDiv>
          </div>
        </div>
      </div>
    </CommonModal2>
  )
}

export default CreateAProjectForm
