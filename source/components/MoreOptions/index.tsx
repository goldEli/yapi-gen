import React, { useMemo } from 'react'
import CommonUserAvatar from '../CommonUserAvatar'
import { Wrap, WrapFirst, WrapSecond, WrapText, WrapTextImg } from './style'

type OptionsProps = {
  type: 'user' | 'project' | 'promise'
  name: string
  dec?: string
  img?: string
}

const MoreOptions = (props: OptionsProps) => {
  return (
    <Wrap>
      {props.type === 'user' && (
        <>
          <CommonUserAvatar avatar={props.img} size="small" />
          <WrapText>{props.name}</WrapText>
        </>
      )}
      {props.type === 'project' && (
        <>
          <WrapTextImg src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
          <WrapText>{props.name}</WrapText>
        </>
      )}
      {props.type === 'promise' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WrapFirst>{props.name}</WrapFirst>
          <WrapSecond>{props.dec}</WrapSecond>
        </div>
      )}
    </Wrap>
  )
}

export default MoreOptions
