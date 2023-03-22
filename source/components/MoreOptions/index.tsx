import CommonUserAvatar from '../CommonUserAvatar'
import { Wrap, WrapFirst, WrapSecond, WrapText, WrapTextImg } from './style'
import erp from '/er.png'

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
        <div
          style={{
            height: '27px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CommonUserAvatar avatar={props.img ?? erp} size="small" />
          <WrapText>{props.name}</WrapText>
        </div>
      )}
      {props.type === 'project' && (
        <div
          style={{
            height: '27px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <WrapTextImg src={props.img ?? erp} />
          <WrapText>{props.name}</WrapText>
        </div>
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
