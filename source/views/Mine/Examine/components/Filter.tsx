/* eslint-disable @typescript-eslint/naming-convention */
import { SearchLine } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { DatePicker, Form, Input, Select } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'

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
const SelectWrapBedeck = styled.div`
  height: 32px;
  position: relative;
  height: 32px;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  align-items: center;
  border-radius: 6px;
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-picker {
    border: none;
  }
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
            <DatePicker.RangePicker
              onChange={onConfirm}
              className={rangPicker}
              getPopupContainer={node => node}
              format={(times: moment.Moment) => {
                if (times.unix() === 0 || times.unix() === 1893427200) {
                  return t('common.null')
                }
                return times.format('YYYY-MM-DD')
              }}
              ranges={
                i18n.language === 'zh'
                  ? {
                      最近一周: [
                        moment(new Date()).startOf('days')
                          .subtract(6, 'days'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近一月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(1, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近三月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(3, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      今天开始: [
                        moment(new Date()).startOf('days'),
                        moment(1893427200 * 1000),
                      ],
                      今天截止: [moment(0), moment(new Date()).endOf('days')],
                      空: [moment(0), moment(0)],
                    }
                  : {
                      'Last Week': [
                        moment(new Date()).startOf('days')
                          .subtract(6, 'days'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Last Month': [
                        moment(new Date())
                          .startOf('months')
                          .subtract(1, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Last March': [
                        moment(new Date())
                          .startOf('months')
                          .subtract(3, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Start today': [
                        moment(new Date()).startOf('days'),
                        moment(1893427200 * 1000),
                      ],
                      'Due today': [
                        moment(0),
                        moment(new Date()).endOf('days'),
                      ],
                      Empty: [moment(0), moment(0)],
                    }
              }
            />
          </Form.Item>
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>
            {t('newlyAdd.examineTime')}
          </span>
          <Form.Item name="verifyTime">
            <DatePicker.RangePicker
              onChange={onConfirm}
              className={rangPicker}
              getPopupContainer={node => node}
              format={(times: moment.Moment) => {
                if (times.unix() === 0 || times.unix() === 1893427200) {
                  return t('common.null')
                }
                return times.format('YYYY-MM-DD')
              }}
              ranges={
                i18n.language === 'zh'
                  ? {
                      最近一周: [
                        moment(new Date()).startOf('days')
                          .subtract(6, 'days'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近一月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(1, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      最近三月: [
                        moment(new Date())
                          .startOf('months')
                          .subtract(3, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      今天开始: [
                        moment(new Date()).startOf('days'),
                        moment(1893427200 * 1000),
                      ],
                      今天截止: [moment(0), moment(new Date()).endOf('days')],
                      空: [moment(0), moment(0)],
                    }
                  : {
                      'Last Week': [
                        moment(new Date()).startOf('days')
                          .subtract(6, 'days'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Last Month': [
                        moment(new Date())
                          .startOf('months')
                          .subtract(1, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Last March': [
                        moment(new Date())
                          .startOf('months')
                          .subtract(3, 'months'),
                        moment(new Date()).endOf('days'),
                      ],
                      'Start today': [
                        moment(new Date()).startOf('days'),
                        moment(1893427200 * 1000),
                      ],
                      'Due today': [
                        moment(0),
                        moment(new Date()).endOf('days'),
                      ],
                      Empty: [moment(0), moment(0)],
                    }
              }
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
