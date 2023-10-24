import { css } from '@emotion/css'
import styled from '@emotion/styled'

// 引导页
export const imgBoxCss = css`
  box-sizing: border-box;
`
export const footerCss = css`
  display: flex;
  justify-content: end;
  height: 75px;
  box-sizing: border-box;
  padding-right: 53px;
  align-items: center;
  gap: 24px;
`

export const Container = styled.div`
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(135, 136, 137, 0.6);
`
export const Dialog = styled.div`
  width: 900px;
  background: rgba(245, 246, 247, 1);
  position: absolute;
  border-radius: 6px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const ButtonWrap = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 12,
  fontWeight: 400,
  background: 'var(--primary-d2)',
  cursor: 'pointer',
})

export const ButtonWrapBorder = styled.div({
  height: 30,
  width: 68,
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary-d2)',
  fontSize: 12,
  fontWeight: 400,
  background: 'white',
  cursor: 'pointer',
  border: '1px solid var(--primary-d2)',
})

// 整体布局样式
export const LayoutWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`

export const LayoutSide = styled.div<{ isOpen?: boolean }>`
  height: 100%;
  width: ${props => (props.isOpen ? 200 : 80)}px;
  transition: 0.3s;
  background: var(--neutral-white-d2);
  border-right: 1px solid var(--neutral-n6-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  padding: ${props => (props.isOpen ? '18px 12px' : '18px 8px')};
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isOpen ? 'flex-start' : 'center')};
  z-index: 1;
  position: relative;
`

export const LayoutContent = styled.div<{ isOpen?: boolean }>`
  width: ${props =>
    props.isOpen ? 'calc(100% - 200px)' : 'calc(100% - 80px)'};
  transition: 0.3s;
  min-width: ${props =>
    props.isOpen ? 'calc(1440px - 200px)' : 'calc(1440px - 80px)'};
`

export const LayoutHeader = styled.div`
  height: 56px;
  width: 100%;
  background: var(--neutral-n9);
  border-bottom: 1px solid var(--neutral-n6-d1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 24px;
`

export const MainContent = styled.div`
  width: 100%;
  height: calc(100% - 56px);
`

// 左侧侧边栏样式
export const LogoWrap = styled.div<{ isOpen?: boolean }>`
  height: 64px;
  width: 68px;
  background: gray;
  margin-bottom: ${props => (props.isOpen ? 24 : 16)}px;
`

export const notOpenSideMenu = css`
  height: 64px;
  width: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  border-radius: 8px;
  cursor: pointer;
  div {
    margin-top: 2px;
    font-size: 14px;
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
  }
`

export const openSideMenu = css`
  height: 48px;
  width: 176px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 12px;
  cursor: pointer;
  div {
    margin-left: 12px;
    color: var(--neutral-n1-d1);
    font-size: 16px;
  }
  &:hover {
    background: var(--hover-d1);
  }
`

export const activeSideMenu = css`
  background: var(--selected);
  div {
    color: var(--primary-d2);
  }
`

export const CollapseWrap = styled.div`
  position: absolute;
  bottom: 18px;
`

export const CollapseWrapItem = styled.div`
  width: 176px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  div {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-left: 8px;
  }
`

export const MorePopover = styled.div`
  width: 288px;
  height: 320px;
  background: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
`
