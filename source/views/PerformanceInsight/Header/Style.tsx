import styled from '@emotion/styled'
import { Form, Input, Modal, Space } from 'antd'
const { TextArea } = Input
export const DivStyle = styled.div<{ noBorder?: boolean }>`
  width: 184px;
  height: 32px;
  background: var(--neutral-white-d4);
  border-radius: 6px;
  border: ${(props: any) =>
    props?.noBorder ? null : '1px solid var(--neutral-n6-d1)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  color: var(--neutral-n1-d1);
  font-size: 14px;
  &:hover {
    border: ${(props: any) =>
      props?.noBorder ? null : '1px solid var(--primary-d1)'};
  }
  .name {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export const DefaultLabel = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 35px;
  .label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 90px;
  }
`
export const DefaultLabelAdd = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 35px;
`
export const Btn = styled.span`
  width: 40px;
  height: 22px;
  display: inline-block;
  line-height: 22px;
  background: var(--neutral-n7);
  color: var(--neutral-n2);
  font-size: 12px;
  padding: 0 8px;
  border-radius: 6px;
  margin-left: 8px;
`

export const Label = styled.div(
  {
    width: '100%',
    height: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    borderSizing: 'border-box',
    alignItems: 'center',
    '.labelName': {
      display: 'inline-block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: '160px',
    },
    '&:hover .labelName': {
      maxWidth: '80px',
    },

    '&:hover .extra': {
      display: 'inline-block',
    },
    '.extra': {
      display: 'none',
    },
  },
  // ({ active }) => ({
  //   background: active ? 'red' : ''
  // }),
)
export const LabelText = styled.span`
  display: inline-block;
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const FormWrap = styled(Form)`
  box-sizing: border-box;
  padding-right: 24px;
  .ant-form-item {
    margin: 0;
  }
`
export const HeaderRow = styled.div`
  margin: 20px 24px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Text = styled.span<{ size?: string; color?: string }>(
  {
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
      color: 'var(--primary-d2)',
    },
  },
  ({ size, color }) => ({
    fontSize: size || '14px',
    color: color || 'var(--auxiliary-text-t2-d2)',
  }),
)
export const Tabs = styled.div`
  width: 140px;
  height: 32px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n2);
  background-color: var(--hover-d2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  span {
    display: inline-block;
    width: 49%;
    text-align: center;
    height: 28px;
    line-height: 28px;
    color: var(--neutral-n2);
  }
  &:hover {
    cursor: pointer;
    color: var(--primary-d2);
  }
  .tabsActive {
    height: 28px;
    background-color: var(--neutral-white-d6);
    color: var(--primary-d2);
    border-radius: 4px;
    transition: all 0.5s;
  }
`
export const TitleText = styled.div`
  height: 32px;
  font-size: 12px;
  line-height: 32px;
  color: var(--neutral-n3);
`
export const MsgText = styled.div`
  padding: 0 16px;
  margin: 0 24px;
  // width: 384px;
  height: 40px;
  border-radius: 6px;
  background: rgba(250, 151, 70, 0.1);
  font-size: 14px;
  color: var(--function-warning);
  display: flex;
  align-items: center;
  .text {
    margin-left: 8px;
  }
  .msg {
    color: var(--neutral-n2);
    font-size: 12px;
  }
`
export const MsgText1 = styled.div`
  padding: 0 16px;
  margin: 0 24px 24px 24px;
  width: 480px;
  height: 36px;
  border-radius: 6px;
  background: rgba(250, 151, 70, 0.1);
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  font-size: 12px;
`
export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 24px;
  margin-top: 29px;
  color: var(--neutral-n2);
`
export const TextColor = styled.span`
  color: var(--neutral-n1-d1);
  font-size: 14px;
`
export const TableRow = styled.div`
  width: 100%;
  padding: 0 24px;
  .ant-table-thead > tr > th {
    border: none;
  }
`
export const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  paddingLeft: 24,
  paddingRight: 18,
  fontFamily: 'SiYuanMedium',
})

export const Title = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n1-d1);
  font-size: 16px;
  div {
    margin-left: 12px;
    font-family: siyuanmedium;
  }
`

export const ModalContent = styled.div({
  color: 'var(--neutral-n2)',
  fontSize: 14,
  marginTop: 9,
  paddingLeft: 60,
  paddingRight: 27,
})

export const ModalFooter = styled(Space)({
  marginTop: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  height: 80,
  padding: 24,
})
export const ModalStyle = styled(Modal)`
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
  .ant-form-item {
    margin: 0;
  }
`
export const TitleMsg = styled.div`
  font-size: 12px;
  margin: 8px 0 24px 24px;
  color: var(--neutral-n3);
`
export const InputStyle = styled(Input)`
  width: 480px;
  margin: 0px 24px 0 0px;
`
export const TextAreaStyle = styled(TextArea)`
  width: 480px;
  margin-left: 24px;
`
export const Footer = styled.div`
  height: 80px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 150px;
`
export const HeaderRowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 24px;
  height: 80px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
export const Back = styled.div`
  width: 84px;
  height: 32px;
  background: var(--auxiliary-b4);
  border-radius: 6px;
  display: flex;
  align-items: center;
  color: var(--auxiliary-text-t2-d1);
  justify-content: center;
  padding: 0 16px;
  .text {
    margin-left: 8px;
    font-size: 14px;
  }
  &:hover {
    color: var(--primary-d1);
    cursor: pointer;
  }
`
export const LotBoxRow = styled.div`
  display: flex;
`
export const RightRow = styled.div`
  display: flex;
  align-items: center;
`
export const LotIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  /* background: var(--function-tag5); */
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Line = styled.span`
  display: inline-block;
  height: 16px;
  border-right: 1px solid var(--neutral-n6-d1);
  margin: 0 16px;
`
export const PersonText = styled.div`
  font-size: 14px;
  color: var(--neutral-n3);
`
export const Col = styled.div`
  border-radius: 6px 6px 0 0;
  padding: 24px 16px 16px 16px;
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: space-between;
  background-color: var(--neutral-white-d2);
`
export const Col1 = styled.div`
  margin: 0px 0px 12px 0px;
  display: flex;
  height: 32px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;
`

export const ColRightWrap = styled.div`
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: space-between;
`

export const TitleCss = styled.div`
  color: var(--neutral-n1-d1);
  padding-left: 8px;
  font-size: 14px;
  font-family: SiYuanMedium;
  position: relative;
  &::before {
    content: '';
    height: 16px;
    position: absolute;
    left: 0px;
    top: 3px;
    width: 3px;
    background-color: var(--primary-d1);
  }
`
export const TableStyle = styled.div`
  padding: 24px 24px 0 24px;
  height: calc(100vh - 256px);
`
export const Btn1 = styled.div`
  min-width: 60px;
  height: 22px;
  background: var(--auxiliary-b4);
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
export const Time = styled.span`
  font-size: 12px;
  color: var(--neutral-n3);
`
export const DataWrap = styled.div`
  background-color: var(--neutral-white-d2);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 0 0 6px 6px;
  /* justify-content: space-between; */
`
export const LotBox = styled.div`
  /* width: 220px; */
  height: 84px;
  background: var(--neutral-white-d2);
  border-radius: 6px;
  margin-right: 24px;
  transition: all 0.5s;
  /* margin-bottom: 24px; */
  padding: 16px;
  flex: 1;
  &:hover {
    background: var(--neutral--white-d6);
    box-shadow: 0px 0px 19px -2px rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }
`
export const TextNum = styled.div`
  width: 48px;
  display: flex;
  align-items: center;
  height: 24px;
  margin: 0px 0px 8px 0px;
  /* justify-content: space-between; */
  span:nth-child(1) {
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
    font-size: 24px;
    margin-right: 8px;
  }
  span:nth-child(2) {
    color: var(--neutral-n1-d1);
    font-size: 14px;
  }
`
export const TextTable = styled.div`
  width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
export const HightChartsWrap = styled.div<{ height: number }>(
  {
    width: '100%',
    borderRadius: '6px',
    background: 'var(--neutral--white-d4)',
    // border: '1px solid var(--neutral-n6-d1)',
    paddingTop: '12px',
    '.highcharts-container,.highcharts-root ': {
      width: '100%',
    },
  },
  ({ height }) => ({
    height: height + 'px',
  }),
)

export const Wrap = styled.div`
  /* position: relative; */
  padding-top: 56px;
  height: 100%;
  padding-bottom: 100px;
`

export const TabsWrap = styled.div`
  position: relative;
  width: 322px;
  padding: 2px;
  display: flex;
  background-color: var(--hover-d2);
  border-radius: 4px;
`

export const ActiveTab = styled.div`
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 80px;
  padding: 4px 16px;
  border-radius: 4px;
  height: 30px;

  background: var(--neutral-white-d6);
  transition: left 0.4s;
`

export const TabsWrapItem = styled.div<{ active: boolean }>`
  z-index: 1;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
  /* background: ${props =>
    props.active ? 'var(--neutral-white-d6);' : ''}; */
  color: ${props => (props.active ? 'var(--primary-d2);' : '')};
  transition: all 0.5s;
`
