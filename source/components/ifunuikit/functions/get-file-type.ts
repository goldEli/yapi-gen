import getFilenameSuffix from './get-filename-suffix'

const types: Record<
  string,
  'image' | 'audio' | 'video' | 'doc' | 'xls' | 'ppt' | 'pdf'
> = {
  jpg: 'image',
  png: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  mp3: 'audio',
  mp4: 'video',
  doc: 'doc',
  docx: 'doc',
  xls: 'xls',
  xlsx: 'xls',
  ppt: 'ppt',
  pptx: 'ppt',
  pdf: 'pdf',
}

/**
 * 获取文件类型
 * @param filename string 文件名、可包含路径
 * @param defaultValue string 获取文件类型失败后的缺省值
 * @returns string 文件类型
 */
const getFileType = (filename?: string, defaultValue = 'unknown') => {
  if (!filename) {
    return defaultValue
  }
  const suffix = getFilenameSuffix(filename)
  return types[suffix] || defaultValue
}

export default getFileType
