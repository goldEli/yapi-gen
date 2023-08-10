/* eslint-disable @typescript-eslint/naming-convention */
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Input, Popover, Space } from 'antd'

export const DetailFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background: var(--neutral-white-d5);
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

export const haveAuto = css`
  height: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: hidden;
`

export const SkeletonStatus = styled.div`
  .ant-skeleton-input {
    height: 22px;
    width: 52px;
    display: inline-block;
    min-width: inherit;
    border-radius: 4px;
    background: var(--neutral-n7);
  }
`

export const Header = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d2);
  padding: 0 24px;
  display: flex;
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

export const ChangeIconBox = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  background: var(--neutral-white-d4);
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`

export const Content = styled.div`
  height: calc(100% - 120px);
  overflow: auto;
  padding: 16px 24px;
  position: relative;
  background: #fff;
  /* border: 1px solid; */
  padding-top: 0px;
  .tabs {
    padding-top: 32px;
    position: sticky;
    top: -18px;
    z-index: 2;
    background: var(--neutral-white-d1);
  }
`
export const LabelWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const CancelText = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d1);
  cursor: pointer;
`
export const ParentBox = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 22px;
  margin-bottom: 16px;
  justify-content: space-between;
  padding-top: 16px;
`
export const FixedBox = styled.div`
  position: fixed;
  width: 100%;
  z-index: 9;
  background: #fff;
`
export const EmptyBox = styled.div`
  margin-top: 100px;
  background: #fff;
`
export const DemandName = styled.div`
  .name {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-right: 16px;
    font-family: SiYuanMedium;
    outline: none;
  }
  .icon {
    margin-right: 16px;
    cursor: pointer;
  }
  flex-wrap: wrap;
`
export const ProgressBox = styled.div``

export const CollapseItem = styled.div`
  margin-top: 16px;
`

export const CollapseItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
  height: 28px;
  background: var(--hover-d2);
  border-radius: 4px;
  &:hover {
    background: var(--hover-d1);
  }
  span {
    font-size: var(--font12);
    color: var(--neutral-n2);
  }
`

export const ContentItem = styled.div`
  margin-bottom: 32px;
`

export const CollapseItemContent = styled.div<{ isOpen?: boolean }>`
  height: ${props => (props.isOpen ? 'auto' : 0)};
  padding-top: ${props => (props.isOpen ? 16 : 0)}px;
  overflow: hidden;
  transition: 0.2s;
`

export const Label = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  margin-bottom: 8px;
  height: 32px;
  line-height: 32px;
`

export const LabelItem = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n3);
  display: flex;
  align-items: center;
  height: 32px;
`

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

export const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  marginTop: 14,
  position: 'relative',
  minHeight: 32,
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
    flex: 1,
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)

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
  &:hover ${HovDiv} {
    visibility: visible;
  }
  p {
    margin: 0;
  }
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

export const TagWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 0',
  maxWidth: 400,
})

export const SearchInput = styled(Input)`
  font-size: 14px;
  min-width: 240px;
  height: 32px;
  background: var(--neutral-white-d4);
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;

  padding: 5px 12px 5px 12px;
  border: none;
  input {
    background: var(--neutral-white-d4);
    &::placeholder {
      font-size: 14px;
    }
  }
`

export const TagItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  minHeight: '32px',
  cursor: 'pointer',
  padding: '0 16px',
  div: {
    height: 16,
    width: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  span: {
    color: 'var(--neutral-n2)',
    fontSize: 14,
  },
  '&:hover': {
    background: 'var(--hover-d2)',
    span: {
      color: 'var(--primary-d1)',
    },
  },
})

export const ColorWrap = styled.div({
  height: 16,
  width: 16,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  svg: {
    color: 'white',
  },
})

export const TagCheckedItem = styled.div<{ color?: string }>(
  {
    width: 'max-content',
    height: 22,
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    position: 'relative',
    color: 'var(--neutral-n3)',
    border: '1px solid var(--neutral-n3)',
    boxSizing: 'border-box',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    margin: '4px 8px 4px 0 ',
    '.icon': {
      display: 'none',
    },
    '&:hover': {
      '.icon': {
        display: 'block',
      },
    },
  },
  ({ color }) => ({
    color: color || 'var(--neutral-n3)',
    border: `1px solid ${color ?? 'var(--neutral-n3)'}`,
  }),
)

export const TagGroups = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const AddTagIcon = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px dashed var(--neutral-n3);
  color: var(--neutral-n3);
  cursor: pointer;
  &:hover {
    border: 1px dashed var(--primary-d2);
    color: var(--primary-d2);
  }
`

export const CommentTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  div,
  span {
    font-size: var(--font14);
    color: var(--neutral-n3);
    margin-right: 8px;
  }
`
export const LayerBox = styled.div``
export const customTabs = css`
  /* position: sticky !important;
  top: 0 !important; */
`
export const BtnWrap = styled.div`
  display: flex;
  margin: 12px 0px;
  button {
    margin-right: 12px;
  }
`
export const CycleBox = styled.div`
  display: flex;
  margin-bottom: 14px;
  > div {
    flex: 1;
    .tip {
      color: var(--neutral-n1-d1);
      font-size: var(--font14);
      font-family: SiYuanMedium;
    }
    .label {
      color: var(--neutral-n3);
      font-size: var(--font14);
      margin-right: 16px;
      margin-left: 16px;
      font-family: SiYuanRegular;
    }
    .date {
      color: var(--neutral-n1-d1);
      font-size: var(--font14);
    }
  }
`

export const HandlerBox = styled.div`
  margin-bottom: 14px;
`
