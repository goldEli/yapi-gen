/* eslint-disable no-negated-condition */
// 请求
import { decrypt, encrypt } from '../utils/crypto'
import { API_BASE_URL } from '../constants/config'

const isDevelopment = import.meta.env.MODE === 'development'

const languages: Record<string, string> = {
  0: 'zh',
  1: 'en',
  // '2': 'sp',
  // '3': 'ja',
}

export const getCaptcha = async () => {
  const data = await fetch(`${API_BASE_URL}/auth/captcha`, {
    headers: {
      Language: languages[localStorage.languageMode] || 'en',
    },
  })
  return data.json()
}

export const toLogin = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'put',
    body: isDevelopment ? JSON.stringify(data) : encrypt(JSON.stringify(data)),
    headers: {
      'Content-Type': 'application/json',
      Language: languages[localStorage.languageMode] || 'en',
    },
  })
  if (!isDevelopment) {
    const text = await response.text()
    return JSON.parse(decrypt(text))
  }
  return response.json()
}

export const checkToken = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/auth/getLoginInfo`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      Language: languages[localStorage.languageMode] || 'en',
    },
  })

  if (!isDevelopment) {
    const text = await response.text()
    return JSON.parse(decrypt(text))
  }
  return response.json()
}

export const getTicket = async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}/auth/getTicket`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      Language: languages[localStorage.languageMode] || 'en',
    },
  })

  if (!isDevelopment) {
    const text = await response.text()
    return JSON.parse(decrypt(text))
  }
  return response.json()
}

export const checkSecret = async (data: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/checkSecret`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      Language: languages[localStorage.languageMode] || 'en',
    },
    body: !isDevelopment ? encrypt(JSON.stringify(data)) : JSON.stringify(data),
  })

  if (!isDevelopment) {
    const text = await response.text()
    return JSON.parse(decrypt(text))
  }
  return response.json()
}
