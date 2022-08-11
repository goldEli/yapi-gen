/* eslint-disable @typescript-eslint/naming-convention */
import { DatePicker } from 'antd'
import { css } from '@emotion/css'
import moment from 'moment'
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
interface Props {
  onChange(values: any): void
  isWidth?: boolean
  value?: any
}

const RangePicker = (props: Props) => {
  const [t, i18n] = useTranslation()
  return (
    <DatePicker.RangePicker
      value={props.value}
      allowClear
      style={{ width: props.isWidth ? '' : '100%' }}
      onChange={props.onChange}
      className={rangPicker}
      getPopupContainer={node => node}
      format={(times: moment.Moment) => {
        if (times.unix() === 0 || times.unix() === 1893427200) {
          return i18n.language === 'zh' ? '空' : 'null'
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
                moment(new Date()).startOf('months')
                  .subtract(1, 'months'),
                moment(new Date()).endOf('days'),
              ],
              最近三月: [
                moment(new Date()).startOf('months')
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
                moment(new Date()).startOf('months')
                  .subtract(1, 'months'),
                moment(new Date()).endOf('days'),
              ],
              'Last March': [
                moment(new Date()).startOf('months')
                  .subtract(3, 'months'),
                moment(new Date()).endOf('days'),
              ],
              'Start today': [
                moment(new Date()).startOf('days'),
                moment(1893427200 * 1000),
              ],
              'Due today': [moment(0), moment(new Date()).endOf('days')],
            }
      }
    />
  )
}

export default RangePicker
