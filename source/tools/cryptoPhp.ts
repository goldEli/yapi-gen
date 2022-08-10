import CryptoJS from 'crypto-js'
import { decode, encode } from 'js-base64'

const utf8Key = CryptoJS.enc.Utf8.parse(import.meta.env.__AES_KEY_PHP__)

const cipherOption = {
  iv: CryptoJS.enc.Utf8.parse(import.meta.env.__AES_IV_PHP__),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
}

export const encryptPhp = (message: string) => {
  const utf8Message = CryptoJS.enc.Utf8.parse(message)
  return encode(
    CryptoJS.DES.encrypt(utf8Message, utf8Key, cipherOption).toString(),
  )
}

export const decryptPhp = (message: string) => {
  const utf8Message = CryptoJS.DES.decrypt(
    decode(message),
    utf8Key,
    cipherOption,
  )
  return CryptoJS.enc.Utf8.stringify(utf8Message).toString()
}
