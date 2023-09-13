import { useEffect, useState } from 'react'

const useInputStatus = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  useEffect(() => {
    const handleFocus = (e: any) => {
      setIsInputFocused(true)
    }

    const handleBlur = () => {
      setIsInputFocused(false)
    }

    // 监听全局的输入焦点事件
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      // 在组件卸载时移除事件监听器
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])

  return isInputFocused
}

export default useInputStatus
