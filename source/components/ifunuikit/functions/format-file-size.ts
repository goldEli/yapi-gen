const units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

/**
 * 对文件大小进行格式化
 * @param size number 文件大小
 * @param zeroString string 文件大小为 0 显示字符串
 * @returns string 格式化后的文件文件大小
 */
const formatFileSize = (size?: number, zeroString = '0B') => {
  if (!size) {
    return zeroString
  }
  const index = Math.floor(Math.log(size) / Math.log(1024))
  return `${+(size / 1024 ** index).toFixed(2)}${units[index]}B`
}

export default formatFileSize
