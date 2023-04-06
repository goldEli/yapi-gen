import React from 'react'
import { getStyleValue } from '../utils'
const useMaxWidth = () => {
  const [maxWidth, setMaxWidth] = React.useState(0)
  React.useEffect(() => {
    const timeScale = document.querySelector('.time-scale')
    if (!timeScale) {
      return
    }
    const width = Math.floor(getStyleValue(timeScale, 'width') - 58) / 7
    setMaxWidth(width)
  }, [])

  return { maxWidth }
}

export default useMaxWidth
