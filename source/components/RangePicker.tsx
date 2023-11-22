// 筛选公用的时间组件

/* eslint-disable @typescript-eslint/naming-convention */
import { DatePicker } from 'antd'
import { css } from '@emotion/css'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { DateQuickWrap } from './StyleCommon'

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
  .customPopup {
    left: -90px !important;
  }
  .customPopup1 {
    left: -118px !important;
  }
  .customPopup2 {
    left: -122px !important;
  }
  .customPopup3 {
    left: -166px !important;
  }
`
interface Props {
  onChange(values: any): void
  isWidth?: boolean
  dateValue?: any
  isShowQuick?: boolean
  placement?: any
  width?: string
  // 是否可以删除
  hasClear?: boolean
  w?: number
}

const RangePicker = (props: Props) => {
  const [t] = useTranslation()
  const valuesArr = [
    [
      moment(new Date()).startOf('days').subtract(6, 'days'),
      moment(new Date()).endOf('days'),
    ],
    [
      moment(new Date()).startOf('months').subtract(1, 'months'),
      moment(new Date()).endOf('days'),
    ],
    [
      moment(new Date()).startOf('months').subtract(3, 'months'),
      moment(new Date()).endOf('days'),
    ],
    [moment(new Date()).startOf('days'), moment(1893427200 * 1000)],
    [moment(0), moment(new Date()).endOf('days')],
    [moment(0), moment(0)],
  ]

  const onHandleData = (time: any) => {
    return time.unix() < 0 || time.unix() > 1893427200
  }

  // 点击快捷操作
  const onClickDate = (idx: any) => {
    props.onChange(valuesArr[idx])
  }

  // 时间改变后
  const onChangeDate = (values: any) => {
    props.onChange(values)
  }

  // 判断当前是否匹配
  const getIsMatching = (idx: any) => {
    const startTime = moment(valuesArr[idx][0]).format('YYYY-MM-DD')
    const endTime = moment(valuesArr[idx][1]).format('YYYY-MM-DD')
    if (props.dateValue) {
      return (
        moment(props.dateValue[0]).format('YYYY-MM-DD') === startTime &&
        moment(props.dateValue[1]).format('YYYY-MM-DD') === endTime
      )
    }
    return false
  }
  const customPopup = (w: any) => {
    const map: any = {
      56: 'customPopup',
      84: 'customPopup1',
      88: 'customPopup2',
      132: 'customPopup3',
    }
    return map[Math.ceil(w)]
  }
  // 筛选左侧快捷操作
  const renderExtraFooter = () => {
    return (
      <div>
        <DateQuickWrap
          isActive={getIsMatching(0)}
          onClick={() => onClickDate(0)}
        >
          {t('common.timesDays')}
        </DateQuickWrap>
        <DateQuickWrap
          isActive={getIsMatching(1)}
          onClick={() => onClickDate(1)}
        >
          {t('common.timesMonths')}
        </DateQuickWrap>
        <DateQuickWrap
          isActive={getIsMatching(2)}
          onClick={() => onClickDate(2)}
        >
          {t('common.timesThreeMonths')}
        </DateQuickWrap>
        <DateQuickWrap
          isActive={getIsMatching(3)}
          onClick={() => onClickDate(3)}
        >
          {t('common.startDate')}
        </DateQuickWrap>
        <DateQuickWrap
          isActive={getIsMatching(4)}
          onClick={() => onClickDate(4)}
        >
          {t('common.endDate')}
        </DateQuickWrap>
        <DateQuickWrap
          isActive={getIsMatching(5)}
          onClick={() => onClickDate(5)}
        >
          {t('common.null')}11
        </DateQuickWrap>
      </div>
    )
  }
  return (
    <DatePicker.RangePicker
      placement={props?.placement}
      value={props.dateValue}
      allowClear={props.hasClear ?? true}
      style={{
        width: props.isWidth ? '' : props.width ? props.width : '100%',
      }}
      popupClassName={customPopup(props.w)}
      onChange={onChangeDate}
      className={rangPicker}
      getPopupContainer={node => node}
      format={(times: moment.Moment) => {
        if (times.unix() === -28800 || times.unix() === 1893427200) {
          return t('common.null')
        }
        return times.format('YYYY-MM-DD')
      }}
      disabledDate={onHandleData}
      renderExtraFooter={props.isShowQuick ? renderExtraFooter : (null as any)}
    />
  )
}

export default RangePicker
