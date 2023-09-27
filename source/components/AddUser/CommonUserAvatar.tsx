// 公用头像组件
import styled from '@emotion/styled'
import { useSelector } from '@store/index'

const UserAvatarWrap = styled.div`
  display: flex;
  align-items: center;
  height: max-content;
`

const AvatarBox = styled.div<{ size?: string; isBorder?: boolean }>`
  display: flex;
  width: ${props => (props.size === 'large' ? 32 : 24)}px;
  height: ${props => (props.size === 'large' ? 32 : 24)}px;
  border: ${props =>
    props.isBorder ? '1px solid var(--neutral-white-d7)' : 'none'};
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`

const NameWrap = styled.div<{ fontSize?: number }>`
  margin-left: 8px;
  font-size: ${props => props.fontSize}px;
  font-family: SiYuanRegular;
  color: var(--neutral-n2);
  text-overflow: ellipsis;
  width: 92px;
  overflow: hidden;
  white-space: nowrap;
`

interface UserAvatarProps {
  isBorder?: boolean
  avatar?: string
  name?: string
  size?: 'large' | 'small'
  fontSize?: number
}

const CommonUserAvatar = (props: UserAvatarProps) => {
  const { theme } = useSelector(store => store.global)
  return (
    <UserAvatarWrap>
      <AvatarBox size={props.size} isBorder={props.isBorder}>
        {props.avatar && <img src={props.avatar} />}
        {!props.avatar && theme === 1 && (
          <img src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/dark.pnp" />
        )}
        {!props.avatar && theme === 0 && (
          <img src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png" />
        )}
      </AvatarBox>
      {props.name && <NameWrap>{props?.name}</NameWrap>}
    </UserAvatarWrap>
  )
}

export default CommonUserAvatar
