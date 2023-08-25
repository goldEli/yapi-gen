/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, Space, Spin } from 'antd'
import { css } from '@emotion/css'
import { keyframes } from '@emotion/react'

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  .title {
    font-size: 14px;
    font-family: SiYuanMedium;
    margin-bottom: 8px;
  }
`

export const TargetUserItem = styled.div`
  box-sizing: border-box;
  padding: 24px 0px;
  .tabs {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    span {
      font-size: 14px;
      color: var(--neutral-n3);
      cursor: pointer;
    }
    span:last-child {
      margin-left: 16px;
    }
    .active {
      font-family: SiYuanMedium;
      color: var(--neutral-n1-d1);
    }
  }
`

export const TargetUserContent = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const ContactDemandBox = styled.div`
  display: flex;
  flex-direction: column;
`

export const ContactDemandItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--neutral-n1-d1);
  .name {
    max-width: 85%;
    white-space: normal;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &:last-child {
    margin-bottom: 0px;
  }
`

export const CommentBox = styled.div`
  margin-bottom: 8px;
  .deleteIcon {
    display: none;
  }
  &:hover .deleteIcon {
    display: inherit;
  }
  .headWrap {
    display: flex;
    justify-content: space-between;
  }
  .header {
    display: flex;
    align-items: center;
    .time {
      margin-left: 16px;
      font-size: 12px;
      color: var(--neutral-n3);
    }
  }
  .content {
    padding-left: 32px;
    margin-top: 2px;
  }
`

export const SkeletonGroup = styled(Space)`
  display: flex;
  align-items: center;
`

export const SkeletonGroups = styled.div`
  display: flex;
  flex-direction: column;
  .ant-skeleton-input {
    display: inline-block;
    min-width: inherit;
    border-radius: 4px;
    background: var(--neutral-n7);
  }
  .ant-skeleton-avatar {
    background: var(--neutral-n7);
  }
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

export const Content = styled.div<{ isReview?: boolean }>`
  height: ${props =>
    props.isReview ? 'calc(100% - 336px)' : 'calc(100% - 134px)'};
  overflow: auto;
  padding: 16px 24px;
  position: relative;
`

export const ContentHeadWrap = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  margin-bottom: 24px;
  flex-direction: column;
  justify-content: center;
  .titleText {
    width: 98%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 24px;
    font-size: 16px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: #323233;
    line-height: 24px;
    margin-left: 12px;
    .dateText {
      font-size: 12px;
    }
  }
  .reportTitleWrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
  }
  .submitTimeText {
    font-size: 12px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: #969799;
    margin-left: 12px;
  }
`

export const LabelTitle = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 22px;
  .ant-form-item-label
    > label.ant-form-item-required:not(
      .ant-form-item-required-mark-optional
    )::after {
    content: '';
  }
`

export const LabelMessage = css`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`

export const LabelMessageRead = css`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 22px;
  margin-left: 16px;
`

export const CommentFooter = styled.div<{ isReview?: boolean }>`
  width: 100%;
  height: auto;
  min-height: ${props => (props.isReview ? '280px' : '80px')};
  box-sizing: border-box;
  padding: 24px;
  background: var(--neutral-white-d5);
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .editBox {
    max-height: 72vh;
    overflow: auto;
  }
  .buttonBox {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
`

export const ParentBox = styled(Space)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 22px;
  margin-bottom: 16px;
`

export const DemandName = styled.div`
  font-size: var(--font16);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
`

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
`

export const LabelItem = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n3);
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
  margin-top: 4px;
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
export const MsgRow = styled.div`
  display: flex;
  justify-content: space-between;
  .titleText {
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 24px;
    font-size: 16px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: #323233;
    line-height: 24px;
    margin-left: 12px;
    .dateText {
      font-size: 12px;
    }
  }
`
export const Title = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
`
export const Msg = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n2);
`
export const RowLine = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`
export const Line = styled.div`
  width: 1px;
  height: 16px;
  background: var(--neutral-n6-d1);
  margin: 0 16px;
`
export const RowRadius = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`
export const Radius = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neutral-n2);
  margin-right: 8px;
  flex-shrink: 0;
  flex-grow: 0;
`
export const Col = styled.div`
  margin-bottom: 32px;
`

export const HandleSpin = styled(Spin)`
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
  }
`

export const ContentWraps = styled.div`
  .head {
    .tips {
      font-size: 12px;
      font-family: SiYuanRegular;
      color: var(--neutral-n3);
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .userBox {
      display: flex;
      align-items: center;
      margin-top: 12px;
      .desc {
        display: flex;
        flex-direction: column;
        margin-left: 6px;
        .title {
          font-size: 16px;
          font-family: SiYuanMedium;
          color: var(--neutral-n1-d1);
          .date {
            font-size: 12px;
          }
        }
        .department {
          font-family: SiYuanRegular;
          font-size: 12px;
          color: var(--neutral-n3);
        }
      }
    }
  }
  .content {
    margin-top: 32px;
    .ant-form-vertical .ant-form-item-label,
    .ant-col-24.ant-form-item-label,
    .ant-col-xl-24.ant-form-item-label {
      padding: 0px 0px 8px 0px !important;
    }
    .project {
      display: flex;
      align-items: center;
    }
    .rateText {
      font-size: 14px;
      font-family: SiYuanRegular;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
    }
    .line {
      display: inline-block;
      width: 1px;
      height: 16px;
      margin: 0px 16px;
      background: var(--neutral-n6-d1);
    }
  }
`
export const LabelTitles = styled.span`
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 500;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`
export const AgainButton = styled.div`
  width: 80px;
  height: 32px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  color: var(--primary-d1);
  white-space: nowrap;
  margin-left: 16px;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: var(--hover-d2);
  }
  &:active {
    background: var(--auxiliary-b6);
  }
`

// 创建一个动画
const fadeInAnimation = keyframes`
  0% {
    width:0px;
  }
  50%{
    width:8px;
  }
  100%{
    width:16px;
  }
`
export const Ellipsis = styled.span`
  display: inline-block;
  overflow: hidden;
  animation: ${fadeInAnimation} 1s infinite;
`

export const LoadingButton = styled.span`
  height: 32px;
  font-size: 14px;
  border-radius: 6px 6px 6px 6px;
  font-family: SiYuanRegular;
  color: var(--primary-d1);
  white-space: nowrap;
  margin-left: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    width: 60px;
    text-align: right;
  }
`

export const TitleTips = styled.span`
  font-size: 12px;
  color: var(--neutral-n3);
  font-family: SiYuanRegular;
  margin-left: 8px;
`
