// user头像
import React from 'react'
import styled from '@emotion/styled'
import { upperFirst } from 'lodash'

export const handleGetFirstString = (nick?: string) => {
  const str = nick?.charAt(0)
  if (/^[a-zA-Z]*$/u.test(str || '')) {
    return upperFirst(str)
  }
  return str
}

const AvatarBox = styled.div`
  width: 62px;
  height: 62px;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > div {
    height: 100%;
    width: 100%;
    background: #faa491;
    border-radius: 50%;
    border: 2px solid rgba(250, 164, 145, 0.12);
    font-size: 20px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: 2px solid rgba(250, 164, 145, 0.12);
  }
`

const UserAvatar = (props: { avatar?: string; name?: string }) => {
  return (
    <AvatarBox>
      {props.avatar ? (
        <img src={props.avatar} />
      ) : (
        <div className="name">{handleGetFirstString(props.name)}</div>
      )}
    </AvatarBox>
  )
}

export default UserAvatar
