import React from 'react'

import { useTranslation } from 'react-i18next'
const useI18n = () => {
  const [t] = useTranslation()
  return { t }
}

export default useI18n
