import { API_BASE_URL } from '../constants/config'
import client from '@jihe/http-client'
import { message } from 'antd'

client.config({
  base: API_BASE_URL,
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json; charset=UTF-8',
  },
  requestInterceptors: [
    options => {
      options.payload = JSON.stringify(options.payload)
      const token = localStorage.getItem('TOKEN')
      if (token) {
        options.headers.Authorization = `Bearer ${token}`
      }
    },
  ],
  responseInterceptors: [
    (data: any) => JSON.parse(data.body),
    (data: any) => {
      if (data.code) {
        message.error(data.msg)
        if (data.code === 10000004) {
          // eslint-disable-next-line no-throw-literal
          throw { message: 'UnauthorizedError' }
        }
        throw new Error(data.msg)
      }
      return data.data
    },
  ],
})

const http = {
  get: client.get,
  delete: client.delete,
  post: client.post,
  put: client.put,
  patch: client.patch,
}

export default http
