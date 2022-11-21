/* eslint-disable max-lines */
// 两次以上的公共样式

/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Table, Input, Slider, Divider, Form, Progress } from 'antd'
import IconFont from './IconFont'

const TextWrapEditor = styled.div({
  p: {
    marginBottom: '0px!important',
  },
  img: { maxWidth: '100%' },
})

const CloseWrap = styled.div<{ width?: any; height?: any; isRight?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&: hover': {
      '.anticon': {
        color: '#2877ff',
      },
    },
  },
  ({ width, height, isRight }) => ({
    width,
    height,
    justifyContent: isRight ? 'right' : 'center',
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
      border: '1px solid  #F0F4FA',
      background: '#F0F4FA',
      color: '#2877ff',
    },
  },
  ({ isActive }) => ({
    border: isActive ? '1px solid #2877ff' : '1px solid #EBEDF0',
    color: isActive ? '#2877ff' : '#646566',
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

const CanOperation = styled.div<{ isCanEdit?: any; isTable?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    minHeight: 32,
    borderRadius: 4,
    padding: '0 8px',
  },
  ({ isCanEdit, isTable }) => ({
    cursor: isCanEdit ? 'pointer' : 'inherit',
    justifyContent: isTable ? 'flex-start' : 'space-between',
    minWidth: isTable ? 0 : 60,
    '&: hover': {
      background: isTable ? '' : isCanEdit ? '#F0F4FA' : '',
      [IconFontWrapEdit.toString()]: {
        visibility: 'visible',
      },
    },
  }),
)

const editButton = css`
  padding: 0 16px;
  height: 32px;
  border-radius: 6px;
  background: #f2f2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #646566;
  cursor: pointer;
  font-size: 14px;
  width: fit-content;
  &:hover {
    background-color: #f0f4fa;
    color: #2877ff;
  }
`

const ProgressWrapUpload = styled(Progress)({
  '.ant-progress-status-exception .ant-progress-bg': {
    backgroundColor: '#ff5c5e',
    height: '2px !important',
  },
  '.ant-progress-status-exception .ant-progress-text': {
    color: '#ff5c5e',
  },
  '.ant-progress-success-bg .ant-progress-bg': {
    backgroundColor: '#2877ff',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-bg': {
    backgroundColor: '#43ba9a',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-text': {
    color: '#43ba9a',
  },
  '.ant-progress-inner': {
    height: '2px !important',
    minWidth: 200,
  },
  '.ant-progress-small.ant-progress-line,.ant-progress-small.ant-progress-line .ant-progress-text .anticon':
    {
      fontSize: 10,
    },
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

const FormWrapDemand = styled(Form)({
  padding: '0 20px 0 2px',
  '.labelIcon': {
    display: 'flex',
    alignItems: 'flex-start',
    svg: {
      fontSize: 16,
      color: '#969799',
      margin: '3px 8px 0 0',
    },
  },
  '.ant-form-item-label': {
    '> label::after': {
      display: 'none',
    },
    '> label': {
      display: 'flex',
      alignItems: 'flex-start',
    },
    '.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after':
      {
        display: 'inline-block',
        color: '#ff4d4f',
        fontSize: 14,
        content: "'*'",
      },
    '> label::before': {
      display: 'none!important',
    },
  },
  '.ant-form-item': {
    width: '100%',
  },
  '.ant-form-item-control-input': {
    minHeight: 'inherit',
  },
})

const IconFontWrap = styled(IconFont)<{ active?: boolean; isHover?: any }>(
  {
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
  ({ isHover }) => ({
    '&: hover': {
      color: isHover ? '#2877FF' : '#969799',
    },
  }),
)

const DividerWrap = styled(Divider)({
  height: 20,
  margin: 0,
})

const ListNameWrap = styled.div<{ isClose?: boolean; isName?: boolean }>(
  {
    padding: '10px 20px',
    maxWidth: 500,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
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

const HiddenText = styled.div({
  display: 'flex',
  alignItems: 'center',
})

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

const DelWrap = styled.span({
  fontSize: 12,
  marginLeft: 8,
  color: '#969799',
  textDecoration: 'line-through',
})

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
    color: hasColor ? '#2877FF' : '#969799',
    border: hasDash ? '1px dashed #969799' : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed #2877ff' : '',
      background: hasColor ? '#F0F4FA' : '',
      '.anticon': {
        svg: {
          color: '#2877ff',
        },
      },
      div: {
        color: '#2877ff',
      },
    },
    '&: active': {
      background: hasColor ? '#DBEAFF' : '',
    },
  }),
)

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

const ProgressWrap = styled.div({
  background: 'white',
  padding: '16px 24px',
  borderRadius: 6,
})

const SliderWrap = styled(Slider)<{ isDisabled?: boolean }>(
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

const NameWrap = styled.div({
  width: 32,
  height: 32,
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

const TableWrap = styled(Table)({
  '.ant-table table': {
    paddingBottom: 10,
  },
})

const StaffHeader = styled.div`
  color: rgba(0, 0, 0, 1);
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 24px;
  font-size: 16px;
  height: 64px;
  background: rgba(255, 255, 255, 1);
`
const Hehavior = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  height: 52px;
  background: rgba(255, 255, 255, 1);
  align-items: center;
  border-bottom: 1px solid #f8f9fb;
`
const TabsHehavior = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  height: 65px;
  background: rgba(255, 255, 255, 1);
  align-items: center;
  box-sizing: border-box;
  padding-left: 24px;
`
const PaginationWrap = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 16px;
`

const StaffTableWrap = styled.div`
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 16px 24px 0px;
  background: #f5f7fa;
`

const StaffTableWrap2 = styled(StaffTableWrap)`
  padding-top: 0;
`
const MyInput = styled(Input)`
  font-size: 14px;
  width: 240px;
  height: 32px;
  background: rgba(245, 246, 247, 1);
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;
  margin-left: 24px;
  padding: 5px 12px 5px 12px;
  border: 1px solid white;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`
const SearchLine = styled.div`
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  gap: 16px;
  padding-left: 24px;
  min-height: 64px;
  background: rgba(255, 255, 255, 1);
`
const SetButton = styled.div<{ show?: boolean }>`
  cursor: pointer;
  text-align: center;
  width: 52px;
  height: 20px;
  border-left: 1px solid #d5d6d9;
  color: #bbbdbf;
  position: relative;
  color: ${({ show }) => (show ? ' rgba(40, 119, 255, 1)' : '')};
  &:hover {
    color: rgba(40, 119, 255, 1);
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
const tabCss = css`
  display: flex;
  align-items: center;
  margin-right: 32px;
`
const SwiperWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;
  padding: 0 24px;
  height: 144px;
  background-color: #f5f7fa;
  overflow: hidden;
  & .swiper {
    overflow: visible;
    margin: 0;
  }
  & .swiper-wrapper {
    max-width: 1400px;
    width: 100%;
    display: flex;
  }
  & .swiper-slide {
    width: auto !important;
  }
`
const titleCss = css`
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
  font-weight: bold;
`
const title1Css = css`
  color: rgba(40, 119, 255, 1);
  font-size: 24px;
`
const title2Css = css`
  color: rgba(100, 101, 102, 1);
  font-size: 12px;
`
const chartsTitle = css`
  color: rgba(100, 101, 102, 1);
  font-size: 12px;
  margin-bottom: 10px;
`
const ChartsWrap = styled.div`
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 16px 24px;
  border-radius: 6px;
`
const HomeWrap = styled.div`
  height: 104px;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`
const ChartsItem = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ShowWrap = styled.div`
  visibility: hidden;
`
const StyledTable = styled(Table)({
  '.ant-table-row:hover': {
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table table': {
    paddingBottom: 10,
  },
})
const SecondTitle = styled.span`
  padding-left: 8px;
  border-left: 3px solid #2877ff;
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
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
  background: rgba(205, 221, 253, 0.3);
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
const StatusWrap = styled.div<{ isShow?: boolean }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #2877FF',
    color: '#2877FF',
    width: 'fit-content',
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
  }),
)

const PriorityWrap = styled.div<{ status?: any }>({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  height: 26,
  padding: '0 6px',
  width: 'fit-content',
  borderRadius: 6,
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '.priorityIcon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
  '&: hover': {
    background: 'rgba(240, 244, 250, 1)',
    '.icon': {
      visibility: 'visible',
    },
  },
})

// 表格-滚动条居底
const TableStyleBox = styled(TableWrap)<{
  isPadding?: any
  isBottom?: any
  isHover?: any
}>(
  {
    height: '100%',
    '.ant-table, .ant-table-content,.ant-table-container': {
      height: '100%',
    },
    '.ant-table-row:hover': {
      '.dropdownIcon': {
        visibility: 'visible',
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

export {
  PriorityWrap,
  StatusWrap,
  StaffTableWrap2,
  StyledShape,
  HightChartsWrap,
  TextWrap,
  TextBlueWrap,
  SecondTitle,
  TableWrap,
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  TabsHehavior,
  TabsItem,
  LabNumber,
  tabCss,
  SwiperWrap,
  titleCss,
  title1Css,
  title2Css,
  chartsTitle,
  ChartsWrap,
  HomeWrap,
  ChartsItem,
  ShowWrap,
  StyledTable,
  ClickWrap,
  CategoryWrap,
  ViewWrap,
  NameWrap,
  SliderWrap,
  ProgressWrap,
  StepBoxWrap,
  HiddenText,
  AddWrap,
  DelWrap,
  SelectWrapBedeck,
  DividerWrap,
  IconFontWrap,
  FormWrapDemand,
  ListNameWrap,
  StatusTag,
  ProgressWrapUpload,
  editButton,
  CanOperation,
  IconFontWrapEdit,
  DateQuickWrap,
  CloseWrap,
  TextWrapEditor,
  TableStyleBox,
}
