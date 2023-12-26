const pickFiles = (options?: {
  accept?: string
  multiple?: boolean
}): Promise<File[]> => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = options?.accept || ''
  input.multiple = options?.multiple || false
  return new Promise((resolve, reject) => {
    // const onWindowFocus = () => {
    //   window.removeEventListener('focus', onWindowFocus)
    //   setTimeout(() => reject('Cancel Pick'), 300)
    // }
    // window.addEventListener('focus', onWindowFocus)
    input.onchange = () => resolve(Array.from(input.files || []))
    input.click()
  })
}

export default pickFiles
