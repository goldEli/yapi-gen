/* eslint-disable @typescript-eslint/no-explicit-any */
import http from './http'
import COS from 'cos-js-sdk-v5'
import generateCOSFileKey from './generate-cos-file-key'

const getCosSign = async () => {
  const response: any = await http.get('/api/thirdpartys/cos/getSign')

  return {
    credentials: {
      tmpSecretId: response.info.config.credentials.tmpSecretId,
      tmpSecretKey: response.info.config.credentials.tmpSecretKey,
      sessionToken: response.info.config.credentials.sessionToken,
      startTime: response.info.config.startTime,
      expiredTime: response.info.config.expiredTime,
    },
    config: {
      bucket: response.info.bucket,
      region: response.info.region,
    },
  }
}

export const getAuthorization = async (options: any, callback: any) => {
  const data = await getCosSign()
  /* eslint-disable @typescript-eslint/naming-convention */
  callback({
    TmpSecretId: data.credentials.tmpSecretId,
    TmpSecretKey: data.credentials.tmpSecretKey,
    XCosSecurityToken: data.credentials.sessionToken,
    StartTime: data.credentials.startTime,
    ExpiredTime: data.credentials.expiredTime,
    ScopeLimit: true,
  })
}

export const cos = new COS({
  getAuthorization,
})
interface CosConfig {
  bucket: string
  region: string
}

let localCOSConfig: CosConfig | undefined

const getCosConfig = async (): Promise<CosConfig> => {
  if (localCOSConfig) {
    return localCOSConfig
  }
  const { config } = await getCosSign()
  // eslint-disable-next-line require-atomic-updates
  localCOSConfig = config
  return localCOSConfig
}

export const uploadFile = async (
  file: File,
  key = generateCOSFileKey(file),
) => {
  const config = await getCosConfig()

  const { Location } = await cos.uploadFile({
    Bucket: config.bucket,
    Region: config.region,
    Key: key,
    Body: file,
    onFileFinish(error, data) {
      cos.emit('fileUpload', {
        key,
        file,
        url: `https://${data.Location}`,
      })
    },
  })

  return {
    key,
    url: `https://${Location}`,
  }
}

// 单个文件上传
export const uploadFileAsync = (file: File) => {
  const key = generateCOSFileKey(file)
  uploadFile(file, key)
  return key
}

// 批量文件上传
export const uploadFilesAsync = (files: File[]) => {
  return files.map(item => {
    const key = generateCOSFileKey(item)
    uploadFile(item, key)
    return key
  })
}
