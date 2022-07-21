import urls, { type UrlKeys } from '@/constants/urls'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'

client.config({
  base: 'http://dev.staryuntech.com/',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  requestInterceptors: [
    options => {
      options.headers.Token = localStorage.getItem('token') || ''
      options.headers.System = 'win10'
      options.headers.Client = 'chrome'
    },
  ],
})

export const get = <SearchParams extends HttpRequestSearch, Result = any>(
  key: UrlKeys,
  data?: any,
) => {
  return client.get<SearchParams, Result>(urls[key], data)
}

export const post = <Payload, Result>(key: UrlKeys, data: any) => {
  return client.post<Payload, Result>(urls[key], data)
}

export const put = <Payload, Result>(key: UrlKeys, data: any) => {
  return client.put<Payload, Result>(urls[key], data)
}

const deleteMethod = <Payload, Result>(key: UrlKeys, data: any) => {
  return client.delete<Payload, Result>(urls[key], data)
}

export { deleteMethod as delete }
