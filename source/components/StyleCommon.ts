/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
// 两次以上的公共样式

import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Button, Divider, Progress, Slider, Table } from 'antd'
import IconFont from './IconFont'

// 弹窗右上角关闭图标
const CloseWrap = styled.div<{ width?: any; height?: any }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
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

const ChartsItem = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const titleCss = css`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  font-family: SiYuanMedium;
`

const title1Css = css`
  color: var(--neutral-n1-d1);
  font-size: 24px;
`

const title2Css = css`
  color: var(--neutral-n1-d1);
  font-size: 12px;
`

const chartsTitle = css`
  color: var(--neutral-n1-d1);
  font-size: 12px;
  margin-bottom: 10px;
`

const HomeWrap = styled.div`
  height: 104px;
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`

const TextWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 16px;
`
const TextBlueWrap = styled.div`
  width: 104px;
  height: 104px;
  background: var(--hover-d2);
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
        color: 'var(--neutral-n1-d1)',
      },
      '.icon': {
        color: 'var(--neutral-n1-d1)',
      },
    },
  },
  ({ isCheck }) => ({
    '.label': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n2)',
    },
    '.icon': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n2)',
    },
  }),
)

// 新版移入效果例：项目列表左上方操作
const HoverWrap = styled.div<{ isActive?: any }>(
  {
    transition: 'all .5s',
    padding: '0 8px',
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--neutral-n2)',
    '.iconMain': {
      marginRight: 8,
      fontSize: 18,
    },
    svg: {
      fontSize: 18,
    },
    '&: hover': {
      background: '#F4F5F5',
      color: 'var(--neutral-n1-d1)',
    },
  },
  ({ isActive }) => ({
    background: isActive ? '#F4F5F5' : 'white',
    color: isActive ? 'var(--neutral-n1-d1)!important' : 'var(--neutral-n2)',
  }),
)

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
      backgroundColor: '#F2F2F4!important',
      borderRadius: 10,
    },
    '.ant-slider-track': {
      backgroundColor: '#43BA9A!important',
    },
    '.ant-slider-handle': {
      width: 20,
      height: 20,
      border: '1px solid #EBEDF0!important',
      marginTop: -7,
    },
    '.ant-slider-handle:focus': {
      boxShadow: 'none',
    },
  },
  ({ isDisabled }) => ({
    '.ant-slider-handle': {
      '&: hover': {
        border: isDisabled ? '1px solid #2877FF!important' : '',
      },
    },
  }),
)

const SelectWrapBedeck = styled.div`
  height: 32px;
  position: relative;
  height: 32px;
  border: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  border-radius: 6px;
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
  .ant-select-selection-placeholder {
    color: black;
  }
`

const SearchLine = styled.div`
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  gap: 16px;
  padding-left: 24px;
  background: rgba(255, 255, 255, 1);
`

// 次按钮样式
const SecondButton = styled(Button)`
  height: 32px;
  border-radius: 6px;
  background: #f0f4fa;
  cursor: pointer;
  padding: 0 16px;
  color: #2877ff;
  display: flex;
  align-items: center;
  svg {
    font-size: 16px;
  }
  div {
    margin-left: 8px;
    font-size: 14px;
  }
  &:hover {
    background: #e8f1ff !important;
    color: #2877ff !important;
  }
  &:focus {
    background: #dbeaff;
    color: #2877ff;
  }
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
      color: '#969799',
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
    cursor: 'pointer',
    '&: hover': {
      color: '#2877ff',
    },
  },
  ({ isClose, isName }) => ({
    color: isClose ? '#969799' : '',
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
    height: 22,
    borderRadius: 11,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 8,
    flexShrink: 0,
    '::before': {
      content: "'#'",
    },
    '::after': {
      content: "'#'",
    },
  },
  ({ color, bgColor }) => ({
    background: bgColor,
    color,
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
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    cursor: 'pointer',
    '&: hover': {
      color: '#2877ff',
    },
  },
  ({ isClose, isName, maxWidth }) => ({
    color: isClose ? '#969799' : '',
    textDecoration: isName && isClose ? 'line-through' : '',
    maxWidth: maxWidth || 500,
  }),
)

const StatusWrap = styled.div<{ isShow?: boolean; state?: number }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
  },
  ({ isShow, state }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    color:
      state === 1
        ? 'var(--neutral-n7)'
        : state === 2
        ? 'var(--neutral-n1-d1)'
        : state === 3
        ? 'var(--neutral-n7)'
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
    color: '#2877ff',
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
  },
  ({ isCanEdit, isTable }) => ({
    cursor: isCanEdit ? 'pointer' : 'inherit',
    justifyContent: isTable ? 'flex-start' : 'space-between',
    minWidth: isTable ? 0 : 60,
    padding: isTable ? 0 : '0 8px',
    '&: hover': {
      background: isTable ? '' : isCanEdit ? '#f4f5f5' : '',
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
  color: '#BBBDBF',
  fontSize: 16,
  cursor: 'pointer',
  background: 'white',
  zIndex: 1,
  '&: hover': {
    color: '#2877ff',
  },
})

const StepBoxWrap = styled.div<{ active?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
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
    '.circle': {
      background: active ? '#2877ff' : '#BBBDBF',
      border: active ? '3px solid #F0F4FA' : '3px solid white',
    },
    span: {
      color: active ? '#2877ff' : '#646566',
    },
  }),
)

const SecondTitle = styled.span`
  padding-left: 8px;
  border-left: 3px solid #2877ff;
  height: 24px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #323233;
  line-height: 24px;
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
      color: String(isActive ? '#2877FF' : '#323233'),
      borderBottom: `3px solid ${isActive ? '#2877FF' : 'white'}`,
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
    isActive ? '#2877ff' : 'rgba(242, 242, 244, 1)'};
`

const NameWrap = styled.div({
  width: 24,
  height: 24,
  borderRadius: 16,
  background: '#A4ACF5',
  color: 'white',
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
  color: '#969799',
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
    color: status === 1 ? '#2877FF' : status === 2 ? '#43BA9A' : '#969799',
    background: status === 1 ? '#F2F7FF' : status === 2 ? '#EDF7F4' : '#F2F2F4',
  }),
)

const ProgressWrap = styled.div({
  background: 'white',
  padding: '16px 24px',
  borderRadius: 6,
})

export {
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
  SelectWrapBedeck,
  SearchLine,
  SecondButton,
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
}
