/**
 * 获取文件后缀
 * @param filename string 文件名、可包含路径
 * @returns string 后缀
 */
const getFilenameSuffix = (filename?: string) => {
  if (!filename) {
    return ''
  }
  return filename.split('.').pop()?.toLowerCase() || ''
}

export default getFilenameSuffix
