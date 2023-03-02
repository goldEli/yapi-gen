/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Space } from 'antd'

export const Header = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d1);
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
`

export const ChangeIconGroup = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  width: 64px;
  height: 32px;
  display: flex;
  overflow: hidden;
  div {
    width: 31px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-white-d4);
    svg {
      color: var(--neutral-n2);
    }
  }
  div:hover {
    background: var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
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
  height: calc(100% - 53px);
  overflow: auto;
  padding: 16px 24px;
  position: relative;
`

export const ParentBox = styled(Space)`
  display: flex;
  height: 22px;
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
  margin-bottom: 8px;
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
`

export const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: '#2877ff',
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
    color: '#323233',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
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
      color: '#969799',
      fontSize: 16,
      position: 'absolute',
      right: 0,
      top: 3,
      display: 'none',
    },
  },
  '.common': {
    fontSize: 12,
    color: '#969799',
    whiteSpace: 'nowrap',
  },
  '.statusText': {
    width: 'calc(100% - 120px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '.content': {
    color: '#646566',
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
  background: #ffffff;
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