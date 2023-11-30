/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-empty */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import SideDragging from '../components/SideDragging'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import { Form, Input, message, Tooltip } from 'antd'
import { uploadFileByTask } from '@/services/cos'
import upload from 'antd/lib/upload'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import * as services from '@/services'
import { companyTeamsList } from '@store/teams/thunk'
import { addTeams, dismissTeams, editTeams } from '@/services/setting'
import { setActiveTeam } from '@store/teams/index'
import { getMessage } from '@/components/Message'
import CommonButton from '@/components/CommonButton'
import {
  SprintDetailDragLine,
  SprintDetailMouseDom,
} from '@/components/DetailScreenModal/DemandDetail/style'

const LeftSideContainer = styled.div`
  position: relative;
  height: 100%;

  padding: 0;
  background-color: var(--neutral-white-d1);
  .resize_save {
    width: 92%;
    position: absolute;
    padding: 0;
    top: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 16px;
  }
  .resizable {
    resize: horizontal;
    cursor: ew-resize;
    width: 199px;
    min-width: 215px;
    max-width: 543px;
    height: 100vh;
    overflow: scroll;
    border: 1px solid black;
    opacity: 0;
  }
  .resizable::-webkit-scrollbar {
    width: 220px;
    height: inherit;
  }
  /* 拖拽线 */
  .resize_line {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    border-left: 1px solid var(--neutral-n7);
  }
  .resizable:hover ~ .resize_line,
  .resizable:active ~ .resize_line {
    border-left: 1px solid var(--primary-d2);
  }
`
const TeamAdd = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  &:hover {
    cursor: pointer;
  }
`
const InputStyle = styled(Input)`
  width: 480px;
  height: 32px;
  background: var(--neutral-white-d4);
  /* border: 1px solid var(--neutral-n6-d1); */
  color: var(--neutral-n1-d1);
  input {
    background: var(--neutral-white-d4);
    color: var(--neutral-n1-d1);
  }
`
const FormStyle = styled(Form)`
  position: relative;
  height: 68px;
  & .ant-form-item {
    display: flex;
    flex-direction: column;
  }
  & .ant-form-item-row {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  & .ant-form-item-label {
    text-align: left;
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n1-d1);
    margin-bottom: 8px;
  }
  & .ant-form-item-label > label {
    color: var(--neutral-n1-d1);
  }
  & .ant-form-item-control-input {
    display: inline-block;
    height: 32px;
    max-height: 32px;
  }
  & .ant-form-item-control-input-content {
    background-color: var(--neutral-white-d5) !important;
  }
  .ant-input-affix-wrapper-status-error:not(
      .ant-input-affix-wrapper-disabled
    ):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper,
  .ant-input-affix-wrapper-status-error:not(
      .ant-input-affix-wrapper-disabled
    ):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:hover {
    background-color: var(--neutral-white-d5) !important;
  }
`
const Mask = styled.div`
  width: 80px;
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  background-color: rgba(0, 0, 0, 0.4);
  color: var(--neutral-white-d7);
  border-radius: 0 0px 6px 6px;
  position: absolute;
  bottom: 0;
`
const UploadStyle = styled(upload)`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  img {
    width: 80px;
    height: 80px;
    border-radius: 6px;
  }
  &:hover {
    cursor: pointer;
  }
  &:hover {
    cursor: pointer;
  }
`
const UploadBoxImg = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background-color: rgba(152, 172, 224, 1);
`
const UploadBox = styled.div`
  position: relative;
`
const UploadTitle = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  margin-bottom: 8px;
  margin-top: 24px;
`

const Content = styled.div`
  padding: 0 16px;
  height: 100%;
`

const Upload = (props: any) => {
  const [t] = useTranslation()
  const [defaultIcon, setDefaultIcon] = useState(true)
  const [uploadImg, setUploadImg] = useState('')
  const customRequest = async ({ file }: { file: any }) => {
    const fileType = file.type.toString()
    if (!fileType?.includes('image')) {
      getMessage({ msg: t('please_upload_a_picture'), type: 'warning' })
      return
    }
    const response = await uploadFileByTask(
      file,
      `richEditorFiles_${new Date().getTime()}`,
    )
    setDefaultIcon(false)
    setUploadImg(response.url)
    props.uploadImg(response)
  }
  useEffect(() => {
    if (props.fileList[0]?.url) {
      setDefaultIcon(false)
      setUploadImg(props.fileList[0]?.url)
      props.uploadImg(props.fileList[0])
    }
  }, [props.fileList])
  return (
    <>
      <UploadTitle>
        {t('team_logo')}
        <Tooltip
          placement="top"
          title={t('jpg_png_format_the_size_of_8080_pixels') as string}
        >
          <IconFont
            type="question"
            style={{
              fontSize: 16,
              color: 'var(--neutral-n4)',
              marginLeft: 9,
            }}
          />
        </Tooltip>
      </UploadTitle>
      <UploadStyle
        customRequest={customRequest}
        fileList={props.fileList || []}
        showUploadList={false}
      >
        {defaultIcon ? (
          <UploadBoxImg>
            <IconFont
              type="team-8a8gio2p"
              style={{ fontSize: 80, color: '#98ACE0' }}
            />
          </UploadBoxImg>
        ) : (
          <img src={uploadImg} />
        )}
        <Mask>{t('reupload')}</Mask>
      </UploadStyle>
    </>
  )
}

const LeftSide = (props: any) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { teamsList, activeTeam } = useSelector(s => s.teams)
  const [formType, setFormType] = useState('')
  const [uploadImgs, setUploadImgs] = useState<any>()
  const [leftWidth, setLeftWidth] = useState(200)
  // 创建和修改弹窗
  const [teamIsVisible, setTeamIsVisible] = useState(false)
  //  创建和修改弹窗的表单
  const [teamForm, setTeamForm] = useState<any>(null)
  // 删除团队弹窗
  const [delTeamIsVisible, setDelTeamIsVisible] = useState(false)
  const [form] = Form.useForm()
  const onInitCreateModel = () => {
    setUploadImgs(null)
    form.resetFields()
  }

  // 团队列表
  const getTeamsList = async () => {
    await dispatch(companyTeamsList())
  }
  useEffect(() => {
    getTeamsList()
  }, [])

  // 拖拽的宽高样式
  const childStyle = {
    minWidth: '200px',
    height: '44px',
    hoverColor: 'var(--hover-d2)',
    activeColor: 'var(--selected)',
    activeTextColor: 'var(--primary-d2)',
    textColor: 'var(--neutral-n1-d1)',
  }
  // 点击时间
  const onChangeDragging = async (data: any) => {
    const newList = teamsList.map((el: any) => ({
      ...el,
      active: el.id === data.id,
    }))
    dispatch({
      type: 'team/setTeamsList',
      payload: newList,
    })
    dispatch(setActiveTeam(data))
  }
  // 移动后的事件
  const onChangeMove = async (newList: any) => {
    try {
      await services.setting.moveTeamsList(newList.map((item: any) => item.id))
    } catch (error) {}
    dispatch({
      type: 'team/setTeamsList',
      payload: newList,
    })
  }
  const setList = (list: any[]) => {
    dispatch({
      type: 'team/setTeamsList',
      payload: list,
    })
  }
  const inputRef2 = useRef<any>(null)
  useEffect(() => {
    setTimeout(() => {
      inputRef2.current?.focus()
    }, 400)
    // inputRef.current.focus()
  }, [teamIsVisible])
  const teamGetForm = (row?: any) => {
    // const inputRef = useRef<any>()
    const pic = {
      uid: '001',
      name: '',
      url: row?.logo_info?.path,
    }

    // useEffect(() => {
    //   setTimeout(() => {
    //     inputRef.current?.focus()
    //   }, 100)
    // }, [])
    return (
      <div style={{ padding: '0 24px' }}>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <Form.Item
            label={t('team_name') as string}
            name="username"
            rules={[{ required: true, message: '' }]}
          >
            <InputStyle
              ref={inputRef2}
              placeholder={t('please_enter_a_team_name')}
              maxLength={20}
              allowClear
            />
          </Form.Item>
        </FormStyle>
        <UploadBox>
          <Upload
            uploadImg={(obj: any) => setUploadImgs(obj)}
            fileList={pic ? [pic] : []}
          />
        </UploadBox>
      </div>
    )
  }

  // 创建团队弹窗
  const createTeam = () => {
    setTeamIsVisible(true)
    setTeamForm(teamGetForm())
    setFormType('create')
  }

  // 编辑团队弹窗
  const editTeam = (row: any) => {
    setUploadImgs({
      uid: '001',
      name: '',
      url: row?.logo_info?.path || '',
    })
    setFormType('edit')
    setTeamIsVisible(true)
    form.setFieldsValue({
      username: row.name,
      id: row.id,
    })
    setTeamForm(teamGetForm(row))
  }

  // 弹窗确认按钮
  const onConfirm = async () => {
    const value = await form.validateFields()
    const name = value.username
    const logo = uploadImgs?.url
    props.isSpin(true)
    try {
      if (formType === 'create') {
        await addTeams({ name, logo })
        getMessage({ msg: t('common.createSuccess'), type: 'success' })
      } else {
        await editTeams(activeTeam?.id, { name, logo })
        getMessage({ msg: t('common.editSuccess'), type: 'success' })
      }
      props.isSpin(false)
      setTeamIsVisible(false)
      onInitCreateModel()
      getTeamsList()
    } catch (error) {
      props.isSpin(false)
    }
  }
  const delOnConfirm = async () => {
    try {
      await dismissTeams(activeTeam?.id)
      setDelTeamIsVisible(false)
      getTeamsList()
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    } catch (error) {}
  }
  const onChangeTeam = (key: any, child: any) => {
    key === 'del' ? setDelTeamIsVisible(true) : editTeam(child)
    dispatch({
      type: 'team/setActiveTeam',
      payload: child,
    })
  }
  const [focus, setFocus] = useState(false)
  const onDragLine = () => {
    document.onmousemove = e => {
      if (e.clientX < 400) {
        return
      }
      setFocus(true)

      setLeftWidth(e.clientX - 200)
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setFocus(false)
    }
  }

  return (
    <LeftSideContainer
      style={{
        position: 'relative',
        width: leftWidth,
      }}
    >
      <SprintDetailMouseDom
        active={focus}
        onMouseDown={onDragLine}
        style={{ right: 0 }}
      >
        <SprintDetailDragLine active={focus} className="line" />
      </SprintDetailMouseDom>
      <Content>
        <TeamAdd>
          <CommonButton
            type="primary"
            icon="plus"
            iconPlacement="left"
            onClick={() => createTeam()}
          >
            {t('set_up_a_team')}
          </CommonButton>
        </TeamAdd>

        {/* 拖拽组件 */}
        <SideDragging
          onChange={(item: any) => onChangeDragging(item)}
          list={teamsList}
          setList={setList}
          childStyle={childStyle}
          onChangeMove={onChangeMove}
          onChangeTeam={(key: string, child: any) => onChangeTeam(key, child)}
        />
        <CommonModal
          title={
            formType === 'create' ? t('set_up_a_team') : t('editorial_team')
          }
          isVisible={teamIsVisible}
          children={teamForm}
          onConfirm={() => onConfirm()}
          onClose={() => setTeamIsVisible(false)}
        />
        <DeleteConfirm
          title={`${t('confirmation_of_dissolution')}【${activeTeam?.name}】${t(
            'commonModal.labelTitle',
          )}`}
          text={t(
            'after_dissolution_the_team_members_are_automatically_removed_and_the_team_project_is_automatically_incorporated_and_its_rights_are_changed_to_private',
          )}
          isVisible={delTeamIsVisible}
          onConfirm={() => {
            delOnConfirm()
          }}
          onChangeVisible={() => setDelTeamIsVisible(false)}
        />
      </Content>
    </LeftSideContainer>
  )
}

export default LeftSide
