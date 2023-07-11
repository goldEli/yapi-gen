import { DragLine, MouseDom } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Dropdown, Form, Progress, Space } from 'antd'

export const ProgressWrapBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .finish {
    font-size: 12px;
    color: var(--neutral-n2);
  }
`

export const ProgressWrapLine = styled.div<{
  one: number
  tow: number
  three: number
}>`
  width: 100%;
  flex: 1;
  display: flex;
  div {
    border-radius: 8px;
    height: 8px;
  }
  .one {
    width: ${props => props.one}%;
    background: var(--primary-d1);
  }
  .two {
    width: ${props => props.tow}%;
    background: var(--primary-d1);
    opacity: 0.4;
  }
  .three {
    width: ${props => props.three}%;
    background: var(--function-tag5);
  }
`

export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  /* padding: 20px 16px 0 24px; */
  flex-direction: column;
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
  border-bottom: 1px solid var(--neutral-n6-d1);
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
  .icon {
    margin-right: 16px;
    cursor: pointer;
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
export const TextWrap = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  display: 'flex';
  flex-direction: column;
  img: {
    max-width: 20%;
  }
`

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

export const InfoWrap = styled.div`
  height: calc(100vh - 212px);
  flex: 1;
  position: relative;
  .tabs {
    padding-left: 24px;
  }
  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: none;
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
  height: calc(100vh - 265px);
  overflow: auto;
`

export const BasicFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
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
