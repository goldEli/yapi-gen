import * as services from '../services'

export default () => {
  const { uploadFile, uploadFileByTask, cos } = services.cos
  return {
    cos,
    uploadFile,
    uploadFileByTask,
  }
}
