import CryptoJS from 'crypto-js'

const utf8Key = CryptoJS.enc.Utf8.parse(import.meta.env.__AES_KEY__)

const cipherOption = {
  iv: CryptoJS.enc.Utf8.parse(import.meta.env.__AES_IV__),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
}

export const encrypt = (message: string) => {
  const utf8Message = CryptoJS.enc.Utf8.parse(message)
  return CryptoJS.AES.encrypt(utf8Message, utf8Key, cipherOption).toString()
}

export const decrypt = (message: string) => {
  const utf8Message = CryptoJS.AES.decrypt(message, utf8Key, cipherOption)
  return CryptoJS.enc.Utf8.stringify(utf8Message).toString()
}
