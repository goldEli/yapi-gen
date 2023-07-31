import CustomSelect from '@/components/CustomSelect'
import { DragLine, MouseDom } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Dropdown, Form, Space } from 'antd'

export const DemandWrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  .tabs {
    padding: 0 24px;
  }
  .ant-tabs-nav {
    margin-bottom: 8px;
    border-bottom: 1px solid transparent;
  }
  .ant-tabs-tab {
    padding: 16px 0;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary-d1);
  }
  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    border-bottom: 1px solid transparent;
  }
`

export const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

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
  padding: 20px 0px 6px;
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

export const DetailTabItem = styled.div`
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

export const ComputedWrap = styled.div`
  height: calc(100vh - 229px);
`

//  需求详情-详细信息
export const DetailMain = styled.div`
  display: flex;
  position: relative;
  height: calc(100vh - 249px);
  width: 100%;
`

export const DetailInfoWrap = styled.div<{ isScroll?: boolean }>`
  width: 100%;
  height: 100%;
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

export const InfoItem = styled.div`
  display: flex;
  margin-top: 20px;
  position: relative;
  flex-direction: column;
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

export const InfoWrap = styled.div`
  height: calc(100vh - 212px);
  flex: 1;
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
  height: calc(100% - 60px);
  padding-left: 24px;
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

export const WrapLeft = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  padding: '0 20px 24px 0',
})

// 需求详情-左侧信息及评论列表样式

export const TitleWrap = styled.div<{ activeTabs?: any }>(
  {
    height: 24,
    borderRadius: 4,
    margin: '8px 0 16px 0',
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
export const DelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -7px;
  top: -7px;
  width: 15px;
  height: 15px;
  visibility: hidden;
  z-index: 2;
  .icon {
    font-size: 16px;
    color: var(--neutral-n4);
    cursor: pointer;
    &:hover {
      color: var(--neutral-n3);
    }
  }
`
export const SelectWrap = styled(CustomSelect)`
  .ant-select-selection-placeholder {
    color: var(--neutral-black);
  }
  .ant-select-selector {
    min-width: 140px;
    border: none !important;
    outline: none !important;
  }

  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
  }
`
export const SelectWrapBedeck = styled.div`
  min-height: 32px;
  position: relative;
  border: 1px solid var(--active);
  display: flex;
  align-items: center;
  border-radius: 6px;
  &:hover ${DelButton} {
    visibility: visible;
  }
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
    padding-top: 0 !important;
  }
  .ant-picker {
    border: none;
  }
  .ant-select-selector {
    border: none !important;
    background-color: transparent !important;
  }
  .ant-select-selection-placeholder {
    color: black;
  }
`
