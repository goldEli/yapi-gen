// 公用头像组件
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import avatarBlack from '/avatarBlack.png'
import avatarWhite from '/avatarWhite.png'

const UserAvatarWrap = styled.div`
  display: flex;
  align-items: center;
`

const AvatarBox = styled.div<{ size?: string }>`
  border-radius: 50%;
  width: ${props => (props.size === 'large' ? 32 : 24)}px;
  height: ${props => (props.size === 'large' ? 32 : 24)}px;
  img {
    width: 100%;
    height: 100%;
  }
`

interface UserAvatarProps {
  isBorder?: boolean
  avatar?: string
  isShowName?: boolean
  size?: 'large' | 'small'
  fontSize?: number
}

const CommonUserAvatar = (props: UserAvatarProps) => {
  const { theme } = useSelector(store => store.global)
  return (
    <UserAvatarWrap>
      <AvatarBox size={props.size}>
        <img src={props.avatar || (theme ? avatarBlack : avatarWhite)} alt="" />
      </AvatarBox>
    </UserAvatarWrap>
  )
}

export default CommonUserAvatar
