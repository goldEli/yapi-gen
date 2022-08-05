/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import Popconfirm from '@/components/Popconfirm'
import styled from '@emotion/styled'
import { Divider, Form, Input, message, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid #EBEDF0',
  color: '#969799',
  cursor: 'pointer',
})

const DemandStatus = styled.div({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  width: 362,
  '.ant-form-item': {
    margin: '16px 0 0 0',
  },
})

const PopoverFooter = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 36,
  justifyContent: 'flex-end',
})

interface Props {
  hide?(): void
  active?: any
}

const DemandBox = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { memberList } = useModel('project')
  const { updateDemandStatus, getDemandInfo } = useModel('demand')

  const onClear = () => {
    props.hide?.()
    form.resetFields()
  }

  const onChangeStatus = async (value: any) => {
    value.statusId = props.active
    try {
      await updateDemandStatus(value)
      message.success(t('common.statusSuccess'))
      getDemandInfo({ projectId, id: demandId })
      onClear()
    } catch (error) {

      //
    }
  }

  const confirm = async () => {
    await form.validateFields()
    const res = form.getFieldsValue()
    const value = {
      projectId,
      demandId,
      userIds: res.username,
      content: res.content,
    }
    onChangeStatus(value)
  }

  return (
    <DemandStatus title="">
      <div
        onClick={() => props.hide?.()}
        style={{ textAlign: 'right', color: '#323233', cursor: 'pointer' }}
      >
        <IconFont type="close" />
      </div>
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item
          label={t('common.dealName')}
          name="username"
          rules={[{ required: true, message: '' }]}
        >
          <Select
            mode="multiple"
            placeholder={t('common.pleaseSelect')}
            allowClear
          >
            {memberList?.map((i: any) => {
              return (
                <Select.Option key={i.id} value={i.id}>
                  {i.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label={t('common.comment')} name="content">
          <Input.TextArea
            autoSize={{ minRows: 5, maxRows: 5 }}
            placeholder={t('project.pleaseComment')}
          />
        </Form.Item>
      </Form>
      <PopoverFooter size={16}>
        <Button onClick={onClear}>{t('common.cancel')}</Button>
        <Button type="primary" onClick={confirm}>
          {t('common.confirm')}
        </Button>
      </PopoverFooter>
    </DemandStatus>
  )
}

const DemandStatusBox = () => {
  const { demandInfo } = useModel('demand')
  const statusList = demandInfo?.status?.can_changes
  const [active, setActive] = useState(0)

  return (
    <>
      {statusList?.map((i: any, index: number) => (
        <Popconfirm
          key={i.id}
          content={({ onHide }: { onHide(): void }) => {
            return <DemandBox active={active} hide={onHide} />
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusWrap
              onClick={() => setActive(i.id)}
              style={{
                color: i.id === demandInfo?.status?.id ? '#2877ff' : '#969799',
                border:
                  i.id === demandInfo?.status?.id
                    ? '1px solid #2877ff'
                    : '1px solid #EBEDF0',
              }}
            >
              {i.content}
            </StatusWrap>
            <Divider
              style={{
                width: 48,
                margin: '0 8px',
                minWidth: 'auto',
                display:
                  index === statusList?.values?.length - 1 ? 'none' : 'block',
              }}
              dashed
            />
          </div>
        </Popconfirm>
      ))}
    </>
  )
}

export default DemandStatusBox
