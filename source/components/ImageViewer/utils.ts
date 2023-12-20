interface ImageInfo {
  width: number
  height: number
  /**
   *  文件大小，以字节为单位
   */
  size: number
}

export async function getImageInfo(url: string): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    // 在图片加载完成后执行
    img.onload = () => {
      const width = img.width
      const height = img.height

      // 通过 HTTP 请求获取文件头信息，获取文件大小
      fetch(url, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            const size = Number(response.headers.get('Content-Length'))
            resolve({ width, height, size })
          } else {
            reject(new Error('Failed to fetch image size.'))
          }
        })
        .catch(error => {
          reject(error)
        })
    }

    // 如果图片加载失败
    img.onerror = () => {
      reject(new Error('Failed to load image.'))
    }

    // 设置图片的 source 属性，触发加载
    img.src = url
  })
}

export function downloadImage(
  url: string,
  fileName = 'downloaded-image',
): void {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    let urlCreator = window.URL || window.webkitURL
    let imageUrl = urlCreator.createObjectURL(this.response)
    let tag = document.createElement('a')
    tag.href = imageUrl
    tag.download = fileName
    document.body.appendChild(tag)
    tag.click()
    document.body.removeChild(tag)
  }
  xhr.send()
}
