/* eslint-disable @typescript-eslint/naming-convention */
import React, { type ReactNode, useContext } from 'react'
import hash from 'object-hash'
import { Context } from '../business/files-transfer-provider'
import { ProgressInfo } from 'cos-js-sdk-v5'

interface CustomFile extends File {
  taskId?: string
  uploadKey?: string
}

interface UseFilesTransferOptions {
  bucket: string
  region: string
  prefix?: string | ((file: File) => string)
  generateUploadPath?(file: File): string
}

/**
 * 文件传输钩子
 * @function
 * @param {Object} options
 * @param {string} options.bucket COS 存储桶
 * @param {string} options.region COS 存储区
 * @param {?string} options.prefix COS 存储前缀
 * @param {?function} options.generateUploadPath COS 存储前缀
 */
const useFilesTransfer = (options: UseFilesTransferOptions) => {
  const generateUploadPath = options.generateUploadPath ?? hash
  const context = useContext(Context)

  const actions = {
    async upload(
      files: CustomFile[],
      onFinish?: (file: CustomFile, url: string) => void,
      onProgress?: (file: CustomFile, progress: ProgressInfo) => void,
    ) {
      const result = await context?.cos.uploadFiles({
        SliceSize: 1,
        files: files.map(file => {
          let key = file.uploadKey
          if (!key) {
            key =
              ((typeof options.prefix === 'function'
                ? options.prefix(file)
                : options.prefix) || '') + generateUploadPath(file)
            file.uploadKey = key
          }
          return {
            Bucket: options.bucket,
            Region: options.region,
            Key: key,
            Body: file,
            ContentDisposition: `attachment;filename=${encodeURIComponent(
              file.name,
            )}`,
            onTaskReady(taskId: string) {
              file.taskId = taskId
              if (context) {
                context.taskNameMap[taskId] = file.name
              }
            },
            onProgress(info) {
              onProgress?.(file, info)
            },
            onFileFinish(error, data) {
              onFinish?.(file, `https://${data.Location}`)
            },
          }
        }),
      })
      return result?.files?.map(i => ({
        bucket: i.options.Bucket,
        region: i.options.Region,
        key: i.options.Key,
        url: `https://${i.data.Location}`,
      }))
    },
    uploadToKey(
      files: CustomFile[],
      onFinish?: (file: CustomFile, url: string) => void,
      onProgress?: (file: CustomFile, progress: ProgressInfo) => void,
    ) {
      files.forEach(file => {
        file.uploadKey =
          ((typeof options.prefix === 'function'
            ? options.prefix(file)
            : options.prefix) || '') + generateUploadPath(file)
      })
      actions.upload(files, onFinish, onProgress)
      return files.map(i => i.uploadKey)
    },
    download(urls: string | string[]) {
      if (Array.isArray(urls)) {
        urls.forEach(i => window.open(i))
      } else {
        window.open(urls)
      }
    },
    updateTaskStatus(taskId: string, status?: ReactNode) {
      if (!context) {
        return false
      }
      context.setTaskStatusMap(oldValue => ({ ...oldValue, [taskId]: status }))

      return true
    },
  }

  return actions
}

export default useFilesTransfer
