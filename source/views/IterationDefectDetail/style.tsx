import { DragLine, MouseDom } from '@/components/StyleCommon'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Dropdown, Form, Progress, Space } from 'antd'

export const haveAuto = css`
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
`

export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  .tabs {
    padding: 0 24px 0 0;
  }
  .ant-tabs-nav {
    padding-left: 24px;
  }
  .ant-tabs-tab {
    padding: 0 0 16px;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary-d1);
  }
  .ant-tabs-content {
    height: calc(100vh - 227px);
    .ant-tabs-tabpane {
      height: 100%;
    }
  }
  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before {
    left: 24px;
  }
`

export const DetailTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 24px;
`

export const ButtonGroup = styled(Space)`
  display: flex;
  align-items: center;
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
  height: 32px;
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
`

export const DetailTitle = styled.div`
  display: flex;
  /* border-bottom: 1px solid var(--neutral-n6-d1); */
  padding: 20px 0px 20px;
  width: calc(100% - 48px);
  margin-left: 24px;
`

export const Img = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`

export const DetailText = styled.div`
  flex-wrap: wrap;
  .name {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-right: 16px;
    font-family: SiYuanMedium;
    outline: none;
  }
`

export const DetailMain = styled.div`
  display: flex;
  margin-top: 20px;
  padding-right: 24px;
  position: relative;
`

export const DetailInfoWrap = styled.div<{ isScroll?: boolean }>`
  width: 100%;
  height: ${props =>
    props.isScroll ? 'calc(100% - 100px)' : 'calc(100% - 40px)'};
  overflow: auto;
`

export const InfoItem = styled.div`
  display: flex;
  margin-top: 20px;
  position: relative;
  flex-direction: column;
  /* width: max-content; */
  padding: 0 24px;
`

export const Label = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  min-width: 120px;
  font-family: SiYuanMedium;
  margin-bottom: 8px;
  height: 32px;
  line-height: 32px;
`
export const TextWrap = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 12,
  '.textTop': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    '.name': {
      color: 'black',
      fontSize: 14,
      marginRight: 12,
    },
    '.anticon': {
      color: 'var(--neutral-n3)',
      fontSize: 16,
      position: 'absolute',
      right: 0,
      top: 3,
      display: 'none',
    },
  },
  '.common': {
    fontSize: 12,
    color: 'var(--neutral-n3)',
    whiteSpace: 'nowrap',
  },
  '.statusText': {
    width: 'calc(100% - 120px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.content': {
    color: 'var(--neutral-n2)',
    fontSize: 12,
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    paddingRight: 30,
    flexWrap: 'wrap',
    wordBreak: 'break-all',
    img: {
      display: 'block',
      height: 100,
      objectFit: 'contain',
    },
    table: {
      'td,th': {
        height: '20px',
        border: '1px solid black',
      },
    },
  },
})

export const InfoItemWrap = styled.div`
  /* width: max-content; */
`

export const LabelWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const SubLabel = styled.div`
  margin: 8px 0;
  font-size: 12px;
  color: var(--neutral-n3);
`

export const AddText = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
  cursor: pointer;
`

export const CancelText = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d1);
  cursor: pointer;
`

export const ProgressWrap = styled(Progress)`
  width: 100%;
  margin: 4px 0;
  .ant-progress-outer {
    margin-right: calc(-4em - 16px);
    padding-right: calc(4em + 24px);
  }
  .ant-progress-text {
    font-size: 12px;
    color: var(--neutral-n2);
  }
`

export const ActivityTabItem = styled.div`
  display: flex;
  align-items: center;
`

export const ItemNumber = styled.div<{ isActive?: boolean }>`
  margin-left: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.isActive ? 'var(--primary-d1)' : 'var(--function-tag5)'};
  color: ${props =>
    props.isActive ? 'var(--neutral-white-d7)' : 'var(--primary-d1)'};
`

export const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})

export const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

export const DropdownMenu = styled(Dropdown)`
  .ant-dropdown-menu-item {
    padding: 4px 16px;
  }
  .ant-dropdown-menu-item-divider {
    margin: 4px 16px;
  }
`

export const SprintDetailDragLine = styled(DragLine)`
  background: ${props =>
    props.active ? 'var(--primary-d2)' : 'var(--neutral-n6-d1)'}!important;
`

export const SprintDetailMouseDom = styled(MouseDom)`
  background: transparent;
`

export const BasicWrap = styled.div`
  position: relative;
  height: 100%;
`

export const BasicContent = styled.div`
  height: calc(100% - 60px);
`

export const BasicFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
  background: var(--neutral-white-d5);
  position: absolute;
  bottom: 0;
  width: 100%;
  .textBox {
    display: flex;
    flex-direction: column;
    div {
      font-size: 12px;
      color: var(--neutral-n3);
      margin-bottom: 4px;
    }
    span {
      font-size: 12px;
      color: var(--neutral-n3);
    }
  }
`

export const FlawInfoWrap = styled.div({
  display: 'flex',
  height: '100%',
  paddingBottom: 24,
})

export const FlawInfoLeft = styled.div`
  width: 80%;
  height: 100%;
  overflow: auto;
  padding: 0 20px 0 24px;
  position: relative;
  .review {
    position: absolute;
    top: 0;
    right: 10px;
    svg {
      cursor: auto;
    }
  }
`

export const FlawInfoInfoItem = styled.div<{ activeState?: any }>({
  display: 'flex',
  marginTop: 14,
  position: 'relative',
  flexDirection: 'column',
})

export const FlawInfoLabel = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  minWidth: 120,
  height: 32,
  lineHeight: '32px',
  fontFamily: 'SiYuanMedium',
})

export const FlawInfoTextWrap = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  display: 'flex',

  flexDirection: 'column',
  img: {
    maxWidth: '20%',
  },
})

export const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: 'var(--primary-d2)',
})

export const MaxLabel = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const InfoItemBasic = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  position: 'relative',
})

export const ContentWrap = styled.div<{ notHover?: any }>(
  {
    color: 'var(--neutral-n1-d1)',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
    width: '100%',
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)

export const LabelItem = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n3);
`

export const WrapRight = styled.div({
  width: 400,
  height: '100%',
  padding: '0px 10px 0px 24px',
  position: 'relative',
})

export const TitleWrap = styled.div<{ activeTabs?: any }>(
  {
    height: 24,
    borderRadius: 4,
    margin: '8px 0 24px 0',
    display: 'flex',
    width: 'fit-content',
    div: {
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 400,
      height: 24,
      width: 'fit-content',
      cursor: 'pointer',
    },
  },
  ({ activeTabs }) => ({
    '.leftWrap': {
      color: activeTabs === 1 ? 'var(--primary-d2)' : 'var(--neutral-n3)',
      border:
        activeTabs === 1
          ? '1px solid var(--primary-d2)'
          : '1px solid var(--neutral-n6-d1)',
      borderRadius: '4px 0 0 4px',
      borderRight: activeTabs === 1 ? '' : 'none',
    },
    '.rightWrap': {
      color: activeTabs === 2 ? 'var(--primary-d2)' : 'var(--neutral-n3)',
      border:
        activeTabs === 2
          ? '1px solid var(--primary-d2)'
          : '1px solid var(--neutral-n6-d1)',
      borderLeft: activeTabs === 2 ? '' : 'none',
      borderRadius: '0 4px 4px 0',
    },
  }),
)

export const ButtonWrap = styled.div({
  width: '92%',
  background: 'white',
  paddingBottom: 7,
})

export const TextareaWrap = styled.div({
  marginTop: 67,
  textAlign: 'right',
  marginBottom: 20,
  position: 'relative',
  paddingRight: 20,
  overflow: 'hidden',
  '.ant-input': {
    padding: '8px 8px 40px 8px',
  },
  '.ant-input:focus,.ant-input:active': {
    boxShadow: 'none',
  },
  [ButtonWrap.toString()]: {
    position: 'absolute',
    right: 28,
    bottom: 1,
  },
})

export const Second = styled.div`
  visibility: hidden;
  position: absolute;
  right: 12px;
  top: 8px;
  opacity: 0;
  transition: all 1s;
  background-color: var(--neutral-white-d6);
`

export const Card = styled.div`
  flex: 1;
  position: relative;
  min-width: 290px;
  min-height: 60px;
  background: var(--neutral-white-d2);
  box-shadow: 0px 0px 7px 2px rgba(0, 0, 0, 0.04);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  margin: 0 16px 16px 10px;
  box-sizing: border-box;
  padding: 8px 12px;
  &:hover {
    box-shadow: 0px 0px 7px 2px rgba(40, 119, 255, 20%);
    ${Second} {
      visibility: visible;
      opacity: 1;
    }
  }
`

export const Gred = styled.div`
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  opacity: 0;
  transition: all 1s;
`

export const BlueCss = styled.span`
  font-size: 12px;
  color: var(--primary-d1);
  cursor: pointer;
  margin-left: 5px;
  background-color: var(--neutral-white-d6);
  padding: 5px 8px;
  border-radius: 6px;
  box-shadow: 0px 0px 6px rgb(0 0 0 / 10%);
`

export const HovDiv = styled.div`
  visibility: hidden;
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const MyDiv = styled.div`
  position: relative;
`

export const CommentItem = styled.div<{ isShow?: boolean }>`
  .ar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 12px;
  }

  display: flex;
  justify-content: flex-start;
  margin-top: 13px;
  margin-right: 12px;
  width: 100%;
  &:hover ${HovDiv} {
    visibility: visible;
  }
  p {
    margin: 0;
  }
`

export const CommentTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const GredParent = styled.div`
  margin-right: 12px;
  position: relative;
  &:hover {
    ${Gred} {
      opacity: 0.6;
      transition: all 0.1s;
    }
  }
`

export const RedCss = styled(BlueCss)`
  color: var(--function-error);
  margin-left: 12px;
`

export const RelationWrap = styled.div`
  height: 100%;
  padding-left: 24px;
`

export const PriorityWrap = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    div: {
      color: 'var(--neutral-n1-d2)',
      fontSize: 14,
      marginLeft: 8,
    },
    '.icon': {
      marginLeft: 8,
      visibility: 'hidden',
      fontSize: 14,
      color: 'var(--neutral-n4)',
    },
    '.priorityIcon': {
      fontSize: 14,
    },
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
      },
    },
  }),
)
