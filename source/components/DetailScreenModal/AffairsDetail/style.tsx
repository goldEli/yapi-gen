import { DragLine, MouseDom } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Dropdown, Form, Progress, Space } from 'antd'

export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
`

export const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

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
  border-bottom-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DropdownMenu = styled(Dropdown)`
  .ant-dropdown-menu-item {
    padding: 4px 16px;
  }
  .ant-dropdown-menu-item-divider {
    margin: 4px 16px;
  }
`

export const DetailTitle = styled.div`
  display: flex;
  // border-bottom: 1px solid var(--neutral-n6-d1);
  padding: 20px 0px 20px;
  width: calc(100% - 48px);
  margin-left: 24px;
`

export const Img = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 4px;
`

export const DetailText = styled.div`
  flex-wrap: wrap;
  padding-left: 4px;
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
  &:hover {
    background-color: var(--hover-d2);
    cursor: pointer;
  }
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

export const DetailMain = styled.div`
  display: flex;
  margin-top: 20px;
  padding-right: 24px;
  position: relative;
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

export const InfoWrap = styled.div<{ height: any }>`
  height: ${props => props.height};
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

export const DetailInfoWrap = styled.div<{ isScroll?: boolean }>`
  width: 100%;
  height: ${props =>
    props.isScroll ? 'calc(100% - 100px)' : 'calc(100% - 40px)'};
  overflow: auto;
  .review {
    position: absolute;
    top: 0;
    right: 10px;
    svg {
      cursor: auto;
    }
  }
`

// 详情里组件

export const ActivityTabItem = styled.div`
  display: flex;
  align-items: center;
`

export const InfoItem = styled.div<{ isInfoPage?: boolean }>`
  display: flex;
  margin-top: 20px;
  position: relative;
  flex-direction: column;
  padding: ${props => (props.isInfoPage ? '0 24px' : 0)};
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

export const Label = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  min-width: 120px;
  font-family: SiYuanMedium;
  margin-bottom: 8px;
  height: 32px;
  line-height: 32px;
`

export const TargetWrap = styled.div`
  flex-wrap: wrap;
  margin-bottom: 16px;
  font-size: 14px;
  .icon {
    margin-right: 8px;
    display: inline;
  }
  .label {
    font-family: SiYuanMedium;
  }
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

export const LinkWrap = styled.div`
  display: flex;
  align-items: center;
  .content {
    cursor: pointer;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:hover {
      color: var(--primary-d2);
    }
  }
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
export const ButtonGroupWrap = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0 24px 16px;
`
