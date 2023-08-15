import React, { useRef, useEffect, useState } from 'react'

const TruncateTextWithEllipsis = (props: any) => {
  const { text, maxWidth } = props
  const ref = useRef<any>(null)
  const [truncatedText, setTruncatedText] = useState(text)

  useEffect(() => {
    if (ref.current) {
      const containerWidth = ref.current?.offsetWidth
      const textWidth = getWidthOfText(text)

      if (textWidth > containerWidth) {
        const ellipsisWidth = getWidthOfText('...')
        const halfContainerWidth = (containerWidth - ellipsisWidth) / 2

        let front = ''
        let back = ''
        let frontWidth = 0
        let backWidth = 1
        let i = 0

        while (i < text.length) {
          const charWidth = getWidthOfText(text[i])

          if (frontWidth + charWidth <= halfContainerWidth) {
            front += text[i]
            frontWidth += charWidth
          } else {
            break
          }

          i++
        }

        i = text.length - 1

        while (i >= 0) {
          const charWidth = getWidthOfText(text[i])

          if (backWidth + charWidth <= halfContainerWidth) {
            back = text[i] + back
            backWidth += charWidth
          } else {
            break
          }

          i--
        }

        setTruncatedText(`${front}...${back}`)
      }
    }
  }, [text, maxWidth])

  // 获取字符串的宽度
  const getWidthOfText = (text: any) => {
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.textContent = text
    document.body.appendChild(span)
    const width = span.offsetWidth
    document.body.removeChild(span)
    return width
  }

  return <div ref={ref}>{truncatedText}</div>
}

export default TruncateTextWithEllipsis
