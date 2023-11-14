/* eslint-disable no-async-promise-executor */
/* eslint-disable max-params */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

// cos上传

import * as http from '../tools/http'
import COS, { type Task, type UploadFileItemResult } from 'cos-js-sdk-v5'
import moment from 'moment'

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c =>
    // @ts-expect-error
    (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16),
  )
}

/**
 * 转换文件大小
 */
export const formatFileSize = (val: number) => {
  if (val === 0) {
    return '0B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'PB', 'TB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(val) / Math.log(k))
  return `${String((val / k ** i).toPrecision(3))}${sizes[i]}`
}
let cache: { credentials: any } | null = null

const getCosSign = async (): Promise<any> => {
  if (cache && Date.now()) {
    // 如果缓存中存在有效的临时密钥，则直接返回
    return cache.credentials
  }
  const response = await http.get<any, any>('getCosSign')
  const credentials = {
    tmpSecretId: response.data.info.config.credentials.tmpSecretId,
    tmpSecretKey: response.data.info.config.credentials.tmpSecretKey,
    sessionToken: response.data.info.config.credentials.sessionToken,
    startTime: response.data.info.config.startTime,
    expiredTime: response.data.info.config.expiredTime,
  }
  // eslint-disable-next-line require-atomic-updates
  cache = {
    credentials,
  }

  return credentials

  // return response.data?.info
}

export const cos = new COS({
  FileParallelLimit: 10,
  ChunkParallelLimit: 10,
  getAuthorization: async (options: any, callback: any) => {
    const credentials = await getCosSign()

    callback({
      TmpSecretId: credentials.tmpSecretId,
      TmpSecretKey: credentials.tmpSecretKey,
      XCosSecurityToken: credentials.sessionToken,
      StartTime: credentials.startTime,
      ExpiredTime: credentials.expiredTime,
      ScopeLimit: true,
    })
  },
})

// 获取文件后缀
export function getFileSuffix(name: string, withDot = false) {
  const fileSuffix = name.split('.').pop()?.toLowerCase()
  return fileSuffix?.length ? `${withDot ? '.' : ''}${fileSuffix}` : ''
}

export const uploadFile = (file: File, fileName?: any, scope?: string) => {
  let id = ''
  let files: any = ''
  return new Promise<any>((resolve, reject) => {
    cos.uploadFile({
      Body: file,
      Bucket: import.meta.env.__COS_BUCKET__,
      Region: import.meta.env.__COS_REGION__,
      Key: `${import.meta.env.__COS_PREFIX__}${new Date().getTime()}/${
        fileName || file.name
      }`,
      onTaskReady(taskId) {
        id = taskId
      },
      onTaskStart(task: Task) {
        files = {
          id: task.id,
          state: task.state,
          loaded: task.loaded,
          percent: task.percent,
          scope,

          name: fileName || file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          suffix: getFileSuffix(file.name),

          time: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        }
        resolve({
          id: task.id,
          state: task.state,
          loaded: task.loaded,
          percent: task.percent,
          file: {
            scope,
            id: getUUID(),
            name: fileName || file.name,
            size: file.size,
            formattedSize: formatFileSize(file.size),
            suffix: getFileSuffix(file.name),
            url: '',
            time: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
          },
        })
      },
      onFileFinish(error: Error, data) {
        if (error) {
          reject(error)
        } else {
          cos.emit('task-over', {
            id,
            files,
            url: `https://${data.Location}`,
          })
        }
      },
    })
  })
}

export const uploadFileToKey = (
  file: File,
  fileName?: any,
  onEnd?: (data: { key: string; url: string }) => void,
) => {
  const key = `${import.meta.env.__COS_PREFIX__}${new Date().getTime()}/${
    fileName || file.name
  }`
  cos.uploadFile({
    Body: file,
    Bucket: import.meta.env.__COS_BUCKET__,
    Region: import.meta.env.__COS_REGION__,
    Key: key,
    onFileFinish(error: Error, data: UploadFileItemResult) {
      if (!error) {
        onEnd?.({
          key,
          url: `https://${data.Location}`,
        })

        // resolve({
        //   space,
        //   id: getUUID(),
        //   name: file.name,
        //   size: file.size,
        //   formattedSize: formatFileSize(file.size),
        //   suffix: getFileSuffix(file.name),
        //   url: `https://${data.Location}`,
        //   time: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
        // })
      }
    },
  })
  return key
}

export const uploadFileByTask = (file: File, space: string, fileName?: any) => {
  return new Promise<any>((resolve, reject) => {
    cos.uploadFile({
      Body: file,
      Bucket: import.meta.env.__COS_BUCKET__,
      Region: import.meta.env.__COS_REGION__,
      Key: `${import.meta.env.__COS_PREFIX__}${new Date().getTime()}/${
        fileName || file.name
      }`,
      onFileFinish(error: Error, data: UploadFileItemResult) {
        if (error) {
          reject(error)
        } else {
          resolve({
            space,
            id: getUUID(),
            name: file.name,
            size: file.size,
            formattedSize: formatFileSize(file.size),
            suffix: getFileSuffix(file.name),
            url: `https://${data.Location}`,
            time: moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
          })
        }
      },
    })
  })
}
