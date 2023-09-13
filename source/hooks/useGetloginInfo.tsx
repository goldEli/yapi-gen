import { useSelector } from '@store/index'

export const useGetloginInfo = () => {
  const info = useSelector(state => state.user.loginInfo)

  return info.id
}
