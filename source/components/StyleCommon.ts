/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
// 两次以上的公共样式

import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Button, Divider, Dropdown, Slider, Space, Table } from 'antd'
import CustomSelect from './CustomSelect'
import IconFont from './IconFont'

const TableBorder = styled.div`
  border-radius: 6px;
  border: 1px solid var(--neutral-n6-d2);
  overflow: hidden;
`

const TextWrapEdit = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  display: 'flex';
  flex-direction: column;
  cursor: pointer;
  img: {
    max-width: 20%;
  }
`

const DragLine = styled.div<{ active: boolean }>`
  height: 100%;
  width: 2px;
  margin-left: 4px;
  background: ${props => (props.active ? 'var(--primary-d2)' : 'transparent')};
`

const MouseDom = styled.div<{ active: boolean }>`
  position: absolute;
  width: 6px;
  cursor: col-resize;
  overflow: hidden;
  z-index: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 100%;
  top: 0;
  display: flex;
  align-items: center;
  &:hover {
    .line {
      background: var(--primary-d2);
    }
  }
`

// 弹窗右上角关闭图标
const CloseWrap = styled.div<{ width?: any; height?: any }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  .custom svg {
    color: var(--neutral-n3);
  }
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

const ChartsItem2 = styled.span`
  width: 1px;
  height: 56px;
  border-right: 1px solid var(--neutral-n6-d1);
`
const ChartsItem = styled.span`
  cursor: pointer;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ChartsItem333 = styled.span`
  /* cursor: pointer; */
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ChartsItem1 = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const titleCss = css`
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

const title1Css = css`
  color: var(--neutral-n1-d1);
  font-size: 24px;
`
const title1Css1 = css`
  color: var(--neutral-n1-d1);
  font-size: 24px;
`

const title2Css = css`
  color: var(--neutral-n2);
  font-size: 12px;
`

const chartsTitle = css`
  color: var(--neutral-n2);
  font-size: 12px;
  margin-bottom: 10px;
`

const HomeWrap = styled.div`
  height: 104px;
  /* border: 1px solid var(--neutral-n6-d1); */
  border-radius: 6px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
`

const TextWrap = styled.div`
  border-radius: 6px;
  height: 104px;
  border: 1px solid var(--neutral-n6-d1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 16px;
`
const TextBlueWrap = styled.div`
  width: 104px;
  height: 104px;
  border: 1px solid var(--neutral-n6-d1);
  /* background: var(--hover-d2); */
  background-blend-mode: normal;
  border-radius: 6px;
  display: flex;
  margin-right: 24px;
  justify-content: center;
  align-items: center;
`

const HightChartsWrap = styled.div`
  height: 350px;
`
const ChartsWrap = styled.div`
  background-color: var(--neutral-white-d6);
  box-sizing: border-box;
  padding: 16px 24px;
  border-radius: 6px;
  box-shadow: 0px 0px 7px 6px rgba(0, 0, 0, 0.06);
`
const HasIconMenu = styled.div<{ isCheck?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '.icon': {
      marginRight: 12,
      fontSize: 16,
    },
    '.checked': {
      fontSize: 16,
      marginLeft: 36,
      color: 'var(--auxiliary-b1)',
    },
    '.left': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '&: hover': {
      '.label': {
        // color: 'var(--neutral-n3)',
      },
      '.icon': {
        // color: 'var(--neutral-n3)',
      },
    },
  },
  ({ isCheck }) => ({
    '.label': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
    '.icon': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
  }),
)

const HoverWrap = styled.div<{ isActive?: any }>`
  /* min-width: 80px; */
  padding: 0 8px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  white-space: nowrap;
  margin-left: 8px;
  & .iconMain {
    font-size: 18px;
  }

  > .label {
    margin-left: 8px;
  }
  background: ${props => (props.isActive ? 'var(--hover-d1)' : '')};
  color: ${props =>
    props.isActive ? 'var(--neutral-n1-d1)' : 'var(--neutral-n3)'};
  &:active {
    background-color: red;
  }
  &:hover {
    background: var(--hover-d1);
    color: var(--neutral-n1-d1);
  }
  &:hover .label {
    color: var(--neutral-n1-d1);
  }
  &:active {
    background: var(--neutral-n6-d1);
  }
`

const DateQuickWrap = styled.div<{ isActive?: any }>(
  {
    padding: '0 14px',
    height: 20,
    borderRadius: 6,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 16,
    '&: hover': {
      border: '1px solid  var(--hover-d2)',
      background: 'var(--hover-d2)',
      color: 'var(--primary-d2)',
    },
  },
  ({ isActive }) => ({
    border: isActive
      ? '1px solid var(--selected)'
      : '1px solid var(--neutral-n6-d1)',
    color: isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)',
  }),
)

// 添加符号 例： 标签添加与附件添加
const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 6,
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    width: hasDash ? 22 : 'fit-content',
    height: hasDash ? 22 : 32,
    padding: hasDash ? '0 4px' : hasColor ? '0 8px' : 0,
    color: hasColor ? 'var(--primary-d2)' : 'var(--neutral-n3)',
    border: hasDash
      ? '1px dashed var(--neutral-n3)'
      : '1px solid var(--neutral-white-d6)',
    '.anticon > svg': {
      color: hasColor ? 'var(--primary-d2)' : 'var(--neutral-n3)',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed var(--primary-d2)' : '',
      background: hasColor ? 'var(--hover-d2)' : '',
      '.anticon': {
        svg: {
          color: 'var(--primary-d2)',
        },
      },
      div: {
        color: 'var(--primary-d2)',
      },
    },
    '&: active': {
      background: hasColor ? 'var(--auxiliary-b6)' : '',
    },
  }),
)

const PriorityWrap = styled.div<{ notEdit?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    padding: '0 6px',
    width: 'fit-content',
    borderRadius: 6,
    div: {
      color: 'var(--neutral-n2)',
      fontSize: 14,
      marginLeft: 8,
    },
    '.icon': {
      marginLeft: 8,
      visibility: 'hidden',
      fontSize: 16,
      color: 'var(--primary-d2)',
    },
    '.priorityIcon': {
      fontSize: 16,
      svg: {
        margin: '0!important',
      },
    },
  },
  ({ notEdit }) => ({
    cursor: notEdit ? 'initial' : 'pointer',
    '&: hover': {
      background: notEdit ? 'transparent' : 'var(--hover-d2)',
      '.icon': {
        visibility: notEdit ? 'hidden' : 'visible',
      },
    },
  }),
)

// ----------------- 颜色未处理
const SliderWrap = styled(Slider)<{ isDisabled?: any }>(
  {
    margin: '0!important',
    '.ant-slider-track,.ant-slider-step,.ant-slider-rail': {
      height: '8px!important',
    },
    '.ant-slider-rail': {
      backgroundColor: 'var(--neutral-n7)!important',
      borderRadius: 10,
    },
    '.ant-slider-track': {
      backgroundColor: 'var(--function-success)!important',
    },
    '.ant-slider-handle': {
      width: 20,
      height: 20,
      border: '1px solid var(--neutral-n6-d1)!important',
      marginTop: -7,
    },
    '.ant-slider-handle:focus': {
      boxShadow: 'none',
    },
  },
  ({ isDisabled }) => ({
    '.ant-slider-handle': {
      '&: hover': {
        border: isDisabled ? '1px solid var(--primary-d2)!important' : '',
      },
    },
  }),
)

const DelButton = styled.div`
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

const SelectWrapBedeck = styled.div`
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
    color: var(--neutral-n4);
  }
`

const SearchLine = styled.div<{ hasLeft?: boolean }>`
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  gap: 16px;
  padding-left: ${props => (props.hasLeft ? 24 : 0)}px;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid var(--neutral-n6-d1);
`

const TableWrap = styled(Table)({
  '.ant-table table': {
    paddingBottom: 10,
  },
})

// 表格-滚动条居底
const TableStyleBox = styled(TableWrap)<{
  isPadding?: any
  isBottom?: any
  isHover?: any
}>(
  {
    '.ant-progress-text': {
      fontSize: 12,
    },
    '.ant-table-tbody .tagLength': {
      visibility: 'hidden',
    },
    '.tagLength': {
      marginLeft: 8,
      fontSize: 12,
      color: 'var(--neutral-n3)',
    },
    '.ant-table-selection': {
      flexDirection: 'inherit',
    },
    '.ant-table-selection-column': {
      textAlign: 'left',
      width: 70,
    },
    '.ant-table-expanded-row .ant-table-thead': {
      opacity: 0,
      position: 'absolute',
    },
    height: '100%',
    '.ant-table, .ant-table-content,.ant-table-container': {
      height: '100%',
    },
    '.ant-table-row:hover': {
      '.dropdownIcon': {
        visibility: 'visible',
      },
    },
    '.ant-table-expanded-row': {
      'td[colspan]': {
        padding: '0px!important',
        '.ant-table-scroll-horizontal': {
          margin: '0px!important',
        },
      },
    },
  },
  ({ isPadding }) => ({
    '.ant-table-thead > tr > th:nth-child(1)': {
      paddingLeft: isPadding ? 64 : 16,
    },
  }),
  ({ isBottom }) => ({
    '.ant-table table': {
      paddingBottom: isBottom,
    },
  }),
)
const HiddenText = styled.div({
  display: 'flex',
  alignItems: 'center',
})
const ClickWrap = styled.div<{ isClose?: boolean; isName?: boolean }>(
  {
    // width: '100%',
    display: 'flex',
    cursor: 'pointer',
    '.icon': {
      display: 'none',
      color: 'var(--neutral-n3)',
    },
    '.text': {
      width: '30%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    '&:hover': {
      '.icon': {
        display: 'flex',
      },
    },
    '.text:hover ,.icon:hover': {
      color: 'var(--primary-d2)',
    },
  },
  ({ isClose, isName }) => ({
    color: isClose ? 'var(--neutral-n3)' : '',
    textDecoration: isName && isClose ? 'line-through' : '',
  }),
)

const CanOperationCategory = styled.div<{ color?: string; bgColor?: string }>(
  {
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    width: 'fit-content',
    '.title': {
      '::before': {
        content: "'#'",
      },
      '::after': {
        content: "'#'",
      },
    },
  },
  ({ color, bgColor }) => ({
    color,
    background: bgColor,
  }),
)

const DividerWrap = styled(Divider)({
  height: 20,
  margin: 0,
})

const ShowWrap = styled.div`
  visibility: hidden;
`

const CategoryWrap = styled.div<{ color: string; bgColor: string }>(
  {
    height: 24,
    borderRadius: 6,
    display: 'inline-flex',
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 8,
    flexShrink: 0,
    color: 'var(--neutral-n2)',
  },
  ({ bgColor }) => ({
    background: bgColor,
  }),
)

const ListNameWrap = styled.div<{
  isClose?: boolean
  isName?: boolean
  maxWidth?: any
}>(
  {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0px',
    cursor: 'pointer',
    '.controlMaxWidth': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-block',
      maxWidth: '400px',
    },
    '&: hover': {
      color: 'var(--primary-d2)',
    },
  },
  ({ isClose, isName, maxWidth }) => ({
    color: isClose ? 'var(--neutral-n3)' : '',
    textDecoration: isName && isClose ? 'line-through' : '',
    // span: {
    //   maxWidth: maxWidth || 300,
    // },
  }),
)

const StatusWrap = styled.div<{ isShow?: boolean; state?: number }>(
  {
    height: 22,
    borderRadius: 6,
    fontSize: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '1px 14px',
  },
  ({ isShow, state }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    color:
      state === 1
        ? 'var(--neutral-white-d7)'
        : state === 2
        ? 'var(--neutral-n1-d1)'
        : state === 3
        ? 'var(--neutral-white-d7)'
        : '',
    background:
      state === 1
        ? 'var(--auxiliary-b1)'
        : state === 2
        ? 'var(--neutral-n7)'
        : state === 3
        ? 'var(--function-success)'
        : '',
  }),
)

const IconFontWrapEdit = styled(IconFont)<{ isTable?: any }>(
  {
    marginLeft: 16,
    color: 'var(--primary-d2)',
    visibility: 'hidden',
  },
  ({ isTable }) => ({
    fontSize: isTable ? 20 : 14,
  }),
)

const CanOperation = styled.div<{
  isCanEdit?: any
  isTable?: any
}>(
  {
    display: 'flex',
    alignItems: 'center',
    minHeight: 32,
    borderRadius: 4,
    flex: 1,
  },
  ({ isCanEdit, isTable }) => ({
    cursor: isCanEdit ? 'pointer' : 'inherit',
    justifyContent: isTable ? 'flex-start' : 'space-between',
    minWidth: isTable ? 0 : 60,
    padding: isTable ? 0 : '0 8px',
    '&: hover': {
      background: isTable ? '' : isCanEdit ? 'var(--hover-d3)' : '',
      [IconFontWrapEdit.toString()]: {
        visibility: 'visible',
      },
    },
  }),
)

const StyledShape = styled.div<{ color: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  text-align: center;
  border: 1px solid rgba(40, 119, 255, 1);
  border-color: ${({ color }) => color};
  color: ${({ color }) => color};
  cursor: pointer;
`

// 列表的加号，获取子需求
const ExpendedWrap = styled(IconFont)({
  marginRight: 12,
  color: 'var( --neutral-n4)',
  fontSize: 16,
  cursor: 'pointer',
  zIndex: 1,
  '&: hover': {
    color: 'var(--primary-d1)',
  },
})

const StepBoxWrap = styled.div<{ active?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'SiYuanMedium',
    fontSize: 14,
    '.circle': {
      color: 'white',
      width: 27,
      height: 27,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    span: {
      marginLeft: 5,
    },
  },

  ({ active }) => ({
    '.border': {
      borderRadius: '50%',
      border: active ? '3px solid rgba(40, 119, 255, 0.2)' : '',
    },
    '.circle': {
      background: active ? 'var(--primary-d1)' : 'var(--neutral-n4)',
      // border: active
      //   ? '3px solid rgba(40, 119, 255, 0.2)'
      //   : '3px solid var(--neutral-n4)',
    },
    span: {
      color: active ? 'var(--primary-d1)' : 'var(--neutral-n2)',
    },
  }),
)

const SecondTitle = styled.span`
  padding-left: 8px;
  /* border-left: 9px solid var(--primary-d1); */
  height: 24px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  line-height: 24px;
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

const TabsItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    div: {
      fontSize: 16,
      fontWeight: 400,
      height: 62,
      lineHeight: '62px',
    },
  },
  ({ isActive }) => ({
    div: {
      color: String(isActive ? 'var(--primary-d1)' : 'var(--neutral-n1-d1)'),
      borderBottom: `3px solid ${
        isActive ? 'var(--primary-d1)' : 'var(--neutral-white-d2)'
      }`,
    },
  }),
)
const LabNumber = styled.div<{ isActive: boolean }>`
  margin-left: 12px;
  height: 20px;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;

  color: ${({ isActive }) => (isActive ? 'white' : 'rgba(150, 151, 153, 1)')};
  background: ${({ isActive }) =>
    isActive ? 'var(--primary-d2)' : 'rgba(242, 242, 244, 1)'};
`

const NameWrap = styled.div({
  width: 24,
  height: 24,
  borderRadius: 16,
  background: '#A4ACF5',
  color: 'var(--neutral-white-d2)',
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  overflow: 'hidden',
})

const ViewWrap = styled.div<{ color: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '20px',
    fontSize: 12,
    fontWeight: 400,
    width: 'fit-content',
    background: 'white',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

const DelWrap = styled.span({
  fontSize: 12,
  marginLeft: 8,
  color: 'var(--neutral-n3)',
  textDecoration: 'line-through',
})

const StatusTag = styled.div<{ status: number }>(
  {
    height: 22,
    borderRadius: 6,
    textAlign: 'center',
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    cursor: 'pointer',
    width: 'fit-content',
  },
  ({ status }) => ({
    color:
      status === 1
        ? 'var(--primary-d2)'
        : status === 2
        ? 'var(--function-success)'
        : 'var(--neutral-n3)',
    background:
      status === 1
        ? 'var(--selected)'
        : status === 2
        ? 'var(--function-tag2)'
        : 'var(--function-tag6)',
    '&:hover': {
      background:
        status === 1
          ? 'var(--selected) !important'
          : status === 2
          ? 'var(--function-tag2)!important'
          : 'var(--function-tag6)!important',
    },
  }),
)

const ProgressWrap = styled.div({
  background: 'white',
  padding: '16px 24px',
  borderRadius: 6,
})

const SelectWrap = styled(CustomSelect)`
  .ant-select-selector {
    min-width: 140px;
    border: none !important;
    outline: none !important;
  }

  .ant-select-selection-placeholder {
    color: var(--neutral-n4);
  }
`

const DropdownWrap = styled(Dropdown)({
  cursor: 'pointer',
  visibility: 'hidden',
  '&: hover': {
    svg: {
      color: 'var(--auxiliary-b1)',
    },
  },
  '.ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title': {
    textAlign: 'left',
  },
})

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 20px 0 24px',
  position: 'relative',
})

const SeverityWrap = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  border-radius: 50px;
  padding: 0 8px;
  font-size: 12px;
  color: var(--neutral-n1-d1);
`

const DragTableIcon = styled(IconFont)`
  font-size: 16px;
  color: var(--neutral-n3);
  cursor: pointer;
`

const PriorityWrapTable = styled.div<{ isShow?: any }>(
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

const PopoverTargetText = styled.div`
  max-width: 560px;
  padding: 8px 16px;
  max-height: 300px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: var(--neutral-white-d6);
  font-size: 14px;
  color: var(--neutral-n1-d1);
  white-space: pre;
  overflow-y: auto;
`

const LinkWrap = styled.div`
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

const Tag = styled.div`
  height: 20px;
  background: rgba(161, 118, 251, 0.1);
  border-radius: 4px;
  color: #7641e8;
  text-align: center;
  line-height: 20px;
  padding: 0 8px;
  margin-left: 8px;
  font-size: 12px;
`
export {
  Tag,
  ChartsItem1,
  ChartsItem2,
  title1Css1,
  HiddenText,
  ClickWrap,
  TableStyleBox,
  CloseWrap,
  ChartsItem,
  chartsTitle,
  ChartsWrap,
  HightChartsWrap,
  HomeWrap,
  TextBlueWrap,
  TextWrap,
  title1Css,
  title2Css,
  titleCss,
  HasIconMenu,
  HoverWrap,
  DateQuickWrap,
  AddWrap,
  PriorityWrap,
  SliderWrap,
  DelButton,
  SelectWrapBedeck,
  SearchLine,
  CanOperationCategory,
  DividerWrap,
  ShowWrap,
  CategoryWrap,
  ListNameWrap,
  StatusWrap,
  CanOperation,
  IconFontWrapEdit,
  StyledShape,
  ExpendedWrap,
  StepBoxWrap,
  SecondTitle,
  TabsItem,
  LabNumber,
  ViewWrap,
  NameWrap,
  DelWrap,
  StatusTag,
  ProgressWrap,
  DragLine,
  SelectWrap,
  DropdownWrap,
  ModalFooter,
  MouseDom,
  SeverityWrap,
  DragTableIcon,
  PriorityWrapTable,
  TextWrapEdit,
  PopoverTargetText,
  LinkWrap,
  ChartsItem333,
  TableBorder,
}
