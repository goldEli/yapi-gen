/* eslint-disable require-unicode-regexp */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-named-capture-group */

import CommonIconFont from '@/components/CommonIconFont'
import Sort from '@/components/Sort'
import { Tooltip } from 'antd'

//时间格式化
const formatterDate = (date: any, fmt: string) => {
  let nowDate: any = {
    yyyy: date.getFullYear(),
    MM: date.getMonth() + 1,
    dd: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }
  for (var k in nowDate) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? nowDate[k]
          : ('00' + nowDate[k]).substr(('' + nowDate[k]).length),
      )
    }
  }
  return fmt
}
// 获取上几个月的时间 年-月-日
export function getMonthBefor(num: number) {
  let resultDate, year, month, date, hms
  let currDate = new Date()
  year = currDate.getFullYear()
  month = currDate.getMonth() + 1
  date = currDate.getDate()
  hms =
    currDate.getHours() +
    ':' +
    currDate.getMinutes() +
    ':' +
    (currDate.getSeconds() < 10
      ? '0' + currDate.getSeconds()
      : currDate.getSeconds())
  switch (month) {
    case 1:
    case 2:
    case 3:
      month += 9
      year--
      break
    default:
      month -= num
      break
  }
  month = month < 10 ? '0' + month : month
  resultDate = year + '-' + month + '-' + date
  let endTime: any = new Date(Date.now())
  const days = {
    startTime: resultDate,
    endTime: formatterDate(endTime, 'yyyy-MM-dd'),
  }
  return days
}

// 获取当前时间的前几天
export const getDays = (num: number) => {
  let oneDay: number = 24 * 60 * 60 * 1000
  let endTime: any = new Date(Date.now())
  endTime = formatterDate(endTime, 'yyyy-MM-dd')
  let startTime: any = new Date(Date.now() - num * oneDay)
  startTime = formatterDate(startTime, 'yyyy-MM-dd')
  const days = {
    startTime,
    endTime,
  }
  return days
}
export const getDate = (type: string) => {
  let date = 0
  switch (type) {
    case 'one_month':
      date = 1
      break
    case 'three_month':
      date = 3
      break
    case 'six_month':
      date = 6
      break
    case 'two_week':
      date = 14
      break
    case 'four_week':
      date = 28
      break
    default:
      date = 0
      break
  }
  return date
}
export const getDateStr = (type: number) => {
  let date = ''
  switch (type) {
    case 1:
      date = 'one_month'
      break
    case 3:
      date = 'three_month'
      break
    case 6:
      date = 'six_month'
      break
    case 14:
      date = 'two_week'
      break
    case 28:
      date = 'four_week'
      break
    default:
      date = ''
      break
  }
  return date
}

export const getTimeStr = (time: { type: number; time: any }) => {
  switch (time.type) {
    case 1:
      return 'one_month'
    case 3:
      return 'three_month'
    case 6:
      return 'six_month'
    case 14:
      return 'two_week'
    case 28:
      return 'four_week'
    default:
      return ''
  }
}

// 进展对比tips
export const getTitleTips = (text: string, tips: string, position?: string) => {
  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {text}
      <Tooltip
        title={tips}
        placement={position === 'right' ? 'topRight' : 'top'}
        trigger="click"
      >
        <div
          style={{
            width: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CommonIconFont type="question" size={16} />
        </div>
      </Tooltip>
    </div>
  )
}
