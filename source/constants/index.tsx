/* eslint-disable @typescript-eslint/naming-convention */
export const GENDER_MAP: any = {
  1: '男',
  2: '女',
}

export const EMAIL_REGEXP =
  // eslint-disable-next-line require-unicode-regexp, prefer-named-capture-group
  /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,15}$/
