import { useState } from 'react'
import * as services from '@/services'

export default () => {
  const [user, setUser] = useState<Models.User.User>()

  const getUser = async () => {
    const userResult = await services.user.getUser('123')
    setUser(userResult)
  }

  return {
    user,
    getUser,
  }
}
