import React, { useEffect, useState } from 'react'
import { SelectWrap, SelectWrapBedeck } from '@/components/StyleCommon'
import { getPriOrStu } from '@/services/mine'
import RangePicker from '@/components/RangePicker'
import { Space, Form, Input } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { getProjectMember } from '@/services/project'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { css } from '@emotion/css'
import dayjs from 'dayjs'
import { endWeekData } from '@/views/WorkReport/Formwork/DataList'
import moment from 'moment'
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
const customInput = css`
  border: none !important;
`
interface MemberListProps {
  name: string
  id: number
  content_txt: string
}
interface IProps {
  onChange?(data: any): void
}
interface SearchProps {
  [key: string]: number | string
}
const ChangeLogFilter = (prop: IProps) => {
  const [memberList, setMemberList] = useState<MemberListProps[]>([])
  const [changeType, setChangeType] = useState<MemberListProps[]>([])
  const [search, setSearch] = useState({})
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  useEffect(() => {
    const init = async () => {
      const res = await getProjectMember({
        projectId: id,
        all: 1,
      })
      setMemberList(res ?? [])
    }
    const getChangeType = async () => {
      const res = await getPriOrStu({
        projectId: id,
        type: 'change_log_type',
      })
      setChangeType(res?.data ?? [])
    }
    init()
    getChangeType()
  }, [])
  useEffect(() => {
    console.log('search', search)
    for (const key in search) {
      if (
        !search[key as keyof typeof search] ||
        (key === 'created_at' && !Object.values(search).join(''))
      ) {
        delete search[key as keyof typeof search]
      }
    }
    prop?.onChange && prop?.onChange(search)
  }, [search])
  return (
    <FormWrap form={form}>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更人</span>
        <Form.Item name="change_user">
          <SelectWrap
            showArrow
            onChange={(value: any) => {
              setSearch({ ...search, change_user: value })
            }}
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
        <Form.Item name="change_type">
          <SelectWrap
            onChange={(value: any) => {
              setSearch({ ...search, change_type: value })
            }}
            style={{ width: '100%' }}
            placeholder={t('common.pleaseSelect')}
            showSearch
            optionFilterProp="label"
            showArrow
            allowClear
            options={changeType.map(item => ({
              label: item.content_txt,
              value: item.id,
            }))}
          />
        </Form.Item>
      </SelectWrapBedeck>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更前后</span>
        <Form.Item name="change_keywords">
          <Input
            bordered={false}
            className={customInput}
            placeholder={t('common.pleaseSelect')}
            onChange={e => {
              setSearch({ ...search, change_keywords: e.target.value })
            }}
            allowClear
          ></Input>
        </Form.Item>
      </SelectWrapBedeck>
      <SelectWrapBedeck>
        <span style={{ margin: '0 16px', fontSize: '14px' }}>变更时间</span>
        <Form.Item name="created_at">
          <RangePicker
            isShowQuick
            dateValue={form.getFieldValue('created_at')}
            onChange={value => {
              if (!value) {
                setSearch({
                  ...search,
                  created_at: [],
                })
                return
              }
              const [startTime, endTime] = value
              if (dayjs(startTime).unix() === 0) {
                form.setFieldsValue({
                  created_at: [
                    moment('1970-01-01'),
                    dayjs(dayjs(endTime).format('YYYY-MM-DD')),
                  ],
                })
              }
              setSearch({
                ...search,
                created_at: [
                  dayjs(startTime).format('YYYY-MM-DD'),
                  dayjs(endTime).format('YYYY-MM-DD'),
                ],
              })
            }}
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
          onClick={() => {
            setSearch({})
            form.resetFields()
          }}
        >
          {t('common.clearForm')}
        </span>
      </ClearForm>
    </FormWrap>
  )
}
export default ChangeLogFilter
