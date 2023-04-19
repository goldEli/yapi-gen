// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import en from './en.json'
import zh from './zh.json'

// react-i18next versions lower than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    en: typeof en
    zh: typeof zh
  }
}

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'zh'
    // custom resources type
    resources: {
      en: typeof en
      zh: typeof zh
    }
  }
}

// enum LanguageType {
//   zh = 'zh',
//   en = 'en',
// }
// const resources = {
//   [LanguageType.zh]: {
//     translation: zh,
//   },
//   [LanguageType.en]: {
//     translation: en,
//   },
// }

// // 解决 i18next.t 函数没有的提示
// type I18nStoreType = typeof import('./zh.json')

// export type I18nT = {
//   (key: keyof I18nStoreType): string
// }

// declare module 'i18next' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface TFunction extends I18nT {}
// }

// declare module 'react-i18next' {
//   interface CustomTypeOptions {
//     resources: (typeof resources)[LanguageType.zh]
//   }
// }
