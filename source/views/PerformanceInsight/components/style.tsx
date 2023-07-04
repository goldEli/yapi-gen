import styled from '@emotion/styled'
import { Modal, Space, Dropdown } from 'antd'
import { HighchartsReact } from 'highcharts-react-official'
export const DropdownWrap = styled(Dropdown)({
  background: 'none',
  '&:active': {
    background: 'none',
  },
})
export const MoreWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  borderRadius: 6,
  padding: '0 16px',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
})
export const MoreWrap1 = styled(MoreWrap)`
  padding: 0;
  background-color: transparent;
  font-size: 14px;
  .job1,
  .job {
    color: var(--neutral-n2);
  }
  &:hover {
    // background-color: var(--hover-d3) !important;
    .job {
      color: var(--primary-d2);
    }
    .job1 {
      color: var(--primary-d2);
      transform: rotate(180deg);
    }
  }
`
export const HeaderStyle = styled.div`
  width: 100%;
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d2);
  padding: 0 24px;
  display: flex;
  padding-right: 40px;
  align-items: center;
  justify-content: space-between;
`
export const BackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--hover-d2);
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2);
    }
  }
`
export const ChangeIconGroup = styled.div`
  /* border: 1px solid var(--neutral-n6-d1); */
  border-radius: 6px;
  box-sizing: border-box;
  height: 32px;
  display: flex;
`
export const NextWrap = styled.div`
  width: 31px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    border: 1px solid var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`
export const UpWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-right: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DownWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-left: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
`
export const MainStyle1 = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const MainStyle = styled.div`
  padding: 24px;
  height: 100%;
`
export const UserMsg = styled.div`
  display: flex;
  align-items: center;
`
export const UserInfo = styled.div`
  margin-left: 12px;
  font-size: 16px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
  .msg {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n3);
    font-family: SiYuanRegular;
    display: flex;
    align-items: center;
  }
`
export const FilterType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const Text = styled.span`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
  .text {
    margin-right: 8px;
  }
  &:hover {
    cursor: pointer;
  }
`
export const Title = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
  margin: 24px 0;
`
export const TableStyle = styled.div`
  height: calc(100% - 200px);
  padding: 24px 0px 0 0px;
`
export const BtnStyle = styled.div`
  width: 88px;
  height: 32px;
  background: #f6f7f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  color: var(--auxiliary-text-t2-d1);
  justify-content: center;
  &:hover {
    color: var(--primary-d1);
    cursor: pointer;
  }
`
export const WorkStyle = styled.div`
  width: 100%;
  margin-bottom: 24px;
`
export const TitleType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24px 16px 24px;
  height: 28px;
  padding: 0 8px;
  border-radius: 4px;
  background: var(--hover-d2);
  color: var(--neutral-n2);
  font-size: 12px;
`
export const ItemMain = styled.div`
  margin-bottom: 24px;
`
export const ItemMain1 = styled.div`
  margin-top: 24px;
`
export const RowItem = styled.div`
  display: flex;
  margin: 0 24px 16px 24px;
  flex-direction: column;
  .title {
    font-size: 14px;
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
  }
  .msg {
    margin-top: 4px;
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .time {
    font-size: 12px;
    color: var(--neutral-n3);
  }
`
export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const TypeBox = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24px 16px 24px;
`
export const Line = styled.div`
  width: 45%;
  height: 1px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
`
export const MainWrap = styled(Space)({
  borderRadius: 4,
  background: 'white',
  width: 'calc(100% - 48px)',
  margin: '0 24px 24px 24px;',
  position: 'relative',
  borderBottom: '1px solid var(--neutral-n6-d1)',
})

export const Item = styled.div<{ activeIdx: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    span: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 4,
      color: 'var(--neutral-n2) !important',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      fontSize: 12,
      color: 'var(--primary-d2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? 'var(--primary-d2) !important' : 'var(--neutral-n2)',
      borderBottom: activeIdx
        ? '2px solid var(--primary-d2)'
        : '2px solid white',
      fontFamily: activeIdx ? 'SiYuanMedium' : '',
    },
    div: {
      color: activeIdx ? 'white' : 'var(--primary-d2)',
      background: activeIdx ? 'var(--primary-d2)' : 'rgba(102, 136, 255, 0.10)',
    },
  }),
)
export const Segm = styled.div`
  height: 32px;
  line-height: 32px;
  padding-left: 24px;
  &:hover {
    color: var(--primary-d1);
    cursor: pointer;
  }
`
export const Btn = styled.div`
  width: 60px;
  height: 22px;
  background: #f6f7f9;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  justify-content: center;
  padding: 0 8px;
  margin-left: 8px;
  &:hover {
    color: var(--primary-d1);
    cursor: pointer;
  }
`
export const RightRow = styled.div`
  display: flex;
  align-items: center;
`
export const Left = styled.div`
  display: flex;
  align-items: center;
`
export const RowText = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`
export const CharTitle = styled.div`
  font-size: 12px;
  color: var(--neutral-n2);
  display: flex;
  align-items: center;
  justify-content: center;
  .day {
    font-family: SiYuanRegular;
    font-size: 20px;
    color: var(--neutral-n1-d1);
    margin: 0 12px 0 4px;
  }
  .time {
    color: var(--neutral-n3);
    margin-left: 2px;
  }
`
export const HighchartsReactWrap = styled(HighchartsReact)({
  height: '300px',
})
export const ChartRow = styled.div`
  display: flex;
  align-items: center;
`
export const BorderRow = styled.div`
  display: flex;
  align-items: center;
  .text {
    font-size: 12px;
    color: var(--neutral-n3);
    margin-left: 8px;
  }
`
export const Bor = styled.div<{ color: string }>(
  {
    width: '8px',
    height: '1px',
  },
  ({ color }) => ({
    border: `1px solid ${color}`,
  }),
)
export const Radius = styled.div<{ color: string }>(
  {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    margin: '0 1px',
  },
  ({ color }) => ({
    backgroundColor: color,
  }),
)
export const DialogMain = styled.div`
  width: 420px;
  height: 205px;
  background: var(--neutral-white-d5);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999999;
  padding: 24px;
`
export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  fontfamily: SiYuanMedium;
  &:hover {
    cursor: pointer;
  }
`
export const TextColor = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
  margin-left: 36px;
`
export const Footer = styled.div`
  height: 80px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const RowTableCol = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
  .text {
    width: 90%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .text:hover {
    cursor: pointer;
  }
`
export const HomeModal = styled(Modal)({})
