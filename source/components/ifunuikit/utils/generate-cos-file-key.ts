/* eslint-disable prefer-named-capture-group */
import { COS_KEY_TEMPLATE } from '../constants/config'
import hash from 'object-hash'

const generateCOSFileKey = (file: File) => {
  const data: Record<string, string> = {
    date: new Date().toISOString().slice(0, 10),
    contentHash: hash(file),
    extension: file.name.split('.').pop() || '',
  }

  return COS_KEY_TEMPLATE.replace(
    /\\<(\w+)\\>/gu,
    (match: string, paramKey: string) => {
      return data[paramKey] || ''
    },
  )
}

export default generateCOSFileKey
