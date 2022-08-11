/* eslint-disable consistent-return */
/* eslint-disable no-lonely-if */
/* eslint-disable require-atomic-updates */
/* eslint-disable complexity */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/naming-convention */
import urls, { type UrlKeys } from '@/constants/urls'
import { getTicket } from '@/services/user'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'
import { message } from 'antd'
import { env } from 'process'
import { decrypt, encrypt } from './crypto'
import { decryptPhp, encryptPhp } from './cryptoPhp'

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

const isCheckTicket = async (isPass: boolean) => {
  if (isPass) {
    return true
  }
  return new Promise(resolve => {
    const timer = setInterval(() => {
      const isCheckTicketValue = !!sessionStorage.getItem('IS_CHECK_TICKET')
      if (!isCheckTicketValue) {
        resolve(true)
        clearInterval(timer)
      }
    })
  })
}

client.config({
  base: import.meta.env.__API_BASE_URL__,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  requestInterceptors: [
    async options => {
      await isCheckTicket(
        options.url ===
          `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket` ||
          (options.extra as any)?.isLogin,
      )
      options.headers.Authorization = localStorage.getItem('agileToken') || ''
      options.headers.Language = localStorage.getItem('language') || ''
      options.headers.System = getSystem()
      options.headers.Client = browser()
      options.payload = JSON.stringify(options.payload)
      if (
        options.url === `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket`
      ) {
        if (import.meta.env.MODE !== 'development') {
          options.payload = encrypt(options.payload as string)
        }
      } else {
        if (import.meta.env.MODE !== 'development') {
          if (JSON.stringify(options.search) !== '{}') {
            options.search = { p: encryptPhp(JSON.stringify(options.search)) }
          } else if (options.payload !== 'null') {
            options.payload = { p: encryptPhp(options.payload as string) }
          }
        }
      }
    },
  ],
  responseInterceptors: [
    (response: any, options: any) => {
      if (
        options.url === `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket`
      ) {
        if (import.meta.env.MODE !== 'development') {
          return JSON.parse(decrypt((response as { body: string }).body))
        }
      } else if (import.meta.env.MODE !== 'development') {
        return JSON.parse(
          decryptPhp(JSON.parse((response as { body: string }).body).p),
        )
      }
      return JSON.parse((response as { body: string }).body)
    },

    (data: any) => {
      if (

        // data.code === '00000' ||
        data.code === 'A0204' ||
        data.code === 'A0203' ||
        data.code === 'A0202' ||
        data.code === 'A0201' ||
        data.code === 'A0200' ||
        data.code === 'A0100' ||
        data.code === 'A0001'
      ) {
        setTimeout(() => {
          localStorage.removeItem('agileToken')
          localStorage.removeItem('saveRouter')
          getTicket()
        }, 500)
      }
      if (data.code !== '00000' && data.code !== 1 && data.code !== 0) {
        message.error(data.message)
        throw new Error(data.code)
      }
      // eslint-disable-next-line consistent-return
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
  options?: any,
) => {
  return client.get<SearchParams, Result>(urls[key], data, options)
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
