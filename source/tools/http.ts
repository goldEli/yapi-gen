/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/naming-convention */
import urls, { type UrlKeys } from '@/constants/urls'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'
import { message } from 'antd'

client.config({
  base: import.meta.env.__API_BASE_URL__,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  requestInterceptors: [
    options => {
      options.headers.Authorization =
        localStorage.getItem('token') || '670f96006642dcb616610358568c6503'
      options.headers.System = 'win10'
      options.headers.Client = 'chrome'
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return JSON.parse(response.body)
    },
    (data: any) => {
      if (data.code !== '00000') {
        message.error(data.msg)
        throw new Error('error')
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
