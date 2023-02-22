import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import SideDragging from '../components/SideDragging'
import CommonModal from '@/components/CommonModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import { Form, Input, Tooltip } from 'antd'
import { uploadFileByTask } from '@/services/cos'
import upload from 'antd/lib/upload'
import CommonModal1 from './CommonModal'
const LeftSideContainer = styled.div`
  width: 232px;
  height: 100%;
  border-right: 1px solid var(--neutral-n6-d2);
  padding: 0 16px;
  background-color: var(--neutral-white-d1);
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
  &:hover {
    background-color: var(--hover-d1);
  }
`
const InputStyle = styled(Input)`
  width: 480px;
  height: 32px;
  position: relative;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  color: var(--neutral-n1-d1);
  input {
    background: var(--neutral-white-d4);
    color: var(--neutral-n1-d1);
  }
`
const FormStyle = styled(Form)`
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
const Upload = () => {
  const [defaultIcon, setDefaultIcon] = useState(true)
  const [uploadImg, setUploadImg] = useState('')
  const customRequest = async ({ file }: { file: any }) => {
    const response = await uploadFileByTask(
      file,
      file.name,
      `richEditorFiles_${new Date().getTime()}`,
    )
    setDefaultIcon(false)
    setUploadImg(response.url)
  }
  return (
    <>
      <UploadStyle customRequest={customRequest} fileList={[]}>
        <UploadTitle>
          团队LOGO
          <Tooltip placement="top" title={'支持jpg、png格式，大小80*80像素'}>
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

const LeftSide = () => {
  // 拖拽的宽高样式
  const childStyle = {
    width: '200px',
    height: '44px',
    hoverColor: `var(--hover-d2)`,
    activeColor: `var(--gradient)`,
  }
  const [list, setList] = React.useState<any>(() =>
    [1, 2, 3, 4, 5].map(v => ({
      key: v,
      children: `Item ${v}`,
    })),
  )
  const onChangeDragging = (item: any) => {
    setList(
      list.map((el: any) => ({
        ...el,
        active: el.children === item ? true : false,
      })),
    )
  }
  // 创建和修改弹窗
  const [teamIsVisible, setTeamIsVisible] = useState(false)
  //  创建和修改弹窗的表单
  const [teamForm, setTeamForm] = useState<any>(null)
  // 删除团队弹窗
  const [delTeamIsVisible, setDelTeamIsVisible] = useState(false)
  const [value, setValue] = useState('')
  const [form] = Form.useForm()
  const teamGetForm = (row?: any) => {
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
              value={value}
              maxLength={20}
              onChange={e => setValue(e.target.value)}
              suffix={
                <>
                  {/* 删除按钮 */}
                  {value && (
                    <IconFont
                      type="close-circle-fill"
                      onClick={() => {
                        setValue('')
                      }}
                      style={{ color: '#BBBDBF', fontSize: 16 }}
                    />
                  )}
                </>
              }
            />
          </Form.Item>
          {/* <Form.Item label="" name="img"> */}
          <UploadBox>
            <Upload />
          </UploadBox>
          {/* </Form.Item> */}
        </FormStyle>
      </div>
    )
  }
  const createTeam = () => {
    setTeamIsVisible(true)
    setTeamForm(teamGetForm())
  }
  const editTeam = (row: any) => {
    setTeamForm(teamGetForm(row))
    setTeamIsVisible(true)
  }
  useEffect(() => {
    teamIsVisible && setTeamForm(teamGetForm())
  }, [value])

  return (
    <LeftSideContainer>
      <TeamAdd onClick={() => createTeam()}>
        <TiamTitleText>团队管理</TiamTitleText>
        <IconFontStyle type="plus"></IconFontStyle>
      </TeamAdd>
      {/* 拖拽组件 */}
      <SideDragging
        onChange={(item: any) => onChangeDragging(item)}
        list={list}
        setList={setList}
        childStyle={childStyle}
        onChangeTeam={(key: string, row: any) => {
          key === 'del' ? setDelTeamIsVisible(true) : editTeam(row)
        }}
      />
      <CommonModal1
        title={'添加成员'}
        isVisible={true}
        onClose={() => setTeamIsVisible(false)}
      />
      <CommonModal
        title={'创建团队'}
        isVisible={teamIsVisible}
        children={teamForm}
        onClose={() => setTeamIsVisible(false)}
      />
      <DeleteConfirm
        title="确认解散【超强团队】团队"
        text="解散后将自动移除团队成员，该团队项目将自动划分到公司且权限变更为私有"
        isVisible={delTeamIsVisible}
        onConfirm={() => setDelTeamIsVisible(false)}
        onChangeVisible={() => setDelTeamIsVisible(false)}
      ></DeleteConfirm>
    </LeftSideContainer>
  )
}
export default LeftSide
