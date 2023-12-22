import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh.json'
import antdZh from 'antd/lib/locale/zh_CN'
import type { Locale } from 'antd/lib/locale-provider'
import 'moment/dist/locale/zh-cn'

let currentLanguage = 'zh'

const locals = {
  zh: () => import('./zh.json'),
  en: () => import('./en.json'),
}

type LocaleKeys = keyof typeof locals

const antdLocals = {
  zh: () => import('antd/lib/locale/zh_CN'),
  en: () => import('antd/lib/locale/en_US'),
}

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: zh,
    },
  },
  lng: 'zh',
  fallbackLng: 'zh',

  interpolation: {
    escapeValue: false,
  },
})

const loadI18nLanguage = async (language: LocaleKeys) => {
  const loader = locals[language]
  const data = await loader()
  i18n.addResourceBundle(language, 'translation', data)
}

const loadedAntdLocals: Record<string, Locale> = {
  zh: antdZh,
}

const loadAntdLanguage = async (language: LocaleKeys) => {
  const loader = antdLocals[language]
  const data = await loader()
  loadedAntdLocals[language] = data.default
  return data
}

const languages: {
  key: LocaleKeys
  title: string
}[] = [
  {
    title: '简体中文',
    key: 'zh',
  },
  {
    title: 'English',
    key: 'en',
  },
]

const changeLanguage = async (language: LocaleKeys) => {
  const allLocals = await Promise.all([
    loadI18nLanguage(language),
    loadAntdLanguage(language),
  ])
  i18n.changeLanguage(language)
  currentLanguage = language
  dayjs.locale(language.includes('zh') ? 'zh-cn' : language)

  return allLocals
}

dayjs.locale('zh-cn')

export {
  type LocaleKeys,
  languages,
  loadedAntdLocals,
  changeLanguage,
  currentLanguage,
}
