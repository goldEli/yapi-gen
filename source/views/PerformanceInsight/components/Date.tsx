/* eslint-disable require-unicode-regexp */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-named-capture-group */
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
  console.log(resultDate, 'resultDate')
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
  console.log()
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
