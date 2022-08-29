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

export { getIsPermission, openDetail, getParamsData }
