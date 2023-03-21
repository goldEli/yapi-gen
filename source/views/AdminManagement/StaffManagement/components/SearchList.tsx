// 公司员工筛选组件

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form, Select } from 'antd'
import {
  SearchLine,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getDepartmentSelectList,
  getPositionSelectList,
  getRoleList,
} from '@/services/staff'
import CustomSelect from '@/components/CustomSelect'

const Wrap = styled.div({
  display: 'flex',
  minHeight: 64,
  alignItems: 'center',
})

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

interface Props {
  onChangeForm?(value: any): void
  showForm?: boolean
  onSearch(value: any): void
}

const SearchList = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [positionOptions, setPositionOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const onClearForm = async () => {
    form.resetFields()
    const value = await form.validateFields()

    props.onSearch(value)
  }
  const init = async () => {
    const res = await getDepartmentSelectList()

    setDepartmentOptions(res.data)

    const res2 = await getPositionSelectList()
    setPositionOptions(res2.data)
    const res3 = await getRoleList()
    setRoleOptions(res3.data)
  }

  useEffect(() => {
    init()
  }, [])

  const confirm = async () => {
    const value = await form.validateFields()

    props.onSearch(value)
  }
  return (
    <SearchLine style={{ padding: '0 0 0 24px' }}>
      <Wrap hidden={props.showForm}>
        <FormWrap form={form}>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('common.department')}
            </span>
            <Form.Item name="department">
              <SelectWrap
                showArrow
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                optionFilterProp="label"
                allowClear
                options={departmentOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('common.job')}
            </span>
            <Form.Item name="position">
              <SelectWrap
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={positionOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('common.permissionGroup')}
            </span>
            <Form.Item name="userGroup">
              <SelectWrap
                onChange={confirm}
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={roleOptions.map((item: any) => ({
                  label: item.content_txt,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('common.status')}
            </span>
            <Form.Item name="status">
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: t('common.job1'),
                    value: 1,
                  },
                  {
                    label: t('common.job2'),
                    value: 2,
                  },
                  {
                    label: t('common.del'),
                    value: 3,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('handover_status')}
            </span>
            <Form.Item name="handover_status">
              <SelectWrap
                mode="multiple"
                onChange={confirm}
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                optionFilterProp="label"
                showArrow
                allowClear
                options={[
                  {
                    label: t('normal'),
                    value: 1,
                  },
                  {
                    label: t('handed_over'),
                    value: 2,
                  },
                ]}
              />
            </Form.Item>
          </SelectWrapBedeck>

          <ClearForm onClick={onClearForm}>
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
      </Wrap>
    </SearchLine>
  )
}

export default SearchList
