/* eslint-disable no-undefined */
/* eslint-disable no-lonely-if */
/* eslint-disable require-atomic-updates */
/* eslint-disable complexity */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/naming-convention */
import { getMessage } from '@/components/Message'
import urls, { type UrlKeys } from '@/constants/urls'
import { getTicket } from '@/services/user'
import client from '@jihe/http-client'
import { type HttpRequestSearch } from '@jihe/http-client/typings/types'
import { message } from 'antd'
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
    async (options: any) => {
      const line = window.navigator.onLine
      if (!line) {
        location.reload()
      }
      await isCheckTicket(
        options.url ===
          `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket` ||
          (options.extra as any)?.isLogin,
      )

      options.headers.Authorization = localStorage.getItem('agileToken') || ''
      options.headers.Language = localStorage.getItem('language') || ''
      options.headers.System = getSystem()
      options.headers.Client = browser()
      options.headers.timestamp = Math.floor(new Date().valueOf() / 1000)
      if (!(options.payload instanceof FormData)) {
        options.payload = JSON.stringify(options.payload)
      }
      if (
        options.url === `${import.meta.env.__API_ORIGIN__}/api/auth/checkTicket`
      ) {
        if (import.meta.env.MODE !== 'development') {
          options.payload = encrypt(options.payload as string)
        }
      } else if (options.url !== import.meta.env.__COS_SIGN_URL__) {
        if (import.meta.env.MODE !== 'development') {
          if (
            Object.prototype.toString.call(options.payload) !==
            '[object FormData]'
          ) {
            if (JSON.stringify(options.search) !== '{}') {
              options.search = { p: encryptPhp(JSON.stringify(options.search)) }
            } else if (
              options.payload !== 'null' &&
              options.payload !== null &&
              options.payload !== 'undefined' &&
              options.payload !== undefined &&
              options.payload !== '{}'
            ) {
              options.payload = JSON.stringify({
                p: encryptPhp(options.payload as string),
              })
            }
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
      } else if (
        import.meta.env.MODE !== 'development' &&
        options.url !== import.meta.env.__COS_SIGN_URL__
      ) {
        if (options.responseType === 'blob') {
          return response
        }
        return JSON.parse(
          decryptPhp(JSON.parse((response as { body: string }).body).p),
        )
      }
      return options.responseType === 'blob'
        ? response
        : JSON.parse((response as { body: string }).body)
    },

    (data: any, options: any) => {
      if (options.responseType === 'blob') {
        return data
      }
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
          localStorage.removeItem('quickCreateData')
          localStorage.clear()
          location.replace(`${location.origin}/login`)
          // getTicket()
        }, 500)
      }
      // A0301特殊处理-私有项目没有权限查看
      if (
        data.code !== '00000' &&
        data.code !== 1 &&
        data.code !== 0 &&
        data.code !== 'A0301' &&
        data.code !== 'B0015'
      ) {
        if (data.code === 'A0203') {
          const lang = localStorage.getItem('language')

          getMessage({
            msg:
              lang === 'zh'
                ? '检测到您没有登录，正在为您跳转到登录页面'
                : 'We have detected that you are not logged in and are redirecting you to the login page',
            type: 'error',
          })
        } else {
          getMessage({ msg: data.msg ?? data.message, type: 'error' })
        }

        return Promise.reject()
      }
      return {
        code: data.code === 'B0015' ? data.code : Number(data.code),
        data: data.data,
        msg: data.msg,
        message: data.msg,
      }
    },
  ],
})

type ResponseData<T> = {
  category_status: any
  code:
    | 'A0204'
    | 'A0203'
    | 'A0202'
    | 'A0201'
    | 'A0200'
    | 'A0100'
    | 'A0001'
    | 'A0301'
    | 0
    | 1
    | '00000'
    | 'B0001'
  msg: string
  data: T
}

export const get = <SearchParams extends HttpRequestSearch, Result = any>(
  key: UrlKeys | string,
  data?: any,
  options?: any,
) => {
  return client.get<SearchParams, ResponseData<Result>>(
    (urls[key as UrlKeys] || key) as string,
    data,
    options,
  )
}

export const post = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
  options?: any,
) => {
  return client.post<Payload, ResponseData<Result>>(
    (urls[key as UrlKeys] || key) as string,
    data,
    options,
  )
}

export const put = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
  options?: any,
) => {
  return client.put<Payload, ResponseData<Result>>(
    (urls[key as UrlKeys] || key) as string,
    data,
    {
      search: options,
    },
  )
}
export const patch = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
) => {
  return client.patch<Payload, ResponseData<Result>>(
    (urls[key as UrlKeys] || key) as string,
    data,
  )
}

const deleteMethod = <Payload, Result = any>(
  key: UrlKeys | string,
  data?: any,
) => {
  return client.delete<Payload, ResponseData<Result>>(
    (urls[key as UrlKeys] || key) as string,
    data,
  )
}

export { deleteMethod as delete }
