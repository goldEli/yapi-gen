// 他的模块--项目卡片

/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import projectImg from 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/projectImg.png'
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'

const DropdownWrap = styled(Dropdown)({
  display: 'none',
  cursor: 'pointer',
})
const Triangle = styled.div`
  visibility: hidden;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: -26px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom: 10px solid var(--primary-d1);
`
const Warp = styled.div<{ show?: boolean }>(
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    borderRadius: 4,
    height: 64,
    width: 200,
    transition: 'all .3s',
    background: 'var(--neutral-white-d2)',
    cursor: 'pointer',
    '&: hover': {
      border: '1px solid var(--primary-d1) !important',
      [DropdownWrap.toString()]: {
        display: 'block',
      },
    },
  },
  ({ show }) => ({
    border: show
      ? '1px solid var(--primary-d1) !important'
      : '1px solid var(--neutral-n6-d1)',
    [Triangle.toString()]: {
      visibility: show ? 'visible' : 'hidden',
    },
  }),
)

const ImgWrap = styled.div<{ show?: boolean; address?: any }>(
  ({ show, address }) => ({
    // filter: String(show ? 'brightness(70%)' : ''),
    backgroundImage: `url(${address})`,
  }),
  {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    overflow: 'hidden',
    borderRadius: '4px ',
    backgroundSize: 'cover',
  },
)

const NameWrap = styled.div<{ show?: boolean }>(
  {
    width: '130px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--neutral-n1-d1)',
  },
  ({ show }) => ({
    // color: String(show ? 'var(--primary-d1)' : ''),
  }),
)

const TextWarp = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '8px',
  height: 40,
  background: 'white',
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,
})

const SwiperCard = (props: {
  show?: boolean
  tap?(): void
  name: string
  avtar: string
  all?: boolean
  project_type?: any
  permission_type?: any
}) => {
  const [t] = useTranslation()
  const changeNames1 = () => {
    let str: string
    switch (props.project_type) {
      case 1:
        str = t('common.iterate')
        break

      default:
        str = t('sprint2')
        break
    }
    return str
  }
  const changeNames2 = () => {
    let str: string
    switch (props.project_type) {
      case 1:
        str = t('enterprise_project2')
        break

      default:
        str = t('demandSettingSide.teamProject')
        break
    }
    return str
  }
  return (
    <Warp
      show={props.show}
      onClick={() => {
        if (props.tap) {
          props.tap()
        }
      }}
    >
      <ImgWrap
        show={props.show}
        address={props.avtar ? props.avtar : projectImg}
      />
      <TextWarp>
        <NameWrap show={props.show}>{props.name}</NameWrap>
        {!props.all && (
          <div
            style={{
              width: '130px',
              height: '20px',
              fontSize: '12px',
              fontWeight: 400,
              color: 'var(--neutral-n2)',
              lineHeight: '20px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {changeNames1()} - {changeNames2()}
          </div>
        )}
      </TextWarp>
    </Warp>
  )
}

export default SwiperCard
