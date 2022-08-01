/* eslint-disable complexity */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/naming-convention */
import urls, { type UrlKeys } from '@/constants/urls'
import { getTicket } from '@/services/user'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'
import { message } from 'antd'

const { userAgent } = window.navigator
const getSystem = () => {
  if (userAgent.indexOf('Window') > 0) {
    return 'Windows'
  } else if (userAgent.indexOf('Mac OS X') > 0) {
    return 'Mac '
  } else if (userAgent.indexOf('Linux') > 0) {
    return 'Linux'
  }
  return 'Other'
}

const browser = () => {
  if (userAgent.indexOf('MSIE') >= 0) {
    return 'Ie'
  } else if (userAgent.indexOf('Firefox') >= 0) {
    return 'Firefox'
  } else if (userAgent.indexOf('Chrome') >= 0) {
    return 'Chrome'
  } else if (userAgent.indexOf('Opera') >= 0) {
    return 'Opera'
  } else if (userAgent.indexOf('Safari') >= 0) {
    return 'Safari'
  }
  return 'Other'
}

client.config({
  base: import.meta.env.__API_BASE_URL__,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  requestInterceptors: [
    options => {
      options.headers.Authorization =
        localStorage.getItem('token') || '8e2e944977381b1156d40c5903cde511'
      options.headers.System = getSystem()
      options.headers.Client = browser()
      options.payload = JSON.stringify(options.payload)
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return JSON.parse((response as { body: string }).body)
    },
    (data: any) => {
      if (data.code === 'A0203' || data.code === 'A0202') {
        localStorage.removeItem('token')
        getTicket()
      }
      if (data.code !== '00000' && data.code !== 1 && data.code !== 0) {
        message.error(data.message)
        throw new Error(data.code)
      }
      return {
        code: Number(data.code),
        data: data.data,
        message: data.msg,
      }
    },
  ],
})

export const get = <SearchParams extends HttpRequestSearch, Result = any>(
  key: UrlKeys,
  data?: any,
) => {
  return client.get<SearchParams, Result>(urls[key], data)
}

export const post = <Payload, Result = any>(key: UrlKeys, data?: any) => {
  return client.post<Payload, Result>(urls[key], data)
}

export const put = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
) => {
  return client.put<Payload, Result>(urls[key as UrlKeys] || key, data)
}

export const patch = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
) => {
  return client.patch<Payload, Result>(urls[key as UrlKeys] || key, data)
}

const deleteMethod = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
) => {
  return client.delete<Payload, Result>(urls[key as UrlKeys] || key, data)
}

export { deleteMethod as delete }
