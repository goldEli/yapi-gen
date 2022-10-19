/* eslint-disable @typescript-eslint/naming-convention */
import { useModel } from '@/models'
import styled from '@emotion/styled'
import { Form, Select } from 'antd'
import { SearchLine, SelectWrapBedeck } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 160px;
    border: none !important;
    outline: none !important;
  }
`
interface Props {
  onChangeForm?(value: any): void
  showForm?: boolean
  onSearch(value: any): void
}

const SearchList = (props: Props) => {
  const [t] = useTranslation()
  const { getDepartmentSelectList, getPositionSelectList, getRoleList }
    = useModel('staff')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                options={roleOptions.map((item: any) => ({
                  label: item.content_txt,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </SelectWrapBedeck>

          <ClearForm onClick={onClearForm}>
            <span style={{ color: '#2877FF', fontSize: 15, cursor: 'pointer' }}>
              {t('common.clearForm')}
            </span>
          </ClearForm>
        </FormWrap>
      </Wrap>
    </SearchLine>
  )
}

export default SearchList
