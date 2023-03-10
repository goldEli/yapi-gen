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

const LeftSideContainer = styled.div`
  position: relative;
  height: 100%;
  border-right: 1px solid var(--neutral-n6-d2);
  padding: 0;
  padding-left: 16px;
  background-color: var(--neutral-white-d1);
  .resize_save {
    position: absolute;
    padding: 0;
    top: 0;
    left: 0;
    padding-left: 16px;
    padding-right: 12px;
    overflow-y: auto;
    overflow-x: hidden;
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
    width: 180px;
    height: inherit;
  }
  /* 拖拽线 */
  .resize_line {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    border-left: 1px solid #f2f4f7;
  }
  .resizable:hover ~ .resize_line,
  .resizable:active ~ .resize_line {
    border-left: 1px solid #617ef2;
  }
`
const TeamAdd = styled.div`
  width: 100%;
  padding: 0 16px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
  }
`
const TiamTitleText = styled.span`
  font-size: var(--font14);
  font-weight: 500;
  color: var(--neutral-n1-d1);
`
const IconFontStyle = styled(IconFont)`
  font-size: 18px;
  color: var(--neutral-n2);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: var(--hover-d1);
  }
`
const InputStyle = styled(Input)`
  width: 480px;
  height: 32px;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
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
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper,
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:hover {
    background-color: var(--neutral-white-d5) !important;
  }
`
const Mask = styled.div`
  width: 80px;
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  background-color: var(--neutral-transparent-n1-d1);
  color: var(--neutral-white-d7);
  border-radius: 0 0px 14px 14px;
  position: absolute;
  bottom: 0;
`
const UploadStyle = styled(upload)`
  width: 80px;
  height: 80px;
  border-radius: 14px;
  img {
    width: 80px;
    height: 80px;
    border-radius: 14px;
  }
  &:hover {
    cursor: pointer;
  }
  &:hover {
    cursor: pointer;
  }
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

const Content = styled.div``

const Upload = (props: any) => {
  const [defaultIcon, setDefaultIcon] = useState(true)
  const [uploadImg, setUploadImg] = useState('')
  const customRequest = async ({ file }: { file: any }) => {
    if (file.type !== 'image/png') {
      message.warning('请上传图片')
      return
    }
    const response = await uploadFileByTask(
      file,
      file.name,
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
        团队LOGO
        <Tooltip placement="top" title="支持jpg、png格式，大小80*80像素">
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
          <IconFont
            type="team-8a8gio2p"
            style={{ fontSize: 80, color: '#98ACE0' }}
          />
        ) : (
          <img src={uploadImg} />
        )}
        <Mask>重新上传</Mask>
      </UploadStyle>
    </>
  )
}

import { companyTeamsList, getMemberList } from '@store/teams/thunk'
import { addTeams, dismissTeams, editTeams } from '@/services/setting'
import { Series } from 'highcharts'

const LeftSide = (props: any) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { teamsList, activeTeam } = useSelector(s => s.teams)
  const [formType, setFormType] = useState('')
  const [uploadImgs, setUploadImgs] = useState<any>()
  // 创建和修改弹窗
  const [teamIsVisible, setTeamIsVisible] = useState(false)
  //  创建和修改弹窗的表单
  const [teamForm, setTeamForm] = useState<any>(null)
  // 删除团队弹窗
  const [delTeamIsVisible, setDelTeamIsVisible] = useState(false)
  const [activeChild, setActiveChild] = useState<any>(null)
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
    activeColor: 'var(--gradient-left)',
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
    dispatch({
      type: 'team/setActiveTeam',
      payload: newList,
    })
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
    dispatch({
      type: 'team/setActiveTeam',
      payload: newList,
    })
  }
  const setList = (list: any[]) => {
    dispatch({
      type: 'team/setTeamsList',
      payload: list,
    })
  }

  const teamGetForm = (row?: any) => {
    const pic = {
      uid: '001',
      name: '',
      url: row?.logo_info.path,
    }
    return (
      <div style={{ padding: '0 24px' }}>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <Form.Item
            label="团队名称"
            name="username"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <InputStyle
              placeholder="请输入团队名称"
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
      url: row?.logo_info.path,
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
        message.success('创建成功')
      } else {
        await editTeams(activeTeam?.id, { name, logo })
        message.success('编辑成功')
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
      await dismissTeams(activeChild?.id)
      setDelTeamIsVisible(false)
      getTeamsList()
      message.success('删除成功')
    } catch (error) {}
  }
  const onChangeTeam = (key: any, child: any) => {
    setActiveChild(child)
    key === 'del' ? setDelTeamIsVisible(true) : editTeam(child)
    dispatch({
      type: 'team/setActiveTeam',
      payload: child,
    })
  }

  return (
    <LeftSideContainer>
      <div className="resizable" />
      <div className="resize_line" />
      <Content className="resize_save">
        <TeamAdd onClick={() => createTeam()}>
          <TiamTitleText>团队管理</TiamTitleText>
          <IconFontStyle type="plus" />
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
          title={formType === 'create' ? '创建团队' : '编辑团队'}
          isVisible={teamIsVisible}
          children={teamForm}
          onConfirm={() => onConfirm()}
          onClose={() => setTeamIsVisible(false)}
        />
        <DeleteConfirm
          title={`确认解散【${activeChild?.name}】团队`}
          text="解散后将自动移除团队成员，该团队项目将自动划分到公司且权限变更为私有"
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
