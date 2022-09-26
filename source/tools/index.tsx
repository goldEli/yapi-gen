/* eslint-disable no-negated-condition */
import { decryptPhp } from './cryptoPhp'

function getIsPermission(arr: any, value: string) {
  return !arr?.filter((i: any) => i.identity === value).length
}

function openDetail(url: string) {
  if (import.meta.env.MODE !== 'production') {
    window.open(`${window.origin}${import.meta.env.__URL_ALIAS__}${url}`)
  } else {
    window.open(`${window.origin}${url}`)
  }
}

function getParamsData(params: any) {
  return JSON.parse(decryptPhp(params.get('data') as string))
}
const transData = (jsonArr: any, idStr: any, pidStr: any, childrenStr: any) => {
  const result = []
  const id = idStr
  const pid = pidStr
  const children = childrenStr
  const len = jsonArr.length

  const hash = {}
  jsonArr.forEach(item => {
    hash[item[id]] = item
  })

  for (let j = 0; j < len; j++) {
    const jsonArrItem = jsonArr[j]
    const hashItem = hash[jsonArrItem[pid]]
    if (hashItem) {
      !hashItem[children] && (hashItem[children] = [])
      hashItem[children].push(jsonArrItem)
    } else {
      result.push(jsonArrItem)
    }
  }
  return result
}

export { getIsPermission, openDetail, getParamsData, transData }
