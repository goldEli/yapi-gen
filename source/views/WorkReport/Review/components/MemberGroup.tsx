import React, { useState, useEffect } from 'react'
import CommonModal from '@/components/CommonModal'
import styled from '@emotion/styled'
import { Form, Input, InputRef } from 'antd'
import { useTranslation } from 'react-i18next'
import MultipleAvatar from '@/components/MultipleAvatar'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useSelector, useDispatch } from '@store/index'
import { setProjectGroup } from '@store/workReport'
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

const MemberGroup = (props: any) => {
  const { visible, onCancel, onOk } = props
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  const { projectGroup } = useSelector(state => state.workReport)
  const dispatch = useDispatch()
  const [index, setIndex] = useState(0)
  const confirm = async () => {
    const data = await form.validateFields()
    const params = {
      name: data.name as string,
      user_ids: projectGroup.map((item: { id: any }) => item.id),
    }
    console.log(params)
    onOk(params)
  }
  useEffect(() => {
    form.setFieldValue('name', props.name)
  }, [visible])
  return (
    <CommonModal
      width={528}
      title="人员分组"
      isVisible={visible}
      onClose={() => {
        onCancel()
      }}
      onConfirm={() => {
        confirm()
      }}
    >
      <DeleteConfirm
        isVisible={isDeleteVisible}
        onConfirm={() => {
          const data = [...projectGroup]
          data.splice(index, 1)
          dispatch(setProjectGroup(data))
          setIsDeleteVisible(false)
        }}
        onChangeVisible={() => {
          setIsDeleteVisible(false)
        }}
        text="移除后无法查看该员工任务"
        title="移除确认"
      />
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
          {projectGroup?.map((item: any, index: number) => {
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
                    (
                    {item?.positionName || item?.position_name
                      ? item?.positionName || item?.position_name
                      : '--'}
                    )
                  </span>
                </Row>
                <div
                  onClick={e => {
                    setIsDeleteVisible(true)
                    setIndex(index)
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
export default MemberGroup
