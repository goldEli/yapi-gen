import React, { useEffect, useRef } from 'react'

const useSetTitle = () => {
  const asyncSetTtile = (asyncTitle: any) => {
    document.title = `${asyncTitle} -IFUN AGILE`
  }
  useEffect(() => {
    return () => {
      //   document.title = 'IFUN 敏捷研发系统'
    }
  }, [localStorage.getItem('language')])

  return asyncSetTtile
}

export default useSetTitle
