/* eslint-disable @typescript-eslint/naming-convention */
import { SearchLine, SelectWrapBedeck } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { DatePicker, Form, Input, Select } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import RangePicker from '@/components/RangePicker'

const rangPicker = css`
  .ant-picker-panel-container {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-picker-footer {
    min-width: inherit;
    width: max-content;
  }
  .ant-picker-ranges {
    display: flex;
    flex-direction: column;
  }
  .ant-tag {
    margin-right: 0;
  }
`

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

const InputWrap = styled(Input)`
  color: black;
  border: none !important;
  outline: none !important;
`
interface Props {
  activeTab: number
  onFilterChange(params: any): void
}

const SearchList = (props: Props) => {
  const [form] = Form.useForm()
  const [t, i18n] = useTranslation()

  const onConfirm = async () => {
    const values = form.getFieldsValue()
    if (values.time) {
      values.time = [
        moment(values.time[0]).format('YYYY-MM-DD'),
        moment(values.time[1]).format('YYYY-MM-DD'),
      ]
    }
    if (values.verifyTime) {
      values.verifyTime = [
        moment(values.verifyTime[0]).format('YYYY-MM-DD'),
        moment(values.verifyTime[1]).format('YYYY-MM-DD'),
      ]
    }
    props?.onFilterChange(values)
  }

  const onClearForm = async () => {
    form.resetFields()
  }

  return (
    <SearchLine>
      <FormWrap form={form}>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('newlyAdd.examineStatus')}
          </span>
          <Form.Item name="verifyStatus">
            <SelectWrap
              showArrow
              onChange={onConfirm}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder={t('common.all')}
              showSearch
              optionFilterProp="label"
              options={[
                { label: t('newlyAdd.waitExamine'), value: 1 },
                { label: t('newlyAdd.passed'), value: 2 },
                { label: t('newlyAdd.notPass'), value: 3 },
              ]}
            />
          </Form.Item>
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('newlyAdd.submitTime')}
          </span>
          <Form.Item name="time">
            <RangePicker
              isShowQuick
              value={form.getFieldValue('time')}
              onChange={onConfirm}
            />
          </Form.Item>
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('newlyAdd.examineTime')}
          </span>
          <Form.Item name="verifyTime">
            <RangePicker
              isShowQuick
              value={form.getFieldValue('verifyTime')}
              onChange={onConfirm}
            />
          </Form.Item>
        </SelectWrapBedeck>
        {!props?.activeTab && (
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('newlyAdd.examineTime')}
            </span>
            <Form.Item name="remark">
              <InputWrap
                allowClear
                autoComplete="off"
                placeholder={t('newlyAdd.pleaseInfo')}
                onPressEnter={onConfirm}
              />
            </Form.Item>
          </SelectWrapBedeck>
        )}

        <ClearForm onClick={onClearForm}>
          <span style={{ color: '#2877FF', fontSize: 15, cursor: 'pointer' }}>
            {t('common.clearForm')}
          </span>
        </ClearForm>
      </FormWrap>
    </SearchLine>
  )
}

export default SearchList
