/**
 * 翻译钩子
 */
import { useContext } from 'react'
import { Context } from '../components/config-provider'
import { get } from 'lodash'

const useTranslation = () => {
  const context = useContext(Context)
  const translation = (key: string, defaultValue: string = key) =>
    get(context?.locale, key, defaultValue)
  return [translation] as const
}

export default useTranslation
