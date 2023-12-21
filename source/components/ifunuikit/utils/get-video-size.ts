const getVideoSize = (file: File) => {
  return new Promise<{ duration: number; width: number; height: number }>(
    resolve => {
      const element = document.createElement('video')
      element.preload = 'metadata'
      element.addEventListener('loadedmetadata', event => {
        resolve({
          duration: element.duration,
          width: element.videoWidth,
          height: element.videoHeight,
        })
      })
      element.src = URL.createObjectURL(file)
    },
  )
}

export default getVideoSize
