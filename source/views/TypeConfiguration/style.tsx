/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import styled from '@emotion/styled'

export const TypeConfigurationWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 220px);
`

export const AllWrap = styled.div`
  display: flex;
  height: 100%;
  width: 220px;
  border-right: 1px solid var(--neutral-n6-d1);
`

export const WrapDetail = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: 0.2s;
  position: relative;
`

export const WrapSet = styled.div`
  height: 100%;
  width: 100%;
  transition: 0.2s;
`

export const SideTop = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 24px 16px;
  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 8px;
  }
`

export const SideInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: calc(100% - 40px);
  div {
    color: var(--neutral-n1-d1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    color: var(--neutral-n3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const MenuBox = styled.div`
  height: calc(100% - 150px);
  overflow-y: scroll;
  overflow-x: hidden;
`

export const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  cursor: pointer;
  white-space: nowrap;
  div {
    margin-left: 12px;
  }
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n1-d2)'};
  }
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  &:hover {
    svg {
      color: var(--primary-d2) !important;
    }
    color: var(--primary-d2) !important;
  }
`

export const Provider = styled.div`
  height: 1px;
  width: 88%;
  margin-left: 6%;
  background: var(--neutral-n6-d2);
  margin-bottom: 16px;
`

export const SideFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 44px;
  cursor: pointer;
  background: var(--neutral-n9);
  position: absolute;
  bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  div {
    display: flex;
    align-items: center;
    div {
      margin-left: 12px;
      font-size: 14px;
      color: var(--neutral-n1-d2);
    }
  }
  &:hover {
    div,
    svg {
      color: var(--primary-d2) !important;
    }
  }
`
export const BackStyle = styled.div`
  width: 100%;
  /* height: 48px; */
  display: flex;
  align-items: center;
  padding: 0 16px;
  padding-bottom: 16px;
  color: var(--neutral-n3);
  font-size: 12px;
  &:hover {
    cursor: pointer;
    color: var(--primary-d2);
  }
`
export const TitleStyle = styled.div`
  display: flex;
  width: 100%;
  padding: 0 16px 0px 16px;
  align-items: center;
  font-size: 14px;
  color: var(--neutral-n3);
  justify-content: space-between;
`
export const Tabs = styled.div`
  width: 100%;
  display: flex;
  height: 24px;
  border-radius: 4px;
  margin: 16px 0;
  font-size: 12px;
  font-weight: 400;
  padding: 0 16px;
  color: var(--neutral-n1-d1);

  span {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    width: 50%;
    background-color: var(--neutral-n7);
    border-radius: 4px;
  }
  &:hover {
    cursor: pointer;
    color: var(--neutral-n1-d1);
  }
  .tabsActive {
    background-color: var(--neutral-white-d6);
    color: var(--neutral-n3);
    box-shadow: 0px 1px 9px 0px rgba(20, 37, 98, 0.05);
    border: 1px solid var(--neutral-n6-d1);
  }
`

export const NoDataCreateWrap = styled.div({
  marginTop: 8,
  minHeight: 68,
  borderRadius: 6,
  padding: '8px 12px',
  '.top': {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 12,
    svg: {
      color: '#FA9746',
      fontSize: 16,
      marginTop: 2,
    },
    div: {
      color: 'var(--neutral-n2)',
      fontSize: 12,
      marginLeft: 8,
      flexWrap: 'wrap',
    },
  },
  '.bottom': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: ' var(--primary-d2)',
    svg: {
      fontSize: 10,
    },
    div: {
      fontSize: 12,
      marginLeft: 6,
    },
  },
})

export const AffairTypeWrap = styled.div`
  margin-top: 16px;
`
export const AffairTypeHeader = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
  margin-bottom: 4px;
  > span {
    padding: 2px;
    &:hover {
      background: var(--hover-d1);
      border-radius: 4px;
    }
  }
`
export const AffairTypeList = styled.div`
  height: 30px;
  border: 1px solid red;
  cursor: pointer;
`
export const AffairTypeText = styled.div`
  width: calc(100% - 20px);
  font-size: var(--font12);
  color: var(--neutral-n3);
  margin-left: 8px;
  display: flex;
  flex-wrap: nowrap;
`
