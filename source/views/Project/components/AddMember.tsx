/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Form, message, Modal, Select } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#323233',
  fontSize: 14,
  svg: {
    fontSize: 16,
  },
})

const ModalContent = styled(Select)({
  margin: '16px 0',
  height: 400,
  borderRadius: 6,
  boxSizing: 'border-box',
  border: '1px solid #EBEDF0',
  padding: 24,
  width: '100%',
})

const ModalFooter = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

interface Props {
  value: boolean
  onChangeValue(): void
  details?: any
  onChangeUpdate(): void
}

const AddMember = (props: Props) => {
  const [searchParams] = useSearchParams()
  const {
    projectPermission,
    addMember,
    updateMember,
    setIsRefreshMember,
    getMemberList,
    memberList,
    getProjectInfo,
  } = useModel('project')
  const { getStaffList } = useModel('staff')
  const [staffList, setStaffList] = useState<any>([])
  const projectId = searchParams.get('id')
  const [form] = Form.useForm()

  const getList = async () => {
    const result = await getStaffList({ all: 1 })
    setStaffList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (props.details?.id) {
      form.setFieldsValue(props.details)
    }
  }, [props.details])

  const onConfirm = async () => {
    if (!form.getFieldValue('name')) {
      message.warning('成员不能为空！')
      return
    }

    if (!form.getFieldValue('userGroupId')) {
      message.warning('权限不能为空！')
      return
    }
    const values = form.getFieldsValue()
    const users = staffList?.filter((i: any) => values.name.find((k: any) => k === i.value))
    const params = {
      projectId,
      userGroupId: values.userGroupId,
      userIds: users?.map((i: any) => i.value),
    }
    try {
      if (props.details?.id) {
        params.userIds = props.details?.id
        await updateMember(params)
        message.success('编辑成功')
      } else {
        await addMember(params)
        message.success('添加成功')
      }
      props.onChangeValue()
      props.onChangeUpdate()
      setIsRefreshMember(true)
      getMemberList({ all: true, projectId })
      getProjectInfo({ projectId })

      // form.resetFields()
    } catch (error) {

      //
    }
  }

  const onClose = () => {
    form.resetFields()
    props.onChangeValue()
  }

  return (
    <Modal
      visible={props.value}
      title={false}
      footer={false}
      bodyStyle={{ padding: 24 }}
      width={700}
      closable={false}
      destroyOnClose
      maskClosable={false}
    >
      <ModalHeader>
        <span>{props.details?.id ? '编辑项目成员' : '添加项目成员'}</span>
        <IconFont onClick={onClose} type="close" />
      </ModalHeader>
      <Form form={form}>
        <Form.Item
          name="name"
          noStyle
          rules={[{ required: true, message: '' }]}
        >
          <ModalContent
            showArrow={false}
            mode="multiple"
            showSearch
            disabled={props.details?.id}
            options={staffList?.filter(
              (i: any) => !memberList?.find((k: any) => k.id === i.value),
            )}
            optionFilterProp="label"
          />
        </Form.Item>
        <ModalFooter>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#323233', marginRight: 16 }}>
              加入权限组
            </span>
            <Form.Item
              name="userGroupId"
              noStyle
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder="请选择权限组"
                getPopupContainer={node => node}
                style={{ width: 192 }}
                options={projectPermission}
                showSearch
                showArrow
                optionFilterProp="label"
              />
            </Form.Item>
          </div>
          <Button type="primary" onClick={onConfirm}>
            导入成员
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default AddMember
