import urls, { type UrlKeys } from '@/constants/urls'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'

client.config({
  base: 'http://dev.staryuntech.com/',
})

export const get = <SearchParams extends HttpRequestSearch, Result>(
  key: UrlKeys,
  data: any,
) => {
  return client.get<SearchParams, Result>(urls[key], data)
}

export const post = <Payload, Result>(key: UrlKeys, data: any) => {
  return client.post<Payload, Result>(urls[key], data)
}
