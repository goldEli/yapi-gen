const axios = require('axios')
/**
 * 创建一个 zhArr.js 文件
 *
 * const zhArr = ['你好', '中国制造']
 * module.exports = zhArr
 */
const zhArr = require('./zhArr')

const translateToEn = async content => {
  try {
    const response = await axios({
      url: 'http://35.84.160.169:8008/bbs/translate',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        source_lang: 'zh',
        target_lang: 'en',
        content,
      },
    })

    return response.data.content
  } catch (error) {
    console.error(error)
  }
}

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const lowerCase = str => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

const arrayToJSON = async array => {
  const objZh = {}
  const objEn = {}
  for (let i = 0; i < array.length; i++) {
    const en = await translateToEn(array[i])
    const key = lowerCase(en).split(' ').join('_')
    objZh[key] = array[i]
    objEn[key] = capitalize(en)
  }
  return {
    objZh,
    objEn,
  }
}

;(async () => {
  const result = await arrayToJSON(zhArr)
  // console.log(result)
  /**
    {
      objZh: { hello: '你好', made_in_China: '中国制造' },
      objEn: { hello: 'Hello', made_in_China: 'Made in China' }
    }
    
   */
})()
