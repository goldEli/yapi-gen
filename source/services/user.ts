import client from '@jihe/http-client'

export const getUser: Services.User.GetUser = async id => {
  const response = await client.get('https://www.baidu.com')
  return {
    id,
    name: '张三',
    age: 18,
  }
}
