const getImageSize = (image: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = function (event: ProgressEvent<FileReader>) {
      const url = event.target?.result as string
      const imageElement = new Image()
      imageElement.onerror = () => {
        reject()
      }
      imageElement.onload = () => {
        resolve({
          width: imageElement.naturalWidth,
          height: imageElement.naturalHeight,
        })
      }
      imageElement.src = url
    }
    reader.readAsDataURL(image)
  })

export default getImageSize
