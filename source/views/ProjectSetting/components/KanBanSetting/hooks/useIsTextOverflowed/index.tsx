import React, { useEffect, useRef, useState } from 'react'

const useIsTextOverflowed = (text: string) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [isTextOverflowed, setIsTextOverflowed] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (element && element.clientWidth < element.scrollWidth) {
      setIsTextOverflowed(true)
    } else {
      setIsTextOverflowed(false)
    }
  }, [text])

  return {
    textRef,
    isTextOverflowed,
  }
}

export default useIsTextOverflowed
