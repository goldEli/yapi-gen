/* eslint-disable @typescript-eslint/naming-convention */
export const GENDER_MAP: any = {
  1: '男',
  2: '女',
}

export const EMAIL_REGEXP =
  // eslint-disable-next-line require-unicode-regexp, prefer-named-capture-group
  /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,15}$/
export const FAULT_MAPS = ['发现版本', '严重程度', '解决方法']

export const AFFAIRS_CHILD_TYPE: any = { 3: [4, 5], 4: [6], 5: [6] }

export const PHONE_NUMBER_REGEXP = /^\d+$/u
