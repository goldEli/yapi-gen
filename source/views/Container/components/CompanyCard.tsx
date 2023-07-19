//  公司卡片

/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import normalCompany from '/normalCompany.jpg'
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
    border: show
      ? '1px solid rgba(40, 119, 255, 1);'
      : ' 1px solid rgba(235, 237, 240, 1)',
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
    borderRadius: '6px',
    height: 104,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    img: {
      width: '100%',
      height: '100%',
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
  borderRadius: '6px',
})

type Props = {
  isShow?: boolean
  tap?(): void
  name: string
  logo: string
}
const CompanyCard = (props: Props) => {
  return (
    <Warp
      show={props.isShow}
      onClick={() => {
        if (props.tap) {
          props.tap()
        }
      }}
    >
      <ImgWrap show={props.isShow}>
        <img src={props.logo ? props.logo : normalCompany} alt="" />
      </ImgWrap>
      <TextWarp>
        <NameWrap show={props.isShow}>{props.name}</NameWrap>
      </TextWarp>
    </Warp>
  )
}

export default CompanyCard
