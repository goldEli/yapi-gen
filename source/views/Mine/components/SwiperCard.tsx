/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import { Dropdown } from 'antd'

const DropdownWrap = styled(Dropdown)({
  display: 'none',
  cursor: 'pointer',
})
const Triangle = styled.div`
  visibility: hidden;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: -30px;
  width: 0;
  height: 0;
  border: 9px solid transparent;
  border-bottom: 14px solid rgba(40, 119, 255, 1);
`
const Warp = styled.div<{ show?: boolean }>(
  {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    height: 104,
    width: 160,
    cursor: 'pointer',

    '&: hover': {
      transform: 'translate(0, -10%)',
      boxShadow: '0px 2px 8px rgba(170, 193, 227, 1)',
      [DropdownWrap.toString()]: {
        display: 'block',
      },
    },
  },
  ({ show }) => ({
    transform: show ? 'translate(0, -10%)' : '',
    boxShadow: show ? ' 0px 2px 8px rgba(170, 193, 227, 1)' : '',
    border: show ? '  1px solid rgba(235, 237, 240, 1)' : '',
    [Triangle.toString()]: {
      visibility: show ? 'visible' : 'hidden',
    },
  }),
)

const ImgWrap = styled.div<{ show?: boolean }>(
  ({ show }) => ({
    filter: String(show ? 'brightness(70%)' : ''),
  }),
  {
    height: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',

    // filter: 'brightness(70%)',
    img: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
)

const NameWrap = styled.div<{ show?: boolean }>(
  {
    width: '90%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 400,
    color: 'black',
  },
  ({ show }) => ({
    color: String(show ? 'rgba(40, 119, 255, 1)' : ''),
  }),
)

const TextWarp = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  height: 40,
  background: 'white',
})

const SwiperCard = (props: {
  show?: boolean
  tap?(): void
  name: string
  avtar: string
}) => {
  return (
    <Warp
      show={props.show}
      onClick={() => {
        if (props.tap) {
          props.tap()
        }
      }}
    >
      <ImgWrap show={props.show}>
        <img
          style={{ borderRadius: ' 4px 4px 0px 0px ' }}
          src={props.avtar ? props.avtar : projectImg}
          alt=""
        />
      </ImgWrap>
      <TextWarp>
        <NameWrap show={props.show}>{props.name}</NameWrap>
      </TextWarp>
      <Triangle />
    </Warp>
  )
}

export default SwiperCard
