import React, { useState } from 'react'
import styled from '@emotion/styled'
import CommonModal from '@/components/CommonModal'

import { Form, Input, InputRef } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'

import {
  closeUserGroupingModel,
  saveUserGroupingModel,
} from '@store/kanBan/kanBan.thunk'
import MultipleAvatar from '@/components/MultipleAvatar'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
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
          fontFamily: props.fontWeight ? '' : 'SiYuanMedium',
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
  overflow-y: auto;
  max-height: 50vh;
  overflow-x: hidden;
`
const UserListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 48px;
  border-radius: 6px;
  &:hover {
    background: var(--hover-d2);
    cursor: pointer;
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`
const UserGroupingModal: React.FC<UserGroupingModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { userGroupingModelInfo } = useSelector(store => store.kanBan)
  const [userList, setUserList] = useState<Model.User.User[]>([])
  const { open: openDelete, DeleteConfirmModal } = useDeleteConfirmModal()
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
  console.log(userList, userList)
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
      <DeleteConfirmModal />
      <Box>
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {}}
        >
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={t('group_Name')} fontWeight={400} />}
            name="name"
          >
            <Input maxLength={30} placeholder={t('please_enter_a_name')} />
          </Form.Item>
        </Form>
        <UserList>
          {userList.map(item => {
            return (
              <UserListItem key={item.id}>
                <Row>
                  <MultipleAvatar
                    max={1}
                    list={[
                      {
                        avatar: item.avatar,
                        id: item.id,
                        name: item.name,
                      },
                    ]}
                  />
                  <span>
                    ({item?.positionName ? item?.positionName : '--'})
                  </span>
                </Row>
                <div
                  onClick={e => {
                    openDelete({
                      title: t('removal_confirmation'),
                      text: t('removal_person_confirmation'),
                      onConfirm() {
                        onDel(item.id)
                        return Promise.resolve()
                      },
                    })
                    e.stopPropagation()
                  }}
                >
                  <span style={{ color: 'var(--primary-d2)' }}>
                    {t('common.move')}
                  </span>
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
