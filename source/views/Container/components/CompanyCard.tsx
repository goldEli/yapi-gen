/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import { Dropdown, Menu } from 'antd'

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
  border: 20px solid transparent;
  border-bottom: 20px solid rgba(40, 119, 255, 1);
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
      boxShadow: '0px 2px 8px rgba(170, 193, 227, 1)',
      [DropdownWrap.toString()]: {
        display: 'block',
      },
    },
  },
  ({ show }) => ({
    // transform: `${show ? 'translate(0, -10%)' : ''}`,
    // boxShadow: `${show ? ' 0px 2px 8px rgba(170, 193, 227, 1)' : ''}`,
    border: `${show ? '2px solid rgba(40, 119, 255, 1);' : ' 2px solid rgba(235, 237, 240, 1)'}`,
    [Triangle.toString()]: {
      visibility: `${show ? 'visible' : 'hidden'}`,
    },
  }),
)

const ImgWrap = styled.div<{ show?: boolean }>(
  ({ show }) => ({
    filter: `${show ? 'brightness(70%)' : ''}`,
  }),
  {
    borderRadius: '6px',
    height: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    color: `${show ? 'rgba(40, 119, 255, 1)' : ''}`,
  }),
)

const TextWarp = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  height: 40,
  background: 'white',
  borderRadius: '6px',
})

export default (props: { show?: boolean; tap?(): void }) => {
  return (
    <Warp
      show={props.show}
      onClick={e => {
        if (props.tap) {
          props.tap()
        }
      }}
    >
      <ImgWrap show={props.show}>
        <img style={{ borderRadius: '  6px 6px 0 0' }} src={projectImg} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap show={props.show}>
          公司名称公司名称公公司名称公司名称公司名称司名称
        </NameWrap>
      </TextWarp>
    </Warp>
  )
}
