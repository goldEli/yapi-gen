import React, { useState } from 'react'
import styled from '@emotion/styled'
import CommonModal from '@/components/CommonModal'

import { Form, Input, InputRef } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'

import useProjectId from '../hooks/useProjectId'
import {
  closeUserGroupingModel,
  saveUserGroupingModel,
} from '@store/kanBan/kanBan.thunk'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CommonButton from '@/components/CommonButton'
import { produce } from 'immer'

interface UserGroupingModalProps {}

const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'SiYuanMedium',
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const Box = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
`
const UserList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 0;
  overflow-y: auto;
  max-height: 60vh;
`
const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserGroupingModal: React.FC<UserGroupingModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { userGroupingModelInfo } = useSelector(store => store.kanBan)
  const [userList, setUserList] = useState<Model.User.User[]>([])

  React.useEffect(() => {
    form.setFieldsValue({
      name: userGroupingModelInfo.groupName,
    })
    setUserList(userGroupingModelInfo.userList)
  }, [userGroupingModelInfo])
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeUserGroupingModel())
  }

  const confirm = async () => {
    const data = await form.validateFields()
    dispatch(
      saveUserGroupingModel({
        name: data.name as string,
        user_ids: userList.map(item => item.id),
      }),
    )
  }

  const onsubmit = () => {
    form.submit()
  }

  const onDel = (id: Model.User.User['id']) => {
    setUserList(prev => {
      return prev.filter(item => item.id !== id)
    })
  }

  //   const title = React.useMemo(() => {
  //     if (saveAsViewModelInfo.title) {
  //       return saveAsViewModelInfo.title
  //     }
  //     if (saveAsViewModelInfo.viewItem) {
  //       return '编辑视图'
  //     }
  //     return '另存为视图'
  //   }, [saveAsViewModelInfo])
  return (
    <CommonModal
      width={528}
      title={t('personnel_grouping')}
      isVisible={userGroupingModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={t('confirm')}
      isDisable={userList.length === 0}
    >
      <Box>
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {}}
        >
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={t('group_Name')} />}
            name="name"
          >
            <Input maxLength={30} placeholder={t('please_enter_a_name')} />
          </Form.Item>
        </Form>
        <UserList>
          {userList.map(item => {
            return (
              <UserListItem key={item.id}>
                <CommonUserAvatar avatar={item.avatar} name={item.name} />
                <div
                  onClick={e => {
                    e.stopPropagation()
                    onDel(item.id)
                  }}
                >
                  <CommonButton type="primaryText">{t('delete')}</CommonButton>
                </div>
              </UserListItem>
            )
          })}
        </UserList>
      </Box>
    </CommonModal>
  )
}

export default UserGroupingModal
