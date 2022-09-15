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
}

const SearchList = (props: Props) => {
  const [form] = Form.useForm()
  const [t, i18n] = useTranslation()

  const onConfirm = async () => {

    //
  }

  const onClearForm = async () => {

    //
  }

  const onChangeTime = (dates: any) => {

    //
  }

  const onChangePickerExamine = (dates: any) => {

    //
  }
  return (
    <SearchLine>
      <FormWrap form={form}>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '12px' }}>审核状态</span>
          <Form.Item name="department">
            <SelectWrap
              showArrow
              onChange={onConfirm}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder={t('common.all')}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '12px' }}>提交时间</span>
          <Form.Item name="times">
            <DatePicker.RangePicker
              onChange={dates => onChangeTime(dates)}
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
                    }
              }
            />
          </Form.Item>
        </SelectWrapBedeck>
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '12px' }}>审核时间</span>
          <Form.Item name="times1">
            <DatePicker.RangePicker
              onChange={dates => onChangeTime(dates)}
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
                    }
              }
            />
          </Form.Item>
        </SelectWrapBedeck>
        {!props?.activeTab && (
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>审核意见</span>
            <Form.Item name="userGroup">
              <InputWrap
                allowClear
                autoComplete="off"
                placeholder="请输入查看内容"
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
