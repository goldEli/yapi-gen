// 添加项目成员

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Form, message, Modal, Select } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { CloseWrap } from '@/components/StyleCommon'

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

const ModalContent = styled.div({
  margin: '16px 0',
  minHeight: 200,
  borderRadius: 6,
  boxSizing: 'border-box',
  border: '1px solid #EBEDF0',
  padding: 24,
  width: '99%',
})

const ModalFooter = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 8,
})

interface Props {
  value: boolean
  onChangeValue(): void
  details?: any
  onChangeUpdate(): void
}

const AddMember = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const {
    projectPermission,
    addMember,
    setIsRefreshMember,
    getMemberList,
    memberList,
    getProjectInfo,
  } = useModel('project')
  const { getStaffList } = useModel('staff')
  const [staffList, setStaffList] = useState<any>([])
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [form] = Form.useForm()
  const [nameIds, setNameIds] = useState<any>([])

  const getList = async () => {
    const result = await getStaffList({ all: 1 })
    setStaffList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const onConfirm = async () => {
    const values = form.getFieldsValue()

    if (nameIds.length <= 0) {
      message.warning(t('project.memberNull'))
      return
    }
    let { userGroupId } = values

    if (!form.getFieldValue('userGroupId')) {
      userGroupId = projectPermission?.filter(
        (i: any) => i.tagLabel === '参与者',
      )[0]?.value
    }

    const params: any = {
      projectId,
      userGroupId,
    }

    try {
      const users = staffList?.filter((i: any) =>
        nameIds.find((k: any) => k === i.value),
      )
      params.userIds = users?.map((i: any) => i.value)
      await addMember(params)
      message.success(t('common.addSuccess'))
      props.onChangeValue()
      props.onChangeUpdate()
      setNameIds([])
      setIsRefreshMember(true)
      getMemberList({ all: true, projectId })
      getProjectInfo({ projectId })
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {
      //
    }
  }

  const onClose = () => {
    form.resetFields()
    props.onChangeValue()
  }

  const onSelectUsers = (value: any) => {
    setNameIds(value)
    form.setFieldsValue({
      name: value,
    })
  }

  return (
    <Modal
      visible={props.value}
      title={false}
      footer={false}
      bodyStyle={{ padding: '16px 16px 24px 24px' }}
      width={700}
      closable={false}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      wrapClassName="vertical-center-modal"
    >
      <ModalHeader>
        <span>
          {props.details?.id ? t('project.editMember') : t('project.addMember')}
        </span>
        <CloseWrap onClick={onClose} width={32} height={32}>
          <IconFont type="close" style={{ fontSize: 20 }} />
        </CloseWrap>
      </ModalHeader>
      <Form form={form}>
        <ModalContent>
          <Select
            style={{ width: '100%' }}
            showArrow={false}
            mode="multiple"
            showSearch
            onChange={onSelectUsers}
            value={nameIds}
            disabled={props.details?.id}
            options={staffList?.filter(
              (i: any) => !memberList?.find((k: any) => k.id === i.value),
            )}
            optionFilterProp="label"
          />
        </ModalContent>
        <ModalFooter>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#323233', marginRight: 16 }}>
              {t('project.joinPermission')}
              <span style={{ fontSize: 12, color: 'red', marginLeft: 4 }}>
                *
              </span>
            </span>
            <Form.Item
              name="userGroupId"
              noStyle
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('project.pleasePermission')}
                getPopupContainer={node => node}
                style={{ width: 192 }}
                options={projectPermission}
                showSearch
                showArrow
                optionFilterProp="label"
                defaultValue={
                  projectPermission?.filter(
                    (i: any) => i.tagLabel === '参与者',
                  )[0]?.value
                }
              />
            </Form.Item>
          </div>
          <Button type="primary" onClick={onConfirm}>
            {t('common.confirm')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default AddMember
