import { useEffect, useState } from 'react'

const useInputStatus = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)

  useEffect(() => {
    const handleFocus = () => {
      setIsInputFocused(true)
    }

    const handleBlur = () => {
      setIsInputFocused(false)
    }

    // 监听全局的输入焦点事件
    document.addEventListener('focus', handleFocus)
    document.addEventListener('blur', handleBlur)

    return () => {
      // 在组件卸载时移除事件监听器
      document.removeEventListener('focus', handleFocus)
      document.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isInputFocused
}

export default useInputStatus
