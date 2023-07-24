import React, { useEffect, useState } from 'react'
import { SelectWrap, SelectWrapBedeck } from '@/components/StyleCommon'
import RangePicker from '@/components/RangePicker'
import { Space, Form } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { getProjectMember } from '@/services/project'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
const ClearForm = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const FormWrap = styled(Form)({
  gap: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  '.ant-form-item': {
    margin: 0,
  },
})
interface MemberListProps {
  name: string
  id: number
}
const CommonFilter = () => {
  const [memberList, setMemberList] = useState<MemberListProps[]>([])
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  useEffect(() => {
    const init = async () => {
      let res = await getProjectMember({
        projectId: id,
        all: 1,
      })
      setMemberList(res)
    }
    init()
  }, [])
  return (
    <FormWrap form={form}>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更人</span>
        <Form.Item name="send_user_ids">
          <SelectWrap
            showArrow
            onChange={() => {}}
            style={{ width: '100%' }}
            placeholder={t('common.pleaseSelect')}
            showSearch
            optionFilterProp="label"
            allowClear
            options={memberList.map(item => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
      </SelectWrapBedeck>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更类型</span>
        <Form.Item name="receive_user_ids">
          <SelectWrap
            onChange={() => {}}
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={t('common.pleaseSelect')}
            showSearch
            optionFilterProp="label"
            showArrow
            allowClear
          />
        </Form.Item>
      </SelectWrapBedeck>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更前后</span>
        <Form.Item name="receive_user_ids">
          <SelectWrap
            onChange={() => {}}
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={t('common.pleaseSelect')}
            showSearch
            optionFilterProp="label"
            showArrow
            allowClear
          />
        </Form.Item>
      </SelectWrapBedeck>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更时间</span>
        <Form.Item name="receive_user_ids">
          <RangePicker
            isShowQuick
            dateValue={form.getFieldValue('times')}
            onChange={() => {}}
          />
        </Form.Item>
      </SelectWrapBedeck>
      <ClearForm>
        <span
          style={{
            color: 'var(--primary-d2)',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {t('common.clearForm')}
        </span>
      </ClearForm>
    </FormWrap>
  )
}
export default CommonFilter
